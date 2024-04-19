import db from "@/lib/db";
import { NextResponse } from "next/server";



export async function GET() {
  try {
    const items = await db.item.findMany({
      include: {
        brand: true,
        warehouse: true,
        shop: true,
      },
    });

    const groupedItems = {};
    items.forEach((item) => {
      const itemName = item.title;
      if (!groupedItems[itemName]) {
        groupedItems[itemName] = [];
      }
      groupedItems[itemName].push(item);
    });

    const itemBalances = [];
    for (const itemName in groupedItems) {
      if (Object.hasOwnProperty.call(groupedItems, itemName)) {
        const itemsWithSameName = groupedItems[itemName];
        let totalQuantity = 0;
        let quantityInStock = 0;
        let quantityInStore = 0;
        itemsWithSameName.forEach((item) => {
          if(item.shop){
            quantityInStock += item.quantity;
          }else{
            quantityInStore += item.quantity;
          }
          totalQuantity = quantityInStock + quantityInStore;
        });

        const firstItem = itemsWithSameName[0];
        const total = {
          itemName: itemName,
          itemNumber: firstItem.itemNumber,
          brand: firstItem.brand.title,
          origin: firstItem.shop ? firstItem.shop.title : firstItem.warehouse.title,
          quantityInStock: quantityInStock || 0,
          quantityInStore: quantityInStore || 0,
          total: totalQuantity,
        };
        itemBalances.push(total);
      }
    }
    


    return NextResponse.json(itemBalances);
  } catch (error) {
    console.error('Error fetching item balances:', error);
    return [];
  }
}



