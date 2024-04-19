import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request,{params:{id}}){
    try {
        const salesOrder = await db.salesOrder.findUnique({
            where:{
                id
            },
            include:{
                customer:true,
                company:true,
                itemsOrdered:{
                    include:{
                        item:true,
                    }
                }
            }
        });
        return NextResponse.json(salesOrder)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Fetch salesOrder"
        },{
            status:500
        })
        
    }
}
export async function PUT(request, { params: { id } }) {
    try {
        const salesData = await request.json();
        console.log("Sales Data",salesData)

        // Fetch the existing item data
        const existingSales = await db.salesOrder.findUnique({
            where: {
                id
            }
        });

       

        

       

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
                description: itemData.description,
                notes: itemData.notes,
                totalPrice: parseInt(itemData.quantity) * parseInt(itemData.sellingPrice),
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
        // Perform the deletion of the item with the specified ID
        await db.salesOrder.delete({
            where: {
                id
            }
        });
        
        // Respond with a success message
        return NextResponse.json({ message: `Sales with ID ${id} deleted successfully` });
    } catch (error) {
        // If an error occurs during deletion, respond with an error message and status code 500
        console.error(error);
        return NextResponse.json({
            error,
            message: `Failed to delete the sals with ID ${id}`
        }, {
            status: 500
        });
    }
}