import {CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import SalesActivityCard from './SalesActivityCard'
import InventorySummaryCard from './InventorySummaryCard'

export default function SalesOverview() {
    const salesActivity=[
        {
            title: "To Be Packed",
            number: 10,
            unit: "Qty",
            href: "#",
            color: "text-blue-500"
        },
        {
            title: "To Be Shipped",
            number: 0,
            unit: "Pkgs",
            href: "#",
            color: "text-red-500"
        },
        {
            title: "To Be Delivered",
            number: 0,
            unit: "Pkgs",
            href: "#",
            color: "text-green-500"
        },
        {
            title: "To Be Invoiced",
            number: 10,
            unit: "Qty",
            href: "#",
            color: "text-orange-500"
        },
    ]
    const inventorySummary=[
        {
            title:"quantity in hand",
            number:0,
        
        },
        {
            title:"quantity to be recieved",
            number:0,
        
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
        </div>
        {/* {Inventory Summary} */}
        <div className="col-span-full  lg:col-span-4 p-8">
        <h2 className='mb-6 text-xl'>Inventory Summary</h2>
            <div className=''>
                {
                    inventorySummary.map((item,i)=>{
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
