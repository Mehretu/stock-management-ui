import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request, { params: { id } }) {
    try {
        const itemData = await request.json();

        // Fetch the existing item data
        const existingItem = await db.item.findUnique({
            where: {
                id
            }
        });
        let targetId, targetType;
        if (existingItem.warehouseId !== null && existingItem.warehouseId !== undefined){
            targetId = existingItem.warehouseId;
            targetType = 'warehouse';
        }else if (existingItem.shopId !== null && existingItem.shopId !== undefined){
            targetId = existingItem.shopId;
            targetType = 'shop';
        }else{
            throw new Error('No target ID found. Cannot determine warehouse or shop.');

        }
        const targetData = targetType === 'warehouse' ?
        await db.warehouse.findUnique({
            where: {
                id: targetId
            }
        }) :
        await db.shop.findUnique({
            where: {
                id: targetId
            }
        });
        const existingQuantity = parseInt(existingItem.quantity); 
        const currentTargetQuantity = parseInt(targetData.stockQty);  
        const newTargetQuantity =  currentTargetQuantity + parseInt(itemData.quantity)
        const newItemQuantity = existingQuantity + parseInt(itemData.quantity)
        

        const updateData = targetType === 'warehouse' ? {
            stockQty: newTargetQuantity
        } : {
            stockQty: newTargetQuantity
        };

        const updatedTarget = targetType === 'warehouse' ?
        await db.warehouse.update({
            where: {
                id: targetId
            },
            data: updateData
        }) :
        await db.shop.update({
            where: {
                id: targetId
            },
            data: updateData
        });


        await db.priceHistory.create({
            data: {
                itemId: id,
                buyingPrice: existingItem.buyingPrice,
                sellingPrice: existingItem.sellingPrice,
                quantity: existingQuantity
            }
        });

        const existingTotalPrice = parseFloat(existingItem.totalPrice) || 0;
        const newSellingPrice = parseFloat(itemData.sellingPrice)
        const newQuantityToAdd = parseInt(itemData.quantity)
        const totalPrice = existingTotalPrice + (newQuantityToAdd * newSellingPrice)
        const taxRate = parseFloat(existingItem.taxRate)
        const unitVat = parseFloat(taxRate/100) * parseFloat(itemData.sellingPrice)
        const unitPriceWithVat = parseFloat(unitVat) + parseFloat(itemData.sellingPrice)
        const totalVat = parseFloat(taxRate/100) * parseFloat(totalPrice)
        const totalPriceWithVat = parseFloat(totalVat) + parseFloat(totalPrice)

            
            

        // Update the item
        const updatedItem = await db.item.update({
            where: {
                id
            },
            data: {
               
                buyingPrice: parseFloat(itemData.buyingPrice),
                sellingPrice: parseFloat(itemData.sellingPrice),
                unitVat:parseFloat(unitVat),
                unitPriceWithVat: unitPriceWithVat,
                totalPriceWithVat: totalPriceWithVat,
                totalPrice: totalPrice,
                quantity: newItemQuantity,
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