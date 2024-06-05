import { authOptions } from "@/lib/authOptions";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";



export async function POST(request) {
    try {
        const session = await getServerSession(authOptions)
        const user = session?.user
        console.log("User",user)
        const salesOrderData = await request.json();
        console.log("DATA",salesOrderData)
        

        const unavailableItems = salesOrderData.items.filter(item => parseFloat(item.availableQuantity) === 0 || parseFloat(item.quantity) > parseFloat(item.availableQuantity));
        if (unavailableItems.length > 0) {
            throw new Error(`Some items are not available in sufficient quantity.`);
        }

        // Validate other necessary fields (e.g., customer information)
        if (!salesOrderData.customerId || !salesOrderData.items || salesOrderData.items.length === 0) {
            throw new Error(`Customer ID and items are required fields.`);
        }

        // Calculate order total based on item prices and quantities including VAT
        // const orderTotalWithoutVAT = salesOrderData.items.reduce((total, item) => {
        //     return total + parseFloat(item.total);
        // }, 0);
        // console.log("OrderTotalWithoutVat",orderTotalWithoutVAT)
        

        // // Determine VAT rate
        // let vatRate;
        // if (salesOrderData.vat === 'novat') {
        //     vatRate = 0;
        // } else if (salesOrderData.vat === 'vat') {
        //     vatRate = 0.15; // Assuming VAT rate of 15%
        // } else {
        //     throw new Error(`Invalid VAT option.`);
        // }

        // // Calculate VAT amount
        // const vatAmount = orderTotalWithoutVAT * parseFloat(vatRate);
        // console.log("Vat amonut",vatAmount)

        // // Calculate order total including VAT
        // const orderTotalWithVAT = orderTotalWithoutVAT + vatAmount;
        // console.log("Order Total with Vat",orderTotalWithVAT)

        let paymentStatus = 'OUTSTANDING'
        const paidAmount = parseFloat(salesOrderData.paidAmount);
        const grandTotal = parseFloat(salesOrderData.grandTotal)
        if (paidAmount > 0 && paidAmount < grandTotal) {
            paymentStatus = 'PARTIAL';
        } else if (paidAmount >= grandTotal) {
            paymentStatus = 'PAID';
        }

        const remaining = grandTotal - paidAmount

       

        console.log("Items",salesOrderData.items)
        const itemPromises = salesOrderData.items.map(async (item) => {
            const originDetails = await fetchOriginDetails(item.itemId);
            return {
                itemId: item.itemId,
                quantity: parseInt(item.quantity),
                price: parseFloat(item.price),
                totalPrice: parseFloat(item.total),
                origin: originDetails.title,
            };
        });
        const itemOrders = await Promise.all(itemPromises);

        for (const item of salesOrderData.items) {
            await decrementItemQuantity(item.itemId, item.quantity,item.availableQuantity,item.total);
        }

        
        

        // Create the sales order
        const salesOrder = await db.salesOrder.create({
            data:{
                tinNumber: salesOrderData.tinNumber,
                referenceNumber: salesOrderData.referenceNumber,
                customerId: salesOrderData.customerId,
                salesRepresentativeId: user.id,
                orderDate: new Date(),
                orderStatus: 'PENDING', // Assuming all orders start as pending
                itemsOrdered: { createMany: {data:itemOrders}},
                orderTotal: grandTotal, 
                paymentMethod: salesOrderData.paymentMethod,
                paidAmount: parseFloat(salesOrderData.paidAmount),
                paymentStatus: paymentStatus,
                remainingAmount: parseFloat(remaining),
                orderTotalWithoutVAT:parseFloat(salesOrderData.subTotal),
                vat:parseFloat(salesOrderData.vAt),
                discount:parseFloat(salesOrderData.discount)
            }

        })

        await db.paymentHistory.create({
            data:{
                salesId: salesOrder.id,
                paidAmount:parseFloat(salesOrderData.paidAmount),
                recievedBy: user?.name
            }
        })
        return NextResponse.json(salesOrder)
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to create an Sales Order"
        },{
            status:500
        })
    }
}

async function fetchOriginDetails(itemId) {
    const item = await db.item.findUnique({
       where: {
          id: itemId
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
       throw new Error(`Item with ID ${itemId} not found.`);
    }
 
    return originDetails;
 }

 async function decrementItemQuantity(itemId, quantity,availableQuantity,total) {
    const originDetails = await fetchOriginDetails(itemId);
    const item = await db.item.findUnique({
        where:{
            id:itemId,
        }
    })

    await db.item.update({
        where:{
            id:itemId,
        },
        data:{
            quantity: parseInt(availableQuantity) - parseInt(quantity),
            totalPrice:{
                decrement: Math.min(total,item.totalPrice)
            }
        }
    })

    if (originDetails.id === item.warehouseId) {
        // If the item is associated with a warehouse, decrement the stockQty in the warehouse
        await db.warehouse.update({
            where: { id: originDetails.id },
            data: {
                stockQty: {
                    decrement: Math.min(quantity, originDetails.stockQty)
                }
            }
        });
    } else if (originDetails.id === item.shopId) {
        // If the item is associated with a shop, decrement the stockQty in the shop
        await db.shop.update({
            where: { id: originDetails.id },
            data: {
                stockQty: {
                    decrement: Math.min(quantity, originDetails.stockQty)
                }
            }
        });

    } else {
        throw new Error(`Origin details for item with ID ${itemId} are invalid.`);
    }
}




export async function GET(request){
    try {
        const salesOrders = await db.salesOrder.findMany({
            orderBy:{
                createdAt:'desc'
            },
            include:{
                customer: true,
                company: true,
                paymentHistory:true,
                salesRepresentative:true,
                itemsOrdered:{
                    include:{
                        item:true,
                    
                    }
                } 
            }
        });
        return NextResponse.json(salesOrders)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Fetch sales Orders",
        },{
            status:500
        })
        
    }
}


export async function DELETE(request){
    try {
        const id = request.nextUrl.searchParams.get("id")
        const deletedSalesOrder = await db.salesOrder.delete({
            where:{
                id
            }
            
        })
        console.log(deletedSalesOrder)
        return NextResponse.json(deletedSalesOrder)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Delete items",
        },{
            status:500
        })
        
    }
}

