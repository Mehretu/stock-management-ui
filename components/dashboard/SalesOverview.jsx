"use client"
import React, { useEffect, useState } from 'react'
import SalesActivityCard from './SalesActivityCard'
import InventorySummaryCard from './InventorySummaryCard'
import { getData } from '@/lib/getData'

export default function SalesOverview() {
    const [items,setItems] = useState([])
    const [lowQuantityItemsInShop,setLowQuantityItemsInShop] = useState([])
    const [lowQuantityItemsInStore,setLowQuantityItemsInStore] = useState([])
    const [outOfStockInShop,setOutOfStockInShop] = useState([])
    const [outOfStockInStore,setOutOfStockInStore] = useState([])
    const [warehouses,setWarehouses] = useState([])
    const [shops,setShops] = useState([])
    const [sales,setSales] = useState([])
   

 
    useEffect(() => {
        async function fetchItems() {
            const [warehousesData,itemsData,shopsData,salesData,lowInShop,lowInWarehouse,outOfStockInShopData,outOfStockInStoreData] = await Promise.all([
               getData('warehouse'),
               getData('items'),
               getData('shop'),
               getData('salesOrders'),
               getData('items/getByStatusInShop?itemStatus=LOW_IN_QUANTITY'),
               getData('items/getByStatusInWarehouse?itemStatus=LOW_IN_QUANTITY'),
               getData('items/getByStatusInShop?itemStatus=NOT_AVAILABLE'),
               getData('items/getByStatusInWarehouse?itemStatus=NOT_AVAILABLE'),
            ])
            setItems(itemsData)
            setWarehouses(warehousesData)
            setShops(shopsData)
            setSales(salesData)
            setLowQuantityItemsInShop(lowInShop)
            setLowQuantityItemsInStore(lowInWarehouse)
            setOutOfStockInShop(outOfStockInShopData)
            setOutOfStockInStore(outOfStockInStoreData)

        }
        fetchItems();
    },[]);

    
    const inventorySummary = warehouses.map((item)=>{
        return {
            
                title:item.title,
                number:item.stockQty,
            
            
        }
    })
    const shopSummary = shops.map((item)=>{
        return {
            
                title:item.title,
                number:item.stockQty,
            
            
        }
    })

    const lowItems=[
        {
            title:"Low Items In Store",
            number:lowQuantityItemsInStore.length,
            color: "bg-pink-100",
            text:"text-slate-600",
            numberColor:"text-red-500"
        },
        {
            title:"Low Items In Shop",
            number:lowQuantityItemsInShop.length,
            color: "bg-pink-100",
            text: "text-slate-600",
            numberColor:"text-red-500"

        },
        {
            title:"Out Of Stock In Shop",
            number:outOfStockInShop.length,
            color: "bg-pink-100",
            text: "text-slate-600",
            numberColor:"text-red-500"

        },
        {
            title:"Out Of Stock In Store",
            number:outOfStockInStore.length,
            color: "bg-pink-100",
            text: "text-slate-600",
            numberColor:"text-red-500"


        },
    ]
    const salesActivity=[
        {
            title: "Sales",
            number: sales.length,
            href: "/inventory-dashboard/sales/salesOrders",
            color: "text-blue-500"
        },
        {
            title: "Items",
            number: items.length,
            href: "/inventory-dashboard/inventory/items",
            color: "text-red-500"
        },
        {
            title: "Stores",
            number:warehouses.length,
            href: "/inventory-dashboard/inventory/warehouse",
            color: "text-green-500"
        },
        {
            title: "Shops",
            number: shops.length,
            href: "/inventory-dashboard/inventory/shop",
            color: "text-orange-500"
        },
    ]
 
  return (
    <div className='bg-blue-50 border-b border-slate-300  grid grid-cols-12 gap-4'>
        {/* {Sales Activity} */}
        <div className="col-span-full lg:col-span-8 border-r border-slate-300 p-8 py-16 lg:py-8">
            <h2 className='mb-6 text-xl'>Sales Activity</h2>
            <div className=" pr-8 grid sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4 gap-4">
                {/* {Card} */}
                {
                    salesActivity.map((item,i) =>{
                        return(
                          <SalesActivityCard item={item} key={i}/>
                        )
                    })
                }
               
            </div>
            <div className='col-span-full lg:col-span-8 p-8'>
            <h2 className='mb-6 text-xl'>Low Items</h2>
                <div className=''>
                    
                    {
                        lowItems.map((item,i)=>{
                            return(
                                <InventorySummaryCard item={item} key={i}/>
                            )
                        })
                    }

                </div>

            </div>
            
        </div>
        {/* {Store Summary} */}
        <div className="col-span-full  lg:col-span-4 p-8">
        <h2 className='mb-6 text-xl'>Store Summary</h2>
            <div className=''>
                {
                    inventorySummary.map((item,i)=>{
                        return(
                          <InventorySummaryCard item={item} key={i}/>
                        )
                    })
                }
            </div>
        <h2 className='mb-6 text-xl'>Shop Summary</h2>

            <div className=''>
                {
                    shopSummary.map((item,i)=>{
                        return(
                          <InventorySummaryCard item={item} key={i}/>
                        )
                    })
                }
            </div>

        </div>
    </div>
  )
}
