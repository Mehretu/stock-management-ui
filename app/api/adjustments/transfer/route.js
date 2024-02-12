import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request){
try{
    const {
        transferStockQty,
        itemId,
        givingWarehouseId,
        recievingWarehouseId,
        notes,
        referenceNumber
    }=await request.json();
    //Get the giviving warehouse
    const givingWarehouse =await db.warehouse.findUnique({
        where:{
            id:givingWarehouseId
        }
    })
    //Get current stock
    const currentGivingWarehouseStock = givingWarehouse.stockQty;

    if(parseInt(currentGivingWarehouseStock) > parseInt(transferStockQty)){
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
    
    
    
        //Get the recieving warehouse
        const recievingWarehouse =await db.warehouse.findUnique({
            where:{
                id:recievingWarehouseId
            }
        })
        //Get current stock
        const currentRecievingWarehouseStock = recievingWarehouse.stockQty;
        const newStockForRecievingWarehouse =parseInt(currentRecievingWarehouseStock) + parseInt(transferStockQty)
        //Update Stock
        const updatedRecievingWarehouse = await db.warehouse.update({
            where:{
                id:recievingWarehouseId,
            },
            data:{
                stockQty:newStockForRecievingWarehouse
            }
        })
    
        const adjustment= await db.transferStockAdjustment.create({
            data:{
                transferStockQty :parseInt(transferStockQty),
                itemId,
                givingWarehouseId,
                recievingWarehouseId,
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
        const adjustments = await db.transferStockAdjustment.findMany({
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
        const deletedAdjustment = await db.transferStockAdjustment.delete({
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