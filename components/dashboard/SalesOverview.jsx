"use client"
import React, { useEffect, useRef, useState } from 'react'
import SalesActivityCard from './SalesActivityCard'
import InventorySummaryCard from './InventorySummaryCard'
import { getData } from '@/lib/getData'
import ApexCharts from 'apexcharts'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown} from 'lucide-react'
import Link from 'next/link'

export default function SalesOverview() {
    const [items,setItems] = useState([])
    const [lowQuantityItemsInShop,setLowQuantityItemsInShop] = useState([])
    const [lowQuantityItemsInStore,setLowQuantityItemsInStore] = useState([])
    const [outOfStockInShop,setOutOfStockInShop] = useState([])
    const [outOfStockInStore,setOutOfStockInStore] = useState([])
    const [warehouses,setWarehouses] = useState([])
    const [shops,setShops] = useState([])
    const [sales,setSales] = useState([])
    const [purchases,setPurchases] = useState([])
    const [selectedMonth, setSelectedMonth] = useState('Last 6 months'); 
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [profitRate,setProfitRate] = useState(0);
    // const chartRef = useRef(null)
   

 
    useEffect(() => {
        async function fetchItems() {
            const [warehousesData,itemsData,shopsData,salesData,purchasesData,lowInShop,lowInWarehouse,outOfStockInShopData,outOfStockInStoreData] = await Promise.all([
               getData('warehouse'),
               getData('items'),
               getData('shop'),
               getData('salesOrders'),
               getData('purchaseOrders'),
               getData('items/getByStatusInShop?itemStatus=LOW_IN_QUANTITY'),
               getData('items/getByStatusInWarehouse?itemStatus=LOW_IN_QUANTITY'),
               getData('items/getByStatusInShop?itemStatus=NOT_AVAILABLE'),
               getData('items/getByStatusInWarehouse?itemStatus=NOT_AVAILABLE'),
            ])
            setItems(itemsData)
            setWarehouses(warehousesData)
            setShops(shopsData)
            setSales(salesData)
            setPurchases(purchasesData)
            setLowQuantityItemsInShop(lowInShop)
            setLowQuantityItemsInStore(lowInWarehouse)
            setOutOfStockInShop(outOfStockInShopData)
            setOutOfStockInStore(outOfStockInStoreData)

        }
        fetchItems();
    },[]);

    useEffect(() => {
      const profit = totalRevenue - totalExpense;
      const profitRate = totalRevenue !== 0 ? ((profit / totalRevenue) * 100).toFixed(2) : 0;
      setProfitRate(profitRate);
  }, [totalRevenue, totalExpense]);

   useEffect(() => {
        let startDate;
        switch (selectedMonth) {
            case 'Last 7 days':
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 7);
                break;
            case 'Last 30 days':
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 30);
                break;
            case 'Last 6 months':
                startDate = new Date();
                startDate.setMonth(startDate.getMonth() - 6);
                break;
            case 'Last year':
                startDate = new Date();
                startDate.setFullYear(startDate.getFullYear() - 1);
                break;
            default:
                startDate = new Date();
                startDate.setMonth(startDate.getMonth() - 6);
                break;
        }

        const filteredSales = sales.filter(sale => new Date(sale.orderDate) >= startDate);
        const filteredPurchases = purchases.filter(purchase => new Date(purchase.orderDate) >= startDate);
        const totalRevenue = filteredSales.reduce((total, sale) => total + sale.orderTotal, 0);
        const totalExpense = filteredPurchases.reduce((total, purchase) => total + purchase.totalCost, 0);
        setTotalRevenue(totalRevenue);
        setTotalExpense(totalExpense);
    }, [selectedMonth, sales, purchases]);

  

    
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
    <div className='bg-blue-50 border-b border-slate-300 grid grid-cols-12 gap-2'>
        {/* {Sales Activity} */}
        <div className="col-span-full lg:col-span-8 border-r border-slate-300 p-8 py-8 md:p-8 lg:p-8">
            <h2 className='mb-4 text-xl'>Sales Activity</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 items-center">
                {/* {Card} */}
                {
                    salesActivity.map((item,i) =>{
                        return(
                          <SalesActivityCard item={item} key={i}/>
                        )
                    })
                }
               
            </div>
            <div className='pt-4 md:pt-8'>
            <h2 className='mb-4 text-xl'>Low Items</h2>
                <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-2'>
                    
                    {
                        lowItems.map((item,i)=>{
                            return(
                                <InventorySummaryCard item={item} key={i}/>
                            )
                        })
                    }

                </div>

            </div>
            <div className='flex items-center justify-center pt-4 md:pt-8'>
            <div className="max-w-sm w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-8">
            <div className="flex justify-between border-gray-200 border-b dark:border-gray-700 pb-3">
                <dl>
                <dt className="text-base font-normal text-gray-500 dark:text-gray-400 pb-1">Profit</dt>
                <dd className="leading-none text-3xl font-bold text-gray-900 dark:text-white">ETB {parseFloat(totalRevenue - totalExpense)}</dd>
                </dl>
                <div>
                <span className="bg-green-100 text-green-800 text-xs font-medium inline-flex items-center px-2.5 py-1 rounded-md dark:bg-green-900 dark:text-green-300">
                    <svg className="w-2.5 h-2.5 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13V1m0 0L1 5m4-4 4 4"/>
                    </svg>
                    Profit rate {profitRate}%
                </span>
                </div>
            </div>

            <div className="grid grid-cols-2 py-3">
                <dl>
                <dt className="text-base font-normal text-gray-500 dark:text-gray-400 pb-1">Income</dt>
                <dd className="leading-none text-xl font-bold text-green-500 dark:text-green-400">ETB {totalRevenue}</dd>
                </dl>
                <dl>
                <dt className="text-base font-normal text-gray-500 dark:text-gray-400 pb-1">Expense</dt>
                <dd className="leading-none text-xl font-bold text-red-600 dark:text-red-500">-ETB {totalExpense}</dd>
                </dl>
            </div>

            <div id="bar-chart"></div>
                <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between">
                <div className="flex justify-between items-center pt-5">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 text-center inline-flex items-center dark:hover:text-white">
                                        <span className=""></span>
                                            {selectedMonth}
                                            <div>
                                            <DropdownMenu>
                                            <DropdownMenuTrigger>
                                            <div 
                                                className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 text-center inline-flex items-center dark:hover:text-white">
                                                <ChevronDown className='text-slate-900 w-2.5 m-2.5 h-4'/>                         
                                                </div>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                            <DropdownMenuItem className="py-2 text-sm text-gray-700 hover:bg-blue-300">
                                                <button className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white' onClick={()=> setSelectedMonth("Last 7 days")}>Last 7 Days</button>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="py-2 text-sm text-gray-700 hover:bg-blue-300">
                                                <button className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white' onClick={()=> setSelectedMonth("Last 30 days")}>Last 30 Days</button>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="py-2 text-sm text-gray-700 hover:bg-blue-300">
                                                <button className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white' onClick={()=> setSelectedMonth("Last 6 months")}>Last 6 Months</button>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="py-2 text-sm text-gray-700 hover:bg-blue-300">
                                                <button className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white' onClick={()=> setSelectedMonth("Last year")}>Last Year</button>
                                            </DropdownMenuItem>

                                            </DropdownMenuContent>
                                            </DropdownMenu>
                                            </div>
                                        </span>
                 
                   
                    <Link
                    href="#"
                    className="uppercase text-sm font-semibold inline-flex items-center rounded-lg text-blue-600 hover:text-blue-700 dark:hover:text-blue-500  hover:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 px-3 py-2">
                    Revenue Report
                    <svg className="w-2.5 h-2.5 ms-1.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                    </svg>
                    </Link>
                </div>
                </div>
            </div>
            </div>
            
        </div>
        {/* {Store Summary} */}
        <div className="col-span-full lg:col-span-4 px-4 md:px-2 py-4 md:py-0">
        <h2 className='mb-4 text-xl'>Store Summary</h2>
            <div className='sm:grid sm:grid-cols-2 gap-2'>
                {
                    inventorySummary.map((item,i)=>{
                        return(
                          <InventorySummaryCard item={item} key={i}/>
                        )
                    })
                }
            </div>
        <h2 className='mb-4 text-xl'>Shop Summary</h2>

            <div className='sm:grid sm:grid-cols-2 gap-2'>
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
