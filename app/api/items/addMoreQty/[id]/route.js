import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request,{params:{id}}){
    try{
        const itemData = await request.json();
        console.log("Selected Id",id)
        console.log("Item to Add",itemData)

        const existingItem = await db.item.findUnique({
            where:{
                id:id
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
        const existingQuantity = parseInt(existingItem.quantity); // this is the one that is before
        const currentTargetQuantity = parseInt(targetData.stockQty); //this is for the warehouse or shop
        
        const newTargetQuantity =  currentTargetQuantity + parseInt(itemData.quantityToAdd)
        const newItemQuantity = existingQuantity + parseInt(itemData.quantityToAdd)

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
        const totalPrice = parseInt(newItemQuantity) * parseFloat(existingItem.sellingPrice);
        const taxRate = parseFloat(existingItem.taxRate)
        const unitVat = parseFloat(taxRate/100) * parseFloat(existingItem.sellingPrice)
        const unitPriceWithVat = parseFloat(unitVat) + parseFloat(existingItem.sellingPrice)
        const totalVat = parseFloat(taxRate/100) * parseFloat(totalPrice)
        const totalPriceWithVat = parseFloat(totalVat) + parseFloat(totalPrice)

        const updatedItem = await db.item.update({
            where: {
                id
            },
            data: {
                quantity: parseInt(newItemQuantity),
                [targetType === 'warehouse' ? 'warehouseId' : 'shopId']: targetId,                
                unitVat:unitVat,
                unitPriceWithVat:unitPriceWithVat,
                totalPriceWithVat:totalPriceWithVat,
                totalPrice: totalPrice,
                itemStatus: parseInt(newItemQuantity) > 5 ? "AVAILABLE" : parseInt(newItemQuantity) > 0 ? "LOW_IN_QUANTITY" : "NOT_AVAILABLE"
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