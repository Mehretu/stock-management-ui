"use client"
import ShopAdjustmentForm from '@/components/dashboard/ShopAdjustmentForm'
import { getData } from '@/lib/getData'
import { useEffect, useState } from 'react'


export default function NewShopAdjustments() {
  const [items,setItems] = useState([])
  const [warehouses,setWarehouses] = useState([])
  const [shops,setShops] = useState([])
  const [suppliers,setSuppliers] = useState([])

  useEffect(() => {
    async function fetchDatas(){
      const itemsData = await getData("items")
      const warehousesData = await getData("warehouse")
      const shopsData = await getData("shop")
      const suppliersData = await getData("supplier")
      setItems(itemsData);
      setWarehouses(warehousesData)
      setShops(shopsData)
      setSuppliers(suppliersData)
    }
    fetchDatas()
  }, [])
  

  return (
    <ShopAdjustmentForm items={items} warehouses={warehouses} shops={shops} suppliers={suppliers}/>
  )
}
