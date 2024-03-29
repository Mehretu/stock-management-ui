import db from "@/lib/db";
import { NextResponse } from "next/server";



export async function POST(request) {
    try {
        const purchaseOrdersData = await request.json();
        console.log("PURCHASE DATA",purchaseOrdersData)

        // const unavailableItems = salesOrderData.items.filter(item => parseFloat(item.availableQuantity) === 0 || parseFloat(item.quantity) > parseFloat(item.availableQuantity));
        // if (unavailableItems.length > 0) {
        //     throw new Error(`Some items are not available in sufficient quantity.`);
        // }

        // Validate other necessary fields (e.g., customer information)
        if (!purchaseOrdersData.supplierId || !purchaseOrdersData.items || purchaseOrdersData.items.length === 0) {
            throw new Error(`Supplier ID and items are required fields.`);
        }

        // Calculate order total based on item prices and quantities including VAT
        const orderTotalWithoutVAT = purchaseOrdersData.items.reduce((total, item) => {
            return total + parseFloat(item.total);
        }, 0);
        console.log("OrderTotalWithoutVat",orderTotalWithoutVAT)
        

        // Determine VAT rate
        let vatRate;
        if (purchaseOrdersData.vat === 'novat') {
            vatRate = 0;
        } else if (purchaseOrdersData.vat === 'vat') {
            vatRate = 0.15; // Assuming VAT rate of 15%
        } else {
            throw new Error(`Invalid VAT option.`);
        }

        // Calculate VAT amount
        const vatAmount = orderTotalWithoutVAT * parseFloat(vatRate);
        console.log("Vat amonut",vatAmount)

        // Calculate order total including VAT
        const orderTotalWithVAT = orderTotalWithoutVAT + vatAmount;
        console.log("Order Total with Vat",orderTotalWithVAT)


       

        console.log("Items",purchaseOrdersData.items)
        const itemPromises = purchaseOrdersData.items.map(async (item) => {
            const originDetails = await fetchOriginDetails(item.itemId);
            return {
                itemId: item.itemId,
                quantity: parseInt(item.quantity),
                price: parseFloat(item.price),
                totalPrice: parseFloat(item.total),
                origin: originDetails.title,
            };
        });
        const itemOrders = await Promise.all(itemPromises);

        // for (const item of purchaseOrdersData.items) {
        //     await decrementItemQuantity(item.itemId, item.quantity,item.availableQuantity);
        // }
        const parsedOrderDate = new Date(purchaseOrdersData.orderDate)
        const isoOrderDate = parsedOrderDate.toISOString();
        

        // Create the purchase order
        const purchaseOrder = await db.purchaseOrder.create({
            data:{
                orderNumber: purchaseOrdersData.orderNumber,
                supplierId: purchaseOrdersData.supplierId,
                orderDate: isoOrderDate,
                purchaseStatus: 'PENDING', // Assuming all orders start as pending
                itemsOrdered: { createMany: {data:itemOrders}},
                totalCost: parseFloat(orderTotalWithVAT), 
                deliveryDate: new Date(purchaseOrdersData.deliveryDate),
                purchaseTotalwithoutVat: orderTotalWithoutVAT,
                vat:vatAmount,
                recievingLocation: purchaseOrdersData.recievingLocation,
            }

        })
        return NextResponse.json(purchaseOrder)
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to create an Purchase Order"
        },{
            status:500
        })
    }
}

async function fetchOriginDetails(itemId) {
    const item = await db.item.findUnique({
       where: {
          id: itemId
       }
    });
 
    let originDetails;
    if (item) {
       if (item.warehouseId) {
          originDetails = await db.warehouse.findUnique({
             where: {
                id: item.warehouseId
             }
          });
       } else if (item.shopId) {
          originDetails = await db.shop.findUnique({
             where: {
                id: item.shopId
             }
          });
       } else {
          throw new Error(`Item does not have a warehouseId or shopId.`);
       }
    } else {
       throw new Error(`Item with ID ${itemId} not found.`);
    }
 
    return originDetails;
 }

 async function decrementItemQuantity(itemId, quantity,availableQuantity) {
    const originDetails = await fetchOriginDetails(itemId);
    const item = await db.item.findUnique({
        where:{
            id:itemId,
        }
    })

    await db.item.update({
        where:{
            id:itemId,
        },
        data:{
            quantity: parseInt(availableQuantity) - parseInt(quantity)
        }
    })

    if (originDetails.id === item.warehouseId) {
        // If the item is associated with a warehouse, decrement the stockQty in the warehouse
        await db.warehouse.update({
            where: { id: originDetails.id },
            data: {
                stockQty: {
                    decrement: Math.min(quantity, originDetails.stockQty)
                }
            }
        });
    } else if (originDetails.id === item.shopId) {
        // If the item is associated with a shop, decrement the stockQty in the shop
        await db.shop.update({
            where: { id: originDetails.id },
            data: {
                stockQty: {
                    decrement: Math.min(quantity, originDetails.stockQty)
                }
            }
        });

    } else {
        throw new Error(`Origin details for item with ID ${itemId} are invalid.`);
    }
}




export async function GET(request){
    try {
        const purchaseOrders = await db.purchaseOrder.findMany({
            orderBy:{
                createdAt:'desc'
            },
            include:{
                supplier: true,
                itemsOrdered:{
                    include:{
                        item:true,
                    }
                } 
            }
        });
        return NextResponse.json(purchaseOrders)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Fetch sales Orders",
        },{
            status:500
        })
        
    }
}
export async function DELETE(request){
    try {
        const id = request.nextUrl.searchParams.get("id")
        const deletedPurchaseOrder = await db.purchaseOrder.delete({
            where:{
                id
            }
        })
        console.log(deletedPurchaseOrder)
        return NextResponse.json(deletedPurchaseOrder)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Delete items",
        },{
            status:500
        })
        
    }
}

