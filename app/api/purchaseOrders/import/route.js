import db from "@/lib/db";
import { NextResponse } from "next/server";
import toast from "react-hot-toast";

export async function POST(request) {
    try {
        const requestData = await request.json();
        console.log("DATA", requestData);

        if (!requestData.purchaseOrders || requestData.purchaseOrders.length === 0) {
            throw new Error("No purchase orders found in the request.");
        }

        const createdPurchaseOrders = [];
        for (const purchaseOrderData of requestData.purchaseOrders) {
            const timestamp = Date.now();
            try {
                if (!purchaseOrderData.supplier || !purchaseOrderData.itemsOrdered || purchaseOrderData.itemsOrdered.length === 0) {
                    throw new Error(`Supplier and itemsOrdered are required fields.`);
                }

                // Calculate order total based on item prices and quantities including VAT
                const orderTotalWithoutVAT = purchaseOrderData.itemsOrdered.reduce((total, itemOrdered) => {
                    return total + parseFloat(itemOrdered.total);
                }, 0);
                console.log("OrderTotalWithoutVat", orderTotalWithoutVAT);

                let vatRate;
                if (purchaseOrderData.vat === 'novat') {
                    vatRate = 0;
                } else if (purchaseOrderData.vat === 'vat') {
                    vatRate = 0.15;
                } else {
                    throw new Error(`Invalid VAT option.`);
                }

                const vatAmount = orderTotalWithoutVAT * parseFloat(vatRate);
                console.log("Vat amonut", vatAmount);

                const orderTotalWithVAT = orderTotalWithoutVAT + vatAmount;
                console.log("Order Total with Vat", orderTotalWithVAT);

             
                console.log("Items", purchaseOrderData.itemsOrdered);
                const itemPromises = purchaseOrderData.itemsOrdered.map(async (itemOrdered) => {
                    const originDetails = await fetchOriginDetails(itemOrdered.itemNumber);
                
                    const item = await db.item.findUnique({
                        where:{
                            itemNumber: itemOrdered.itemNumber.toString(),
                        }
                    })
                    return {
                        itemId: item.id,
                        quantity: parseInt(itemOrdered.quantity),
                        price: parseFloat(itemOrdered.price),
                        totalPrice: parseFloat(itemOrdered.total),
                        origin: originDetails.title,
                    };
                });
                const itemOrders = await Promise.all(itemPromises);

                const purchaseOrder = await db.purchaseOrder.create({
                    data: {
                        orderNumber: purchaseOrderData.orderNumber.toString(),
                        supplier: {
                            connectOrCreate: {
                                where: { title: purchaseOrderData.supplier },
                                create: { title: purchaseOrderData.supplier,supplierCode: timestamp.toString()}
                            }
                        },
                        orderDate: new Date(),
                        purchaseStatus: 'PENDING',
                        itemsOrdered: { createMany: {data:itemOrders}},
                        totalCost: parseFloat(orderTotalWithVAT), 
                        deliveryDate: new Date(purchaseOrderData.deliveryDate),
                        purchaseTotalwithoutVat: orderTotalWithoutVAT,
                        vat:vatAmount,
                        recievingLocation: purchaseOrderData.deliveryLocation,
                    }

                });
                createdPurchaseOrders.push(purchaseOrder);
            } catch (error) {
                console.error("Error creating purchase order:", error);
                toast.error(error.message || "An error occurred while creating the purchase order.");

            }
        }

        return NextResponse.json(createdPurchaseOrders);
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            error,
            message: "Failed to create Purchase Order"
        }, {
            status: 500
        });
    }
}

async function fetchOriginDetails(itemNumber) {
    const item = await db.item.findUnique({
        where: {
            itemNumber: itemNumber.toString()
        }
    });

    let originDetails;
    if (item) {
        if (item.warehouseId) {
            originDetails = await db.warehouse.findUnique({
                where: {
                    id: item.warehouseId
                }
            });
        } else if (item.shopId) {
            originDetails = await db.shop.findUnique({
                where: {
                    id: item.shopId
                }
            });
        } else {
            throw new Error(`Item does not have a warehouseId or shopId.`);
        }
    } else {
        throw new Error(`Item with ItemNumber ${itemNumber} not found.`);
    }

    return originDetails;
}


