import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request,{params:{id}}){
    try {
        const purchaseOrder = await db.purchaseOrder.findUnique({
            where:{
                id
            },
            include:{
                supplier:true,
                purchaseRepresentative:true,
                itemsOrdered:{
                    include:{
                        item:true,
                    }
                }
            }
        });
        return NextResponse.json(purchaseOrder)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Fetch purchase order"
        },{
            status:500
        })
        
    }
}