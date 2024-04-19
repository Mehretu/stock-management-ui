import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request,{params:{id}}){
    try {
        const company = await db.company.findUnique({
            where:{
                id
            },
        });
        return NextResponse.json(company)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Fetch company"
        },{
            status:500
        })
        
    }
}
export async function PUT(request,{params:{id}}){
    try {
        const{title,ownerName,tinNumber,email,phone,fax,address} = await request.json()
        const company = await db.company.update({
            where:{
                id
            },
            data:{
                title,
                ownerName,
                tinNumber,
                email,
                phone,
                fax,
                address,
            },
        });
        console.log(company)
        return NextResponse.json(company)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Update the company"
        },{
            status:500
        })
        
    }
}

export async function DELETE(request, { params: { id } }) {
    try {
        // Perform the deletion of the item with the specified ID
        await db.company.delete({
            where: {
                id
            }
        });
        
        // Respond with a success message
        return NextResponse.json({ message: `Company with ID ${id} deleted successfully` });
    } catch (error) {
        // If an error occurs during deletion, respond with an error message and status code 500
        console.error(error);
        return NextResponse.json({
            error,
            message: `Failed to delete the customer with ID ${id}`
        }, {
            status: 500
        });
    }
}