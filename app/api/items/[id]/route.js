import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request,{params:{id}}){
    try {
        const item = await db.item.findUnique({
            where:{
                id
            },
            include:{
                category:true,
                supplier:true,
                warehouse:true,
                shop:true,
                unit:true,
                brand:true,
                priceHistory:true,
            }
        });
        return NextResponse.json(item)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Fetch item"
        },{
            status:500
        })
        
    }
}

export async function PUT(request, { params: { id } }) {
    try {
        const itemData = await request.json();

        // Fetch the existing item data
        const existingItem = await db.item.findUnique({
            where: {
                id
            }
        });

        // Determine the target ID and type
        let targetId, targetType;
        if (itemData.warehouseId !== null && itemData.warehouseId !== undefined) {
            targetId = itemData.warehouseId;
            targetType = 'warehouse';
        } else if (existingItem.shopId !== null && existingItem.shopId !== undefined) {
            targetId = existingItem.shopId;
            targetType = 'shop';
        } else {
            throw new Error('No target ID found. Cannot determine warehouse or shop.');

        }

        // Fetch the data based on the target ID and type
        const targetData = targetType === 'warehouse' ?
            await db.warehouse.findUnique({
                where: {
                    id: targetId
                }
            }) :
            await db.shop.findUnique({
                where: {
                    id: targetId
                }
            });

        // Calculate new quantity
        const existingQuantity = parseInt(existingItem.quantity);
        const currentTargetQuantity = parseInt(targetData.stockQty);
        let newTargetQuantity = 0;

        if (parseInt(itemData.quantity) > existingQuantity) {
            const toBeAdded = parseInt(itemData.quantity) - existingQuantity;
            newTargetQuantity = currentTargetQuantity + toBeAdded;
        } else if (parseInt(itemData.quantity) < existingQuantity) {
            const difference = existingQuantity - parseInt(itemData.quantity);
            newTargetQuantity = currentTargetQuantity - difference;
        }

        // Update the stock quantity in the appropriate location (warehouse or shop)
        const updateData = targetType === 'warehouse' ? {
            stockQty: newTargetQuantity
        } : {
            stockQty: newTargetQuantity
        };

        const updatedTarget = targetType === 'warehouse' ?
            await db.warehouse.update({
                where: {
                    id: targetId
                },
                data: updateData
            }) :
            await db.shop.update({
                where: {
                    id: targetId
                },
                data: updateData
            });
            const unitVat =  parseFloat(itemData.taxRate/100) * parseFloat(itemData.sellingPrice);
            const totalPrice = parseInt(itemData.quantity) * parseFloat(itemData.sellingPrice);
            const totalVat = parseFloat(itemData.taxRate/100) * parseFloat(totalPrice);

            const updatedHistory = [];
            for (const field in itemData) {
              if (existingItem[field] !== itemData[field]) {
                updatedHistory.push({
                  action: `Updated ${field}`,
                  oldValue: existingItem[field],
                  newValue: itemData[field],
                  date: new Date(), // Capture timestamp
                });
                updateData[field] = itemData[field]
              }
            }
        
            

        // Update the item
        const updatedItem = await db.item.update({
            where: {
                id
            },
            data: {
                title: itemData.title,
                categoryId: itemData.categoryId,
                itemNumber: itemData.itemNumber,
                barcode: itemData.barcode,
                quantity: parseInt(itemData.quantity),
                unitId: itemData.unitId,
                brandId: itemData.brandId,
                buyingPrice: parseFloat(itemData.buyingPrice),
                sellingPrice: parseFloat(itemData.sellingPrice),
                supplierId: itemData.supplierId,
                reOrderPoint: parseInt(itemData.reOrderPoint),
                [targetType === 'warehouse' ? 'warehouseId' : 'shopId']: targetId,
                imageUrl: itemData.imageUrl,
                weight: parseFloat(itemData.weight),
                dimensions: itemData.dimensions,
                taxRate: parseFloat(itemData.taxRate),
                unitVat:parseFloat(unitVat),
                unitPriceWithVat: parseFloat(itemData.sellingPrice) + parseFloat(unitVat),
                totalPriceWithVat: parseFloat(totalVat) + parseFloat(totalPrice),
                description: itemData.description,
                notes: itemData.notes,
                totalPrice: totalPrice ,
                history: existingItem.history ? existingItem.history.concat(updatedHistory) : updatedHistory,
                itemStatus: parseInt(itemData.quantity) > 5 ? "AVAILABLE" : parseInt(itemData.quantity) > 0 ? "LOW_IN_QUANTITY" : "NOT_AVAILABLE"
            },
        });

        console.log(updatedItem);
        return NextResponse.json(updatedItem);
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            error,
            message: "Failed to update the item"
        }, {
            status: 500
        });
    }
}


export async function DELETE(request, { params: { id } }) {
    try {
        const item = await db.item.findUnique({
            where:{
                id
            }
        });

        if (!item) {
            // If item does not exist, respond with a not found message and status code 404
            return NextResponse.json({
                message: `Item with ID ${id} not found`
            }, {
                status: 404
            });
        }
        const warehouse =await db.warehouse.findUnique({
            where: {
                id:item.warehouseId
            },
        })
        const curretWarehouseQty = warehouse.stockQty;
        // Perform the deletion of the item with the specified ID
        const deletedItem = await db.item.delete({
            where: {
                id
            }
        });
        const deletedQty = deletedItem.quantity;
        const decrementedQty = parseInt(curretWarehouseQty) - parseInt(deletedQty)
        
        await db.warehouse.update({
            where:{
                id:item.warehouseId
            },
            data:{
                quantity:decrementedQty
            }
        })
        
        // Respond with a success message
        return NextResponse.json({ message: `Item with ID ${id} deleted successfully` });
    } catch (error) {
        // If an error occurs during deletion, respond with an error message and status code 500
        console.error(error);
        return NextResponse.json({
            error,
            message: `Failed to delete the item with ID ${id}`
        }, {
            status: 500
        });
    }
}