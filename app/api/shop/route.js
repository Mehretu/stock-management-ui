import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request){
try{
    const {title,location,description}=await request.json();
    const shop= await db.shop.create({
        data:{
            title,
            location,
            description,
        },
    });    
    console.log(shop);
    return NextResponse.json(shop)
}catch(error){
    console.log(error)
    return NextResponse.json({
        error,
        message:"Failed to create a shop"
    },{
        status:500
    })
}    
}

export async function GET(request){
    try {
        const shop = await db.shop.findMany({
            orderBy:{
                createdAt:'desc'
            },
            include:{
                items:true,
            }
        });
        return NextResponse.json(shop)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Fetch the shop"
        },{
            status:500
        })
        
    }
}

export async function DELETE(request){
    try {
        const id = request.nextUrl.searchParams.get("id")
        const deletedShop= await db.shop.delete({
            where:{
                id
            },
        })
        console.log(deletedShop)
        return NextResponse.json(deletedShop)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Delete dhop",
        },{
            status:500
        })
        
    }
}