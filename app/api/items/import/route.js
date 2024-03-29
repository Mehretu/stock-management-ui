// Assuming `db` is your database connection or ORM instance

import db from "@/lib/db";

export async function POST(request) {
    try {
      const importData = await request.json();
      console.log("Import Data from the api",importData);
      const { items } = importData;
      console.log("Items",items)
  
      const createdItems = [];
      for (const itemData of items) {
        // Perform any necessary data processing or validation here
      console.log("Item Data",items)
      const category = await db.category.findUnique({
        where:{
            title:itemData.category
        },
      })
      console.log("Category", category)
      const categoryId = category.id;

      console.log("CategoryId",categoryId)

      const unit = await db.unit.findUnique({
        where:{
            title: itemData.unit
        }
      })
      console.log("Unit ",unit)
      const unitId = unit.id;
      console.log("UnitId ",unitId)
      const brand = await db.brand.findUnique({
        where:{
            title: itemData.brand
        }
      })
      console.log("Brand ",brand)
      const brandId = brand.id
      console.log("BrandId",brandId)

        // Create the item in the database
        const item = await db.item.create({
          data: {
            title: itemData.title,
            categoryId: categoryId,
            itemNumber: itemData.itemNumber,
            quantity: parseInt(itemData.quantity),
            unitId: unitId,
            brandId: brandId,
            buyingPrice: parseFloat(itemData.buyingPrice),
            sellingPrice: parseFloat(itemData.sellingPrice),
            warehouseId: importData.warehouseId,
            taxRate: parseFloat(itemData.taxRate),
            // Add any other fields as needed
          },
        });
  
        createdItems.push(item);
      }
  
      // Return the created items as a response
      return {
        status: 200,
        body: { items: createdItems },
      };
    } catch (error) {
      console.error("Error creating items:", error);
      return {
        status: 500,
        body: { error: "Failed to create items" },
      };
    }
  }
  