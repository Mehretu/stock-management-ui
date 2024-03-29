import db from "@/lib/db";
import { NextResponse } from "next/server";



export async function GET(request){
    try {
        const priceHistory = await db.priceHistory.findMany({
            orderBy:{
                date:'desc'
            },
            include:{
                item:true
            }
        });
        return NextResponse.json(priceHistory)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Fetch Price History"
        },{
            status:500
        })
        
    }
}

export async function DELETE(request){
    try {
        const id = request.nextUrl.searchParams.get("id")
        const deletedBrand = await db.brand.delete({
            where:{
                id
            },
        })
        console.log(deletedBrand)
        return NextResponse.json(deletedBrand)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Delete Brand",
        },{
            status:500
        })
        
    }
}