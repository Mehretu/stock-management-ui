import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const importData = await request.json();
        console.log("Import Data from the API", importData);
        const { items } = importData;
        console.log("Items", items);

        const createdItems = [];
        for (const itemData of items) {
            // Check if an item with the same itemNumber exists
            const existingItem = await db.item.findFirst({
                where: {
                    itemNumber: itemData.itemNumber
                }
            });

            if (existingItem) {
                // Update existing item
                const updatedItem = await db.item.update({
                    where: {
                        id: existingItem.id
                    },
                    data: {
                        title: itemData.title,
                        category: {
                            connectOrCreate: {
                                where: { title: itemData.category },
                                create: { title: itemData.category }
                            }
                        },
                        itemNumber: itemData.itemNumber.toString(),
                        quantity: existingItem.quantity + parseInt(itemData.quantity), // Update quantity
                        unit: {
                            connectOrCreate: {
                                where: { title: itemData.unit },
                                create: { title: itemData.unit, abbreviation: itemData.unit }
                            }
                        },
                        brand: {
                            connectOrCreate: {
                                where: { title: itemData.brand },
                                create: { title: itemData.brand }
                            }
                        },
                        buyingPrice: parseFloat(itemData.buyingPrice),
                        sellingPrice: parseFloat(itemData.sellingPrice),
                        warehouse: {
                            connect: { id: importData.warehouseId }
                        },
                        taxRate: parseFloat(itemData.taxRate),
                        unitVat: parseFloat(itemData.taxRate / 100) * parseFloat(itemData.sellingPrice),
                        unitPriceWithVat: parseFloat(itemData.sellingPrice) + (parseFloat(itemData.taxRate / 100) * parseFloat(itemData.sellingPrice)),
                        totalPriceWithVat: parseFloat(itemData.taxRate / 100) * (parseFloat(itemData.sellingPrice) * parseInt(itemData.quantity)),
                        totalPrice: parseFloat(itemData.sellingPrice) * parseInt(itemData.quantity),
                        itemStatus: parseInt(itemData.quantity) > 5 ? "AVAILABLE" : parseInt(itemData.quantity) > 0 ? "LOW_IN_QUANTITY" : "NOT_AVAILABLE"
                    }
                });

                // Update stock quantity in warehouse
                const warehouseId = importData.warehouseId;
                const warehouse = await db.warehouse.findUnique({
                    where: {
                        id: warehouseId
                    }
                });

                if (warehouse) {
                    const currentStock = warehouse.stockQty;
                    const newStock = currentStock + parseInt(itemData.quantity);

                    await db.warehouse.update({
                        where: {
                            id: warehouseId
                        },
                        data: {
                            stockQty: newStock
                        }
                    });
                }

                createdItems.push(updatedItem);
            } else {
                // Create new item
                const totalPrice = parseFloat(itemData.sellingPrice) * parseInt(itemData.quantity);
                const unitVat = parseFloat(itemData.taxRate / 100) * parseFloat(itemData.sellingPrice);
                const totalPriceWithVat = totalPrice + unitVat;

                // Update stock quantity in warehouse
                const warehouseId = importData.warehouseId;
                const warehouse = await db.warehouse.findUnique({
                    where: {
                        id: warehouseId
                    }
                });

                if (warehouse) {
                    const currentStock = warehouse.stockQty;
                    const newStock = currentStock + parseInt(itemData.quantity);

                    await db.warehouse.update({
                        where: {
                            id: warehouseId
                        },
                        data: {
                            stockQty: newStock
                        }
                    });
                }

                const newItem = await db.item.create({
                    data: {
                        title: itemData.title,
                        category: {
                            connectOrCreate: {
                                where: { title: itemData.category },
                                create: { title: itemData.category }
                            }
                        },
                        itemNumber: itemData.itemNumber.toString(),
                        quantity: parseInt(itemData.quantity),
                        unit: {
                            connectOrCreate: {
                                where: { title: itemData.unit },
                                create: { title: itemData.unit, abbreviation: itemData.unit }
                            }
                        },
                        brand: {
                            connectOrCreate: {
                                where: { title: itemData.brand },
                                create: { title: itemData.brand }
                            }
                        },
                        buyingPrice: parseFloat(itemData.buyingPrice),
                        sellingPrice: parseFloat(itemData.sellingPrice),
                        warehouse: {
                            connect: { id: importData.warehouseId }
                        },
                        taxRate: parseFloat(itemData.taxRate),
                        unitVat: unitVat,
                        unitPriceWithVat: totalPriceWithVat,
                        totalPriceWithVat: totalPriceWithVat,
                        totalPrice: totalPrice,
                        itemStatus: parseInt(itemData.quantity) > 5 ? "AVAILABLE" : parseInt(itemData.quantity) > 0 ? "LOW_IN_QUANTITY" : "NOT_AVAILABLE"
                    }
                });

                createdItems.push(newItem);
            }
        }

        // Return the created items as a response
        return NextResponse.json(createdItems);
    } catch (error) {
        console.error("Error creating items:", error);
        return {
            status: 500,
            body: { error: "Failed to create items" },
        };
    }
}
