import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request,{params:{id}}){
    try{
        const itemData = await request.json();
        console.log("Selected Id",id)
        console.log("Staus",itemData)
        
        
        
       

        const updatedItem = await db.salesOrder.update({
            where: {
                id
            },
            data: {
               orderStatus:itemData.status === 'Shipped'? 'SHIPPED':itemData.status === 'Delivered'? 'DELIVERED': 'PENDING'
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