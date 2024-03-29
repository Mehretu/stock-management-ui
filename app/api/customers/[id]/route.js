import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request,{params:{id}}){
    try {
        const customer = await db.customer.findUnique({
            where:{
                id
            },
        });
        return NextResponse.json(customer)
        
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
        const{name,email,phone,address} = await request.json()
        const customer = await db.customer.update({
            where:{
                id
            },
            data:{
                name,
                email,
                phone,
                address,
            },
        });
        console.log(customer)
        return NextResponse.json(customer)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Update the customer"
        },{
            status:500
        })
        
    }
}

export async function DELETE(request, { params: { id } }) {
    try {
        // Perform the deletion of the item with the specified ID
        await db.customer.delete({
            where: {
                id
            }
        });
        
        // Respond with a success message
        return NextResponse.json({ message: `Customer with ID ${id} deleted successfully` });
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