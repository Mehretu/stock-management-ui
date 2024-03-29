import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request,{params:{id}}){
    try{
        const itemData = await request.json();
        console.log("Selected Id",id)
        console.log("Paid Amount",itemData)

        const existingItem = await db.salesOrder.findUnique({
            where:{
                id:id
            }
        });
        
        const insertedPaidAmount =  parseFloat(itemData.paidAmount);
        console.log("Inserted Paid Amount",insertedPaidAmount)
        const existingTotal = parseFloat(existingItem.orderTotal);
        console.log("Existing Total",existingItem)

        const remaining = parseFloat(existingItem.orderTotal) - insertedPaidAmount

        const updatedItem = await db.salesOrder.update({
            where: {
                id
            },
            data: {
                paidAmount:parseFloat(insertedPaidAmount),
                remainingAmount:parseFloat(remaining),
                paymentStatus: parseFloat(insertedPaidAmount) === existingTotal? 'PAID' : 'PARTIAL'
            },
        });

        console.log(updatedItem);
        return NextResponse.json(updatedItem);


    }catch (error) {
        console.log(error);
        return NextResponse.json({
            error,
            message: "Failed to update the item"
        }, {
            status: 500
        });
    }
}