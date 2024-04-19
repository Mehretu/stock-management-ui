import db from "@/lib/db";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export async function POST(request){
try{
    const {
        transferStockQty,
        itemId,
        givingWarehouseId,
        recievingShopId,
        notes,
        referenceNumber
    }=await request.json();

    const existingItem = await db.item.findUnique({
        where:{
            id:itemId,
        }
    })
    console.log(existingItem)
    //Get the giviving warehouse
    console.log(request)
    const givingWarehouse =await db.warehouse.findUnique({
        where:{
            id:givingWarehouseId
        }
    })
   

    
    //Get current stock
    const currentGivingWarehouseStock = givingWarehouse.stockQty;

    if(parseInt(currentGivingWarehouseStock) >= parseInt(transferStockQty)){
        const newStockForGivingWarehouse =parseInt(currentGivingWarehouseStock) - parseInt(transferStockQty)
        //Update Stock
        const updatedGivingWarehouse = await db.warehouse.update({
            where:{
                id:givingWarehouseId,
            },
            data:{
                stockQty:newStockForGivingWarehouse
            }
        })

        //Get the recieving shop
        const recievingShop =await db.shop.findUnique({
            where:{
                id:recievingShopId
            }
        })
        //Get current stock
        const currentRecievingShopStock = recievingShop.stockQty;
        const newStockForRecievingShop =parseInt(currentRecievingShopStock) + parseInt(transferStockQty)
        //Update Stock
        const updatedRecievingShop = await db.shop.update({
            where:{
                id:recievingShopId,
            },
            data:{
                stockQty:newStockForRecievingShop,
                
            }   
        })
        const generatedSKU = `SKU-${nanoid(6)}`;
        const transferedItem = await db.item.create({
            data:{
                ...existingItem,
            
                id:undefined,
                itemNumber:generatedSKU,
                categoryId:existingItem.categoryId,
                title:existingItem.title,
                barcode:existingItem.barcode,
                unitId:existingItem.unitId,
                brandId:existingItem.brandId,
                buyingPrice:parseFloat(existingItem.buyingPrice),
                sellingPrice:parseFloat(existingItem.sellingPrice),
                supplierId:existingItem.supplierId,
                reOrderPoint:parseInt(existingItem.reOrderPoint),
                imageUrl:existingItem.imageUrl,
                weight:parseFloat(existingItem.weight),
                dimensions:existingItem.dimensions,
                taxRate:parseFloat(existingItem.taxRate),
                description:existingItem.description,
                notes:existingItem.notes,
                warehouseId:null,
                quantity: parseInt(transferStockQty),
                shopId: recievingShopId,
                itemStatus:parseInt(transferStockQty) > 5 ? "AVAILABLE":parseInt(transferStockQty) >0 ? "LOW_IN_QUANTITY": "NOT_AVAILABLE",
                totalPrice:parseInt(transferStockQty) * parseInt(existingItem.sellingPrice)

                
                
            }
        })
        console.log(transferedItem)
        // await db.item.update({
        //     where: { id: transferedItem.id },
        //     data: { 
        //         warehouse: {
        //             disconnect:true
        //         } }
        // });

        const decrementedQuantity = parseInt(existingItem.quantity) - parseInt(transferStockQty)

        const updatedExistingItem = await db.item.update({
            where:{
                id:itemId,
            },
            data:{
                quantity: decrementedQuantity,
                itemStatus:parseInt(decrementedQuantity) > 5 ? "AVAILABLE":parseInt(decrementedQuantity) >0 ? "LOW_IN_QUANTITY": "NOT_AVAILABLE",
                totalPrice: parseInt(decrementedQuantity) * parseInt(existingItem.sellingPrice)
            }
        })

        
        // const currentItemInStoreQuantity = givenItem.quantity;
        // const newstockForStockInStoreAttribute =parseInt(currentItemInStoreQuantity) - parseInt(transferStockQty)
        //   const updatedItemQuantityInStore = await db.item.update({
        //     where:{
        //         id:itemId,
        //     },
        //     data:{
        //         quantity:newstockForStockInStoreAttribute,
        //     }
        // })
    
        const adjustment= await db.transferStocktoShop.create({
            data:{
                transferStockQty :parseInt(transferStockQty),
                itemId:transferedItem.id,
                givingWarehouseId,
                recievingShopId,
                notes,
                referenceNumber
            }
        })
        console.log(adjustment);
        return NextResponse.json(adjustment)

    }else{
        return NextResponse.json({
            data:null,
            message:"Giving Warehouse has No enough stock"
        },
        {status:409})
    }



}catch(error){
    console.log(error)
    return NextResponse.json({
        error,
        message:"Failed to create an adjustment"
    },{
        status:500
    })
}    
}


export async function GET(request){
    try {
        const adjustments = await db.transferStocktoShop.findMany({
            orderBy:{
                createdAt:'desc'
            },
            include:{
                item:true,
                
            }
        });
        return NextResponse.json(adjustments)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Fetch adjustment",
        },{
            status:500
        })
        
    }
}

export async function DELETE(request){
    try {
        const id = request.nextUrl.searchParams.get("id")
        const deletedAdjustment = await db.transferStocktoShop.delete({
            where:{
                id
            },
        })
        console.log(deletedAdjustment)
        return NextResponse.json(deletedAdjustment)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Delete Adjustment",
        },{
            status:500
        })
        
    }
}