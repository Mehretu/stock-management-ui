"use client"
import { BaggageClaim, BarChart4, ChevronLeft, Home, Settings, ShoppingBag, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import SidebarDropdownLink from './SidebarDropdownLink'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
  

export default function Sidebar({showSidebar,setShowSidebar}) {
    const {data:session,status}=useSession()
    const router =useRouter()
    if(status==="loading"){
        return  ( 
        <div className="flex items-center justify-center w-full max-h-full border border-gray-100 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-1 mt-10 mb-10 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">loading user please wait...
        </div>
       </div>
       )
    }
    if(status==='unauthenticated'){
        router.push("/login")
        return
    }
    console.log(showSidebar)
    const adminLinks =[
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
            title: "Supplier",
            href: "/inventory-dashboard/inventory/supplier"
        },
        {
            title: "Shop",
            href: "/inventory-dashboard/inventory/shop"
        },
        {
            title: "Warehouse Movements",
            href: "/inventory-dashboard/inventory/adjustments"
        },
        {
            title:"Shop Movements",
            href:"/inventory-dashboard/inventory/shopAdjustments"
        },
        {
            title:"Item Balance",
            href:"/inventory-dashboard/inventory/items/itemBalance"
        },
        // {
        //     title:"Item History",
        //     href:"/inventory-dashboard/inventory/items/itemHistory"
        // }
    ]
    const userLinks =[
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
            title: "Supplier",
            href: "/inventory-dashboard/inventory/supplier"
        },
        {
            title: "Shop",
            href: "/inventory-dashboard/inventory/shop"
        },
        {
            title: "Warehouse Adjustments",
            href: "/inventory-dashboard/inventory/adjustments"
        },
        {
            title:"Shop Adjustments",
            href:"/inventory-dashboard/inventory/shopAdjustments"
        }
    ]
    const salesLinks =[
        {
            title: "Customers",
            href: "/inventory-dashboard/sales/customers"
        },
        {
            title: "Sales Orders",
            href: "/inventory-dashboard/sales/salesOrders"
        },
        {
            title: "Company",
            href: "/inventory-dashboard/sales/company"
        },
    ]
    const purchaseLinks =[
        
        {
            title: "Purchase Orders",
            href: "/inventory-dashboard/purchases/purchaseOrders"
        }
        
    ]
    const configLinks =[
        
        {
            title: "Company Profile",
            href: "/inventory-dashboard/config/companyProfile"
        },
        {
            title: "User Management",
            href: "/inventory-dashboard/config/userManagement"
        },
        {
            title: "Import Data",
            href: "/inventory-dashboard/config/import"
        },
        
    ]

    const navLinks = session?.user?.role==="ADMIN"? adminLinks: userLinks
  return (
    <div>
         <div className={`${showSidebar?"w-60 min-h-screen bg-slate-800 text-slate-50 text-sm fixed lg:block z-50":"w-60 min-h-screen bg-slate-800 text-slate-50 text-sm fixed hidden lg:block z-50"}`}>
          {/* {Top part} */}

          <div className='flex flex-col'>
                      {/* {Logo} */}
            <div className="flex justify-between bg-slate-950">
            <Link href="/inventory-dashboard/home/overview" className=' flex space-x-2 items-center py-3 px-2'>
                <BaggageClaim className='w-4 h-4'/>
                <span className='text-xl font-semibold'>Inventory</span>
            </Link>
            <button className='px-4 py-3 lg:hidden' onClick={() => setShowSidebar(false)}>
                <ChevronLeft className='w-4 h-4 text-white text-sm'/>
            </button>
            </div>
            {/* {Links} */}
            <nav className='flex flex-col gap-3 px-3 py-6 lg:w-60 '>

                <Link className="flex items-center space-x-2 hover:bg-slate-950 p-2 rounded-md" href="/inventory-dashboard/home/overview">
                    <Home className='w-4 h-4'/>
                    <span className='text-sm'>Home</span>
                </Link>
                <SidebarDropdownLink  setShowSidebar={setShowSidebar} title="Inventory" items={navLinks} icon={BaggageClaim} collapse={false} />
                <SidebarDropdownLink  setShowSidebar={setShowSidebar} title="Sales" items={salesLinks} icon={ShoppingCart} collapse={false}/>
                <SidebarDropdownLink  setShowSidebar={setShowSidebar} title="Purchases" items={purchaseLinks} icon={ShoppingBag} collapse={false}/>
                <SidebarDropdownLink  setShowSidebar={setShowSidebar} title="Configurations" items={configLinks} icon={Settings} collapse={false}/>
                
                <Link className="flex items-center space-x-2 p-2 hover:bg-slate-950" href="/inventory-dashboard/reports">
                    <BarChart4 className='w-4 h-4'/>
                    <span className='text-sm'>Reports</span>
                </Link>
                

            </nav>
          </div>

          


          
       </div>
    </div>
  )
}
