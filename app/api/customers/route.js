import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request){
try{
    const {name,email,phone,address}=await request.json();
    const customer= await db.customer.create({
        data:{
            name,
            email,
            phone,
            address,
        },
    });
    console.log(customer);
    return NextResponse.json(customer)
}catch(error){
    console.log(error)
    return NextResponse.json({
        error,
        message:"Failed to create a customer"
    },{
        status:500
    })
}    
}


export async function GET(request){
    try {
        const customers = await db.customer.findMany({
            orderBy:{
                createdAt:'desc'
            },
        });
        return NextResponse.json(customers)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Fetch customers"
        },{
            status:500
        })
        
    }
}

export async function DELETE(request){
    try {
        const id = request.nextUrl.searchParams.get("id")
        const deletedCustomer = await db.customer.delete({
            where:{
                id
            },
        })
        console.log(deletedCustomer)
        return NextResponse.json(deletedCustomer)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Delete Category",
        },{
            status:500
        })
        
    }
}