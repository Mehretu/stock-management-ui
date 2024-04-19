import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request,{params:{id}}){
    try {
        const brand = await db.brand.findUnique({
            where:{
                id
            },
        });
        return NextResponse.json(brand)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Fetch brand"
        },{
            status:500
        })
        
    }
}
export async function PUT(request,{params:{id}}){
    try {
        const{title} = await request.json()
        const brand = await db.brand.update({
            where:{
                id
            },
            data:{
                title
            },
        });
        console.log(brand)
        return NextResponse.json(brand)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Update the brand"
        },{
            status:500
        })
        
    }
}

export async function DELETE(request, { params: { id } }) {
    try {
        // Perform the deletion of the item with the specified ID
        await db.brand.delete({
            where: {
                id
            }
        });
        
        // Respond with a success message
        return NextResponse.json({ message: `Brand with ID ${id} deleted successfully` });
    } catch (error) {
        // If an error occurs during deletion, respond with an error message and status code 500
        console.error(error);
        return NextResponse.json({
            error,
            message: `Failed to delete the brand with ID ${id}`
        }, {
            status: 500
        });
    }
}