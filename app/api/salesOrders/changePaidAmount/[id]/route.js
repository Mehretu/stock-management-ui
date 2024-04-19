import { authOptions } from "@/lib/authOptions";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(request,{params:{id}}){
    try{
        const itemData = await request.json();
        const session = await getServerSession(authOptions)
        const user = session?.user
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

        const paidAmount = parseFloat(existingItem.paidAmount) + parseFloat(insertedPaidAmount)

        const remaining = parseFloat(existingItem.orderTotal) - paidAmount
        await db.paymentHistory.create({
            data:{
                salesId: id,
                paidAmount:insertedPaidAmount,
                recievedBy: user?.name
            }
        })

        const updatedItem = await db.salesOrder.update({
            where: {
                id
            },
            data: {
                paidAmount: paidAmount,
                remainingAmount:parseFloat(remaining),
                paymentStatus: parseFloat(paidAmount) === existingTotal? 'PAID' : 'PARTIAL'
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