import db from "@/lib/db";
import { NextResponse } from "next/server";

    export async function POST(request){
    try{

        const itemData=await request.json();
        console.log(itemData) 
        const warehouse =await db.warehouse.findUnique({
            where: {
                id:itemData.warehouseId
            },
        })
        const totalPrice= parseFloat(itemData.sellingPrice) * parseInt(itemData.quantity)
        const unitVat = parseFloat(itemData.taxRate/100) * parseFloat(itemData.sellingPrice)
        const unitPriceWithVat = unitVat + parseFloat(itemData.sellingPrice)
        const totalVat = parseFloat(itemData.taxRate/100) * parseFloat(totalPrice)
        console.log("Total Vat",totalVat)
        const totalPriceWithVat = parseFloat(totalVat) + parseFloat(totalPrice)
        console.log("Total Price With Vat",totalPriceWithVat)
        const currentWarehouseStock = warehouse.stockQty;
        const newStockQty = parseInt(currentWarehouseStock) + parseInt(itemData.quantity)
        const updatedWarehouse = await db.warehouse.update({
            where:{
                id:itemData.warehouseId,
            },
            data:{
                stockQty:newStockQty
            }
        })
    
        const item = await db.item.create({
            data:{
                    title:itemData.title,
                    categoryId:itemData.categoryId,
                    itemNumber:itemData.itemNumber,
                    quantity:parseInt(itemData.quantity),
                    unitId:itemData.unitId,
                    brandId:itemData.brandId,
                    buyingPrice:parseFloat(itemData.buyingPrice),
                    sellingPrice:parseFloat(itemData.sellingPrice),
                    supplierId:itemData.supplierId,
                    // reOrderPoint:parseInt(itemData.reOrderPoint),
                    warehouseId:itemData.warehouseId,
                    imageUrl:itemData.imageUrl,
                    // weight:parseFloat(itemData.weight),
                    // dimensions:itemData.dimensions,
                    taxRate:parseFloat(itemData.taxRate),
                    unitVat:unitVat,
                    unitPriceWithVat:parseFloat(unitPriceWithVat),
                    totalPriceWithVat:parseFloat(totalPriceWithVat),
                    description:itemData.description,
                    notes:itemData.notes,
                    totalPrice:isNaN(totalPrice)? null : totalPrice,
                    itemStatus:parseInt(itemData.quantity) > 5 ? "AVAILABLE":parseInt(itemData.quantity) > 0 ? "LOW_IN_QUANTITY": "NOT_AVAILABLE",


            }
        })
        return NextResponse.json(item)
    }catch(error){
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to create an Item"
        },{
            status:500
        })
    }    
    }

export async function GET(request){
    const itemId = request.nextUrl.searchParams.get("id")
    const itemStatus = request.nextUrl.searchParams.get("itemStatus")
    const warehouseId = request.nextUrl.searchParams.get("warehouseId")
    const shopId = request.nextUrl.searchParams.get("shopId")

    let items;
    try {
        if(itemId){
            items = await db.item.findMany({
                orderBy:{
                    createdAt:'desc'
                },
                include:{
                    category: true,
                    supplier: true,
                    warehouse:true,
                    brand:true,

                    priceHistory:true,
                },
                where:{
                    id:itemId,
                }
            });
            
        }else if(itemStatus && warehouseId){
            items = await db.item.findMany({
                orderBy:{
                    createdAt:'desc'
                },
                include:{
                    category: true,
                    supplier: true,
                    warehouse:true,
                    brand:true,
                    priceHistory:true,
                },
                where:{
                    itemStatus:itemStatus,
                    warehouseId:warehouseId,
                }
            });

        }else if(itemStatus && shopId){
            items = await db.item.findMany({
                orderBy:{
                    createdAt:'desc'
                },
                include:{
                    category: true,
                    supplier: true,
                    warehouse:true,
                    brand:true,
                    priceHistory:true,
                },
                where:{
                    itemStatus:itemStatus,
                    shopId:shopId,
                }
            });
        }else{
            items = await db.item.findMany({
                orderBy:{
                    createdAt:'desc'
                },
                include:{
                    category: true,
                    supplier: true,
                    warehouse:true,
                    brand:true,
                    priceHistory:true,
                }
            });
        }
       
        return NextResponse.json(items)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Fetch items",
        },{
            status:500
        })
        
    }
}

export async function GETBYid(request){
    try {
        const itemIds = request.query.split(',');
        const selectedItems = await db.item.findMany({
            where:{
                id:{in:itemIds}
            }
        });
        return NextResponse.json(selectedItems)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Fetch items",
        },{
            status:500
        })
        
    }
}

export async function DELETE(request){
    try {
        const id = request.nextUrl.searchParams.get("id")
        const deleteItem = await db.item.delete({
            where:{
                id
            },
            include:{
                item:true,
            },
        })
        console.log(deleteItem)
        return NextResponse.json(deleteItem)
        
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

