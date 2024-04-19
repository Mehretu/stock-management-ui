import db from "@/lib/db";
import { NextResponse } from "next/server";
import toast, { Toaster } from "react-hot-toast";

export async function POST(request) {
    try {
        const timestamp = Date.now()
        const referenceNumbers =  `SALES-${timestamp}`

        const requestData = await request.json();
        console.log("DATA", requestData);

        if (!requestData.salesOrders || requestData.salesOrders.length === 0) {
            throw new Error("No sales orders found in the request.");
        }

        const createdSalesOrders = [];
        for (const salesOrderData of requestData.salesOrders) {
            try {
                if (!salesOrderData.customer || !salesOrderData.itemsOrdered || salesOrderData.itemsOrdered.length === 0) {
                    throw new Error(`Customer and itemsOrdered are required fields.`);
                }

                // Calculate order total based on item prices and quantities including VAT
                const orderTotalWithoutVAT = salesOrderData.itemsOrdered.reduce((total, itemOrdered) => {
                    return total + parseFloat(itemOrdered.total);
                }, 0);
                console.log("OrderTotalWithoutVat", orderTotalWithoutVAT);

                // Determine VAT rate
                let vatRate;
                if (salesOrderData.vat === 'novat') {
                    vatRate = 0;
                } else if (salesOrderData.vat === 'vat') {
                    vatRate = 0.15;
                } else {
                    throw new Error(`Invalid VAT option.`);
                }

                const vatAmount = orderTotalWithoutVAT * parseFloat(vatRate);
                console.log("Vat amonut", vatAmount);

                // Calculate order total including VAT
                const orderTotalWithVAT = orderTotalWithoutVAT + vatAmount;
                console.log("Order Total with Vat", orderTotalWithVAT);

                let paymentStatus = 'OUTSTANDING'
                const paidAmount = parseFloat(salesOrderData.paidAmount);
                if (paidAmount > 0 && paidAmount < orderTotalWithVAT) {
                    paymentStatus = 'PARTIAL';
                } else if (paidAmount >= orderTotalWithVAT) {
                    paymentStatus = 'PAID';
                }

                const remaining = orderTotalWithVAT - paidAmount;

                console.log("Items", salesOrderData.itemsOrdered);
                const itemPromises = salesOrderData.itemsOrdered.map(async (itemOrdered) => {
                    const originDetails = await fetchOriginDetails(itemOrdered.itemNumber);
                    const item = await db.item.findUnique({
                        where:{
                            itemNumber: itemOrdered.itemNumber.toString(),
                        }
                    })
                    return {
                        itemId: item.id,
                        // itemNumber: itemOrdered.itemNumber.toString(),
                        quantity: parseInt(itemOrdered.quantity),
                        price: parseFloat(itemOrdered.price),
                        totalPrice: parseFloat(itemOrdered.total),
                        origin: originDetails.title,
                    };
                });
                const itemOrders = await Promise.all(itemPromises);

                for (const itemOrdered of salesOrderData.itemsOrdered) {
                    await decrementItemQuantity(itemOrdered.itemNumber, itemOrdered.quantity, itemOrdered.total);
                }

                // Create the sales order
                const salesOrder = await db.salesOrder.create({
                    data: {
                        tinNumber: salesOrderData.tinNumber.toString(),
                        referenceNumber: referenceNumbers.toString(),
                        customer: {
                            connectOrCreate: {
                                where: { name: salesOrderData.customer },
                                create: { name: salesOrderData.customer ,email:salesOrderData.email}
                            }
                        },
                        orderDate: new Date(),
                        orderStatus: 'PENDING',
                        itemsOrdered: { createMany: { data: itemOrders } },
                        orderTotal: parseFloat(orderTotalWithVAT),
                        paymentMethod: salesOrderData.paymentMethod.toString(),
                        paidAmount: parseFloat(salesOrderData.paidAmount),
                        paymentStatus: paymentStatus,
                        remainingAmount: parseFloat(remaining),
                        orderTotalWithoutVAT: orderTotalWithoutVAT,
                        vat: vatAmount,
                    }

                });
                createdSalesOrders.push(salesOrder);
            } catch (error) {
                console.error("Error creating sales order:", error);
                toast.error(error.message || "An error occurred while creating the sales order.");

            }
        }

        return NextResponse.json(createdSalesOrders);
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            error,
            message: "Failed to create an Sales Order"
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


async function decrementItemQuantity(itemNumber, quantity, total) {
    
        const originDetails = await fetchOriginDetails(itemNumber);
        const item = await db.item.findUnique({
            where: {
                itemNumber: itemNumber.toString(),
            }
        });

        if (!item) {
            throw new Error(`Item with ItemNumber ${itemNumber} not found.`);
            
        }

        if (item.quantity < quantity) {
            throw new Error(`Insufficient quantity for item with ItemNumber ${itemNumber}`);
        }

        await db.item.update({
            where: {
                itemNumber: itemNumber.toString(),
            },
            data: {
                quantity: {
                    decrement: parseInt(quantity)
                },
                totalPrice: {
                    decrement: Math.min(total, item.totalPrice)
                }
            }
        });

        if (originDetails.id === item.warehouseId) {
            await db.warehouse.update({
                where: { id: originDetails.id },
                data: {
                    stockQty: {
                        decrement: parseInt(quantity)
                    }
                }
            });
        } else if (originDetails.id === item.shopId) {
            await db.shop.update({
                where: { id: originDetails.id },
                data: {
                    stockQty: {
                        decrement: parseInt(quantity)
                    }
                }
            });
        } else {
            throw new Error(`Origin details for item with Item Number ${itemNumber} are invalid.`);
            
    }
   
}
