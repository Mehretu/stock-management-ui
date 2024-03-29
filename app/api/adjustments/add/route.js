import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request){
try{
    const {itemId,referenceNumber,supplierId,addStockQty,recievingWarehouseId,notes}=await request.json();
    
     //Get the Item
     const itemToUpdate = await db.item.findUnique({
        where:{
            id:itemId
        }
    })
    console.log(itemToUpdate)
    //Current Item Quantity
    const currentItemQty = itemToUpdate.quantity;
    const newQty = parseInt(currentItemQty) + parseInt(addStockQty)
     //Modify the item to the new quantity


    const updatedItem= await db.item.update({
        where:{
            id:itemId,
        },
        data:{
            quantity:newQty,
        },
    })
    // Get the warehouse   
    const warehouse =await db.warehouse.findUnique({
        where: {
            id:recievingWarehouseId,
        },
    })
    //current stock of the warehouse
    const currentWarehouseStock = warehouse.stockQty;
    const newStockQty = parseInt(currentWarehouseStock) + parseInt(addStockQty)
    //update the stock on the warehouse
    const updatedWarehouse = await db.warehouse.update({
        where:{
            id:recievingWarehouseId,
        },
        data:{
            stockQty:newStockQty,
            items:{
                connect:{
                    id:itemId,
                }
            }
        }
    })

    // console.log(updatedItem)
    const adjustment= await db.addStockAdjustment.create({
        data:{
            itemId,
            referenceNumber,
            addStockQty: parseInt(addStockQty),
            recievingWarehouseId,
            supplierId,
            notes,
            
        },
    })
   


    //Affect the warehouse
    console.log(adjustment);
    return NextResponse.json(adjustment)
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
        const adjustments = await db.addStockAdjustment.findMany({
            orderBy:{
                createdAt:'desc'
            },
            
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
        const deletedAdjustment = await db.addStockAdjustment.delete({
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