import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request){
try{
    const {itemId,referenceNumber,supplierId,addStockQty,recievingShopId,notes}=await request.json();
    
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
    // Get the shop   
    const shop =await db.shop.findUnique({
        where: {
            id:recievingShopId,
        },
    })
    //current stock of the shop
    const currentShopStock = shop.stockQty;
    const newStockQty = parseInt(currentShopStock) + parseInt(addStockQty)
    //update the stock on the shop
    const updatedShop = await db.shop.update({
        where:{
            id:recievingShopId,
        },
        data:{
            stockQty:newStockQty,
            items: {
                // Append the itemId to the existing items array
                connect: {
                    id: itemId,
                },
            }
        }
    })

    // console.log(updatedItem)
    const adjustment= await db.addStocktoShop.create({
        data:{
            itemId,
            referenceNumber,
            addStockQty: parseInt(addStockQty),
            recievingShopId,
            supplierId,
            notes,
            
        },
    })
   


    //Affect the shop
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
        const adjustments = await db.addStocktoShop.findMany({
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
        const deletedAdjustment = await db.addStocktoShop.delete({
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