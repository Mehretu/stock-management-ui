import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request,{params:{id}}){
    try {
        const category = await db.category.findUnique({
            where:{
                id
            },
        });
        return NextResponse.json(category)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Fetch category"
        },{
            status:500
        })
        
    }
}
export async function PUT(request,{params:{id}}){
    try {
        const{title,description} = await request.json()
        const category = await db.category.update({
            where:{
                id
            },
            data:{
                title,
                description,
            },
        });
        console.log(category)
        return NextResponse.json(category)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Update the category"
        },{
            status:500
        })
        
    }
}

export async function DELETE(request, { params: { id } }) {
    try {
        // Perform the deletion of the item with the specified ID
        await db.category.delete({
            where: {
                id
            }
        });
        
        // Respond with a success message
        return NextResponse.json({ message: `Category with ID ${id} deleted successfully` });
    } catch (error) {
        // If an error occurs during deletion, respond with an error message and status code 500
        console.error(error);
        return NextResponse.json({
            error,
            message: `Failed to delete the category with ID ${id}`
        }, {
            status: 500
        });
    }
}