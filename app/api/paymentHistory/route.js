import db from "@/lib/db";
import { NextResponse } from "next/server";



export async function GET(request){
    try {
        const paymentHistory = await db.paymentHistory.findMany({
            orderBy:{
                date:'desc'
            },
            include:{
                salesOrder:true
            }
        });
        return NextResponse.json(paymentHistory)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Fetch Payment History"
        },{
            status:500
        })
        
    }
}

export async function DELETE(request){
    try {
        const id = request.nextUrl.searchParams.get("id")
        const deletePaymentHistory = await db.paymentHistory.delete({
            where:{
                id
            },
        })
        console.log(deletePaymentHistory)
        return NextResponse.json(deletePaymentHistory)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Delete Payment history",
        },{
            status:500
        })
        
    }
}