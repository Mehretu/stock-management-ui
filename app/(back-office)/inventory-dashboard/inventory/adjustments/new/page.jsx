"use client"
import AdjustmentForm from '@/components/dashboard/AdjustmentForm'
import { getData } from '@/lib/getData'
import { useEffect, useState } from 'react'


export default function NewAdjustments() {
const [items,setItems] = useState([]);
const [warehouses,setWarehouses] = useState([])
const [suppliers,setSuppliers] = useState([])

useEffect(() => {
  async function fetchItems(){
    const itemsData =  await getData("items")
    const warehousesData = await getData("warehouse")
    const suppliersData = await getData("supplier")
    setItems(itemsData)
    setWarehouses(warehousesData)
    setSuppliers(suppliersData)

  }
  fetchItems()
},[])
  

  return (
    <AdjustmentForm items={items} warehouses={warehouses} suppliers={suppliers}/>
  )
}
