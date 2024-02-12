import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request){
try{

    const itemData=await request.json();
    console.log(itemData) 
    // Get the warehouse   
    const warehouse =await db.warehouse.findUnique({
        where: {
            id:itemData.warehouseId
        },
    })
    //current stock of the warehouse
    const currentWarehouseStock = warehouse.stockQty;
    const newStockQty = parseInt(currentWarehouseStock) + parseInt(itemData.qty)
    //update the stock on the warehouse
    const updatedWarehouse = await db.warehouse.update({
        where:{
            id:itemData.warehouseId,
        },
        data:{
            stockQty:newStockQty
        }
    })
    const item = await db.item.create({
        data:{
                title:itemData.title,
                categoryId:itemData.categoryId,
                sku:itemData.sku,
                barcode:itemData.barcode,
                quantity:parseInt(itemData.quantity) ,
                unitId:itemData.unitId,
                brandId:itemData.brandId,
                buyingPrice:parseFloat(itemData.buyingPrice),
                sellingPrice:parseFloat(itemData.sellingPrice),
                supplierId:itemData.supplierId,
                reOrderPoint:parseInt(itemData.reOrderPoint),
                warehouseId:itemData.warehouseId,
                imageUrl:itemData.imageUrl,
                weight:parseFloat(itemData.weight),
                dimensions:itemData.dimensions,
                taxRate:parseFloat(itemData.taxRate),
                description:itemData.description,
                notes:itemData.notes,

        }
    })
    return NextResponse.json(item)
}catch(error){
    console.log(error)
    return NextResponse.json({
        error,
        message:"Failed to create an Item"
    },{
        status:500
    })
}    
}

export async function GET(request){
    try {
        const items = await db.item.findMany({
            orderBy:{
                createdAt:'desc'
            },
            include:{
                category: true,
                supplier: true,
                warehouse:true,
                brand:true
            }
        });
        return NextResponse.json(items)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Fetch items",
        },{
            status:500
        })
        
    }
}

export async function DELETE(request){
    try {
        const id = request.nextUrl.searchParams.get("id")
        const deleteItem = await db.item.delete({
            where:{
                id
            },
            include:{
                item:true,
            },
        })
        console.log(deleteItem)
        return NextResponse.json(deleteItem)
        
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

