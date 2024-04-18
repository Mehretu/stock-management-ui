"use client"
import FormHeader from '@/components/dashboard/FormHeader'
import { getData } from '@/lib/getData'
import CreatePurchaseOrderForm from './CreatePurchaseOrderForm';
import { useEffect, useState } from 'react';

export default async function NewPurchase({tableInitialData={},  initialData={},isUpdate=false}) {
  const [suppliers,setSuppliers] = useState([])
  const [items,setItems] = useState([])
  useEffect(() => {
    async function fetchDatas(){
      const supplierData= await getData('supplier')
      const itemsData= await getData('items')
      setSuppliers(supplierData)
      setItems(itemsData)
    }
    fetchDatas()

  },[])
  
  return (
    <div>
        {/* {Header} */}
        <FormHeader title={isUpdate?"Update Purchases":"New Purchase"} href="/inventory-dashboard/purchases/purchaseOrders"/>
        {/* {Form} */}
        <CreatePurchaseOrderForm suppliers={suppliers} items={items} initialData={initialData} tableInitialData={tableInitialData} isUpdate={isUpdate}/>
    </div>
  )
}
