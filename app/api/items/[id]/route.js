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
                warehouse:true
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
export async function PUT(request,{params:{id}}){
    try {
        const itemData = await request.json()
        const item = await db.item.update({
            where:{
                id
            },
            data:{
                title: itemData.title,
                categoryId: itemData.categoryId,
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
            },
        });
        console.log(item)
        return NextResponse.json(item)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Update the item"
        },{
            status:500
        })
        
    }
}

export async function DELETE(request, { params: { id } }) {
    try {
        // Perform the deletion of the item with the specified ID
        await db.item.delete({
            where: {
                id
            }
        });
        
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