"use client"
import FixedHeader from '@/components/dashboard/FixedHeader'
import OptionCard from '@/components/dashboard/OptionCard'
import { LayoutGrid, LayoutPanelTop, Hexagon, Warehouse, Scale, Diff, Factory } from 'lucide-react'
import React from 'react'

export default function Inventory() {
  const itemCardOptions =[
    {
      title:"Items",
      description:"Create standalone items and services that you buy and sell",
      link:"/inventory-dashboard/inventory/items/new",
      linkTitle:"New Item",
      enabled:true,
      icon: LayoutGrid,

    },
    {
      title:"Categories",
      description:"Bundle different items together and sell them as kits",
      link:"/inventory-dashboard/inventory/categories/new",
      linkTitle:"New Category",
      enabled:true,
      icon: LayoutPanelTop,

    },
    {
      title:"Brands",
      description:"Add the brand for item",
      link:"/inventory-dashboard/inventory/brands/new",
      linkTitle:"New Brand",
      enabled:true,
      icon: Hexagon,

    },
    {
      title:"Warehouse",
      description:"Add Warehouse where the stock is stored",
      link:"/inventory-dashboard/inventory/warehouse/new",
      linkTitle:"New Warehouse",
      enabled:true,
      icon: Warehouse,

    },
    {
      title:"Units",
      description:"Tweak your item prices for specifc contacts or transactions",
      link:"/inventory-dashboard/inventory/units/new",
      linkTitle:"New Units",
      enabled:true,
      icon: Scale,

    },
    {
      title:"Suppliers",
      description:"Tweak your item prices for specifc contacts or transactions",
      link:"/inventory-dashboard/inventory/supplier/new",
      linkTitle:"New Supplier",
      enabled:true,
      icon: Factory,

    },
    {
      title:"Inventory Adjustment",
      description:"Transfer stock from the main warehouse",
      link:"/inventory-dashboard/inventory/adjustments/new",
      linkTitle:"New Adjustments",
      enabled:true,
      icon: Diff,

    },

    
  ]
  return (
    <div>
        <FixedHeader newLink="/inventory-dashboard/inventory/items/new" />
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 py-8 px-16 gap-6">
        {
          itemCardOptions.map((card,i)=>{
            return(
              <OptionCard optionData={card} key={i}/>
            )
          })
        }          
        </div>
    </div>
  )
}