import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { itemIds, shopId } = await request.json();
        
        // Iterate over each selected item ID
        for (const itemId of itemIds) {
            // Fetch the item details based on itemId
            const item = await db.item.findUnique({
                where: {
                    id: itemId
                }
            });

            if (!item) {
                throw new Error(`Item with ID ${itemId} not found`);
            }

            // Decrement the quantity from the warehouse
            await db.item.update({
                where: {
                    id: itemId
                },
                data: {
                    quantity: {
                        decrement: item.quantity // Decrement by the quantity of the item
                    }
                }
            });

            // Increment the quantity in the shop
            await db.shop.update({
                where: {
                    id: shopId
                },
                data: {
                    items: {
                        connect: {
                            id: itemId
                        }
                    }
                }
            });
        }

        // Return a success message
        return {
            status: 200,
            body: JSON.stringify({
                message: "Items added to shop successfully"
            })
        };
    } catch (error) {
        console.error("Error adding items to shop:", error);
        return {
            status: 500,
            body: JSON.stringify({
                error: error.message,
                message: "Failed to add items to shop"
            })
        };
    }    
}
