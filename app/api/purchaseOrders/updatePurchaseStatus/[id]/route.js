import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request,{params:{id}}){
    try{
        const itemData = await request.json();
        console.log("Selected Id",id)
        console.log("Staus",itemData)

        const purchaseOrder = await db.purchaseOrder.findUnique({
            where:{
                id
            },
            include:{
                itemsOrdered: true
            }
        })
        console.log("Purchase Order",purchaseOrder)

        const itemsOrdered = purchaseOrder.itemsOrdered

        console.log("Items Ordered", itemsOrdered)
        for(const itemOrdered of itemsOrdered){

            const item = await db.item.findUnique({
                where:{
                    id: itemOrdered.itemId
                }
            })

            const updatedQuantity = item.quantity + itemOrdered.quantity;
            const updatedTotalPrice = item.totalPrice ? item.totalPrice + itemOrdered.totalPrice : itemOrdered.totalPrice;

            const updatedItem = await db.item.update({
                where:{
                    id: item.id
                },
                data:{
                    quantity: updatedQuantity,
                    totalPrice:updatedTotalPrice
                }

            })
        }

        

        const updatedPurchase = await db.purchaseOrder.update({
            where: {
                id
            },
            data: {
               purchaseStatus:itemData.status === 'Recieved'? 'RECIEVED': 'PENDING'
            },
        });

        console.log(updatedPurchase);
        return NextResponse.json(updatedPurchase);


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