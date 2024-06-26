"use client"

import FormHeader from '@/components/dashboard/FormHeader'
import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import AddStocktoShopForm from './AddStocktoShopForm'
import TransfertoShopForm from './TransfertoShopForm'

export default function ShopAdjustmentForm({items,warehouses,shops,suppliers}) {
  const tabs =[
    {
      title:"Add Stock to Shop",
      icon: Plus,
      form:"add"
    },
    {
      title:"Transfer Stock to Shop",
      icon: Minus,
      form:"transfer"
    }
  ]
 const [activeForm,setActiveForm]=useState("add")


  return (
    <div>
        {/* {Header} */}
        <FormHeader title="New Shop Adjustment" href="/inventory-dashboard/inventory/shopAdjustments"/>
        {/* {Form} */}


          <div className="border-b border-gray-200 dark:border-gray-700 w-full max-w-4xl px-4 py-2 bg-white border shadow mx-auto my-4 rounded ">
              <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                  {
                    tabs.map((tab,i)=>{
                      const Icon = tab.icon
                      const name = tab.title
                      return(
                        <li className="me-2" key={i}>
                      <button onClick={()=>setActiveForm(tab.form)} 
                      className={`${activeForm==tab.form?"inline-flex items-center justify-center p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500 group":"inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300"}`}>
                          <Icon className='w-4 h-4 me-2 '/>
                          {name}
                      </button>
                        </li>
                      )
                    })
                  }      
              </ul>
          </div>
          <div>
          {activeForm==="add"?<AddStocktoShopForm items={items} shops={shops} suppliers={suppliers}/>:<TransfertoShopForm items={items} warehouses={warehouses} shops={shops}/>}

          </div>
    
    </div>
  )
}
