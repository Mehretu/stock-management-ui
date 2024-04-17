import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request, { params: { id } }) {
    try {
        const itemData = await request.json();

        const existingItem = await db.item.findUnique({
            where: {
                id
            }
        });


        const existingQuantity = parseInt(existingItem.quantity);
        let newTargetQuantity = 0;

  

            const unitVat =  parseFloat(existingItem.taxRate/100) * parseFloat(itemData.sellingPrice);
            const totalPrice = parseInt(existingItem.quantity) * parseFloat(itemData.sellingPrice);
            const totalVat = parseFloat(existingItem.taxRate/100) * parseFloat(totalPrice);
            

        const updatedItem = await db.item.update({
            where: {
                id
            },
            data: {
               
                buyingPrice: parseFloat(itemData.buyingPrice),
                sellingPrice: parseFloat(itemData.sellingPrice),
                unitVat:parseFloat(unitVat),
                unitPriceWithVat: parseFloat(itemData.sellingPrice) + parseFloat(unitVat),
                totalPriceWithVat: parseFloat(totalVat) + parseFloat(totalPrice),
                totalPrice: totalPrice ,
            },
        });

        console.log(updatedItem);
        return NextResponse.json(updatedItem);
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            error,
            message: "Failed to update the item"
        }, {
            status: 500
        });
    }
}