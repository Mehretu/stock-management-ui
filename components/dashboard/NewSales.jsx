"use client"
import FormHeader from '@/components/dashboard/FormHeader'
import { getData } from '@/lib/getData'
import CreateSalesOrderForm from './CreateSalesOrderForm'
import { useEffect, useState } from 'react'

export default function NewSales({initialData={},isUpdate=false,tableInitialData={}}) {
  const [customers,setCustomers] = useState([])
  const [companies,setCompanies] = useState([])
  const [items,setItems] = useState([])

  console.log("Initial Data",initialData)

  useEffect(() => {
    async function fetchDatas(){
      const customersData= await getData('customers')
      const companiesData = await getData('companies')
      const itemsData=  await  getData('items')
      setCustomers(customersData)
      setCompanies(companiesData)
      setItems(itemsData)

    }
    fetchDatas()
  },[])
  

  

  return (
    <div>
        {/* {Header} */}
        <FormHeader title={isUpdate?"Update Sales":"New Sales"} href="/inventory-dashboard/sales/salesOrders"/>
        {/* {Form} */}
        <CreateSalesOrderForm tableInitialData={tableInitialData} customers={customers} companies={companies} items={items} initialData={initialData} isUpdate={isUpdate}/>
    </div>
  )
}
