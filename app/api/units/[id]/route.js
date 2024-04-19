import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request,{params:{id}}){
    try {
        const unit = await db.unit.findUnique({
            where:{
                id
            },
        });
        return NextResponse.json(unit)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Fetch unit"
        },{
            status:500
        })
        
    }
}
export async function PUT(request,{params:{id}}){
    try {
        const{title,abbreviation} = await request.json()
        const unit = await db.unit.update({
            where:{
                id
            },
            data:{
                title,
                abbreviation,
            },
        });
        console.log(unit)
        return NextResponse.json(unit)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Update the unit"
        },{
            status:500
        })
        
    }
}

export async function DELETE(request, { params: { id } }) {
    try {
        // Perform the deletion of the item with the specified ID
        await db.unit.delete({
            where: {
                id
            }
        });
        
        // Respond with a success message
        return NextResponse.json({ message: `Unit with ID ${id} deleted successfully` });
    } catch (error) {
        // If an error occurs during deletion, respond with an error message and status code 500
        console.error(error);
        return NextResponse.json({
            error,
            message: `Failed to delete the unit with ID ${id}`
        }, {
            status: 500
        });
    }
}