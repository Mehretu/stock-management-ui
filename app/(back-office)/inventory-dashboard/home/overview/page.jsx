"use client"
import CurrentStock from '@/components/dashboard/CurrentStock'
import SalesOverview from '@/components/dashboard/SalesOverview'
import { getData } from '@/lib/getData';
import React, { useEffect, useState } from 'react'

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [warehouses,setWarehouses] = useState([]);
  const [sales,setSales] = useState([]);


  useEffect(() => {
    async function fetchItems() {
        const itemsData = await getData("items");
        const warehouseData = await getData("warehouse")
        const salesData = await getData("salesOrders")
        setItems(itemsData);
        setWarehouses(warehouseData)
        setSales(salesData)
    }
    fetchItems();
}, []);
  
  return (
    <div>
        <SalesOverview/>
        {/* <CurrentStock items={items} title="Available Items In Stock"/>
        {
          warehouses.map((warehouse,i) => {
            return <CurrentStock key={i} title={`Items | ${warehouse.title}`} items={warehouse.items}/>
          })
        } */}
        
    </div>
  )
}
