"use client"
import React from 'react'
import SalesActivityCard from './SalesActivityCard'

export default function Reports() {
   

 


    const options=[
        {
            title:"Items Report",
            href: "/inventory-dashboard/inventory/items/report",
            color: "bg-pink-100",
            text:"text-slate-600",
        },
        {
            title:"Sales Report",
            href: "/inventory-dashboard/sales/salesOrders/report",
            color: "bg-pink-100",
            text: "text-slate-600",

        },
        {
            title:"Purchase Report",
            href: "/inventory-dashboard/purchases/purchaseOrders/report",
            color: "bg-pink-100",
            text: "text-slate-600",

        },

    ]

 
  return (
        <div className="col-span-full lg:col-span-8 border-r border-slate-300 p-8 py-16 lg:py-8">
            <h2 className='mb-6 text-xl'>Reports</h2>
            <div className=" pr-8 grid sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4 gap-4">
                {
                    options.map((item,i) =>{
                        return(
                          <SalesActivityCard item={item} key={i}/>
                        )
                    })
                }
               
            </div>
        
            
        </div>
    
  )
}
