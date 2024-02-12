"use client"
import { BaggageClaim, BarChart4, Cable, ChevronLeft, ChevronRight, Files, Home, Layers, PlusCircle, Settings, ShoppingBag, ShoppingCart, X } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import SidebarDropdownLink from './SidebarDropdownLink'
  

export default function Sidebar({showSidebar,setShowSidebar}) {
    console.log(showSidebar)
    const inventoryLinks =[
        {
            title: "All",
            href: "/inventory-dashboard/inventory"
        },
        {
            title: "Items",
            href: "/inventory-dashboard/inventory/items"
        },
        {
            title: "Categories",
            href: "/inventory-dashboard/inventory/categories"
        },
        {
            title: "Brands",
            href: "/inventory-dashboard/inventory/brands"
        },
        {
            title: "Units",
            href: "/inventory-dashboard/inventory/units"
        },
        {
            title: "Warehouse",
            href: "/inventory-dashboard/inventory/warehouse"
        },
        {
            title: "Inventory Adjustments",
            href: "/inventory-dashboard/inventory/adjustments"
        },
        {
            title: "Supplier",
            href: "/inventory-dashboard/inventory/supplier"
        },
        {
            title: "Shop",
            href: "/inventory-dashboard/inventory/shop"
        },
    ]
    const salesLinks =[
        {
            title: "Customers",
            href: "#"
        },
        {
            title: "Sales Orders",
            href: "#"
        },
        {
            title: "Packages",
            href: ""
        },
        {
            title: "Invoices",
            href: ""
        },
        {
            title: "Sales Receipts",
            href: ""
        },
        {
            title: "Payment Recieved",
            href: ""
        },
        {
            title: "Sales Returns",
            href: ""
        },
        {
            title: "Credit Notes",
            href: ""
        },
    ]
  return (
    <div>
         <div className={`${showSidebar?"w-60 min-h-screen bg-slate-800 text-slate-50 fixed lg:block z-50":"'w-60 min-h-screen bg-slate-800 text-slate-50 fixed hidden lg:block z-50'"}`}>
          {/* {Top part} */}

          <div className='flex flex-col '>
                      {/* {Logo} */}
            <div className="flex justify-between bg-slate-950">
            <Link href="/inventory-dashboard/home/overview"className=' flex space-x-2 items-center py-3 px-2'>
                <BaggageClaim/>
                <span className='text-xl font-semibold'>Inventory</span>
            </Link>
            <button className='px-4 py-3 lg:hidden' onClick={() => setShowSidebar(false)}>
                <ChevronLeft className='w-6 h-6 text-white'/>
            </button>
            </div>
            {/* {Links} */}
            <nav className='flex flex-col gap-3 px-3 py-6 lg:w-60'>

                <Link className="flex items-center space-x-2 bg-blue-600 p-2 rounded-md" href="/inventory-dashboard/home/overview">
                    <Home className='w-4 h-4'/>
                    <span>Home</span>
                </Link>
                <SidebarDropdownLink setShowSidebar={setShowSidebar} title="Inventory" items={inventoryLinks} icon={BaggageClaim} collapse={false} />
                <SidebarDropdownLink title="Sales" items={salesLinks} icon={ShoppingCart} collapse={false}/>
                <button className="flex items-center space-x-2 p-2">
                    <ShoppingBag className='w-4 h-4'/>
                    <span>Purchases</span>
                </button>
                <Link className="flex items-center space-x-2 p-2" href="">
                    <Cable className='w-4 h-4'/>
                    <span>Integrations</span>
                </Link>
                <Link className="flex items-center space-x-2 p-2" href="">
                    <BarChart4 className='w-4 h-4'/>
                    <span>Reports</span>
                </Link>
                <Link className="flex items-center space-x-2 p-2" href="">
                    <Files className='w-4 h-4'/>
                    <span>Documents</span>
                </Link>

            </nav>
          </div>

          


          {/* {Bottom} */}
          <div className='flex flex-col '>
          <button className='bg-slate-950 flex space-x-2 items-center justify-center py-3 px-2'>
                <ChevronLeft/>
            </button>

          </div>
          {/* {Subscription Card} */}
          {/* {Footer Icon} */}
       </div>
    </div>
  )
}
