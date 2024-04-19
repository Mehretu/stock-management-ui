import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request){
    const itemStatus = request.nextUrl.searchParams.get("itemStatus")
    try {
        const item = await db.item.findMany({
            where:{
                itemStatus: itemStatus,
                warehouse:  null
            }
        });
        return NextResponse.json(item)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Fetch items",
        },{
            status:500
        })
        
    }
}