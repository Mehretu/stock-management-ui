import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request,{params:{id}}){
    try {
        const warehouse = await db.warehouse.findUnique({
            where:{
                id
            },
        });
        return NextResponse.json(warehouse)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Fetch warehouse"
        },{
            status:500
        })
        
    }
}
export async function PUT(request,{params:{id}}){
    try {
        const{title,location,warehouseType,description} = await request.json()
        const warehouse = await db.warehouse.update({
            where:{
                id
            },
            data:{
                title,
                warehouseType,
                location,
                description,

            },
        });
        console.log(warehouse)
        return NextResponse.json(warehouse)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Update the warehouse"
        },{
            status:500
        })
        
    }
}

export async function DELETE(request, { params: { id } }) {
    try {
        // Perform the deletion of the item with the specified ID
        await db.warehouse.delete({
            where: {
                id
            }
        });
        
        // Respond with a success message
        return NextResponse.json({ message: `Warehouse with ID ${id} deleted successfully` });
    } catch (error) {
        // If an error occurs during deletion, respond with an error message and status code 500
        console.error(error);
        return NextResponse.json({
            error,
            message: `Failed to delete the warehouse with ID ${id}`
        }, {
            status: 500
        });
    }
}