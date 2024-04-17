"use client"
import SubmitButton from '@/components/FormInputs/SubmitButton'
import TextInput from '@/components/FormInputs/TextInput'
import { makeExportRequest, makePostRequest, makePutRequest } from '@/lib/apiRequest'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

export default function ReportForm() {
  const router = useRouter()
  const pathname = usePathname()
  console.log("Path Name",pathname)
  const {
    register,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm({
  })
  const [loading,setLoading]=useState(false)

  


 

  async function onSubmit(data){
    console.log(data)
    setLoading(true)


    let apiEndpoint;
    if (pathname.includes("/inventory-dashboard/inventory/items/report")) {
      apiEndpoint = "api/items/export";
    } else if (pathname.includes("/inventory-dashboard/sales/salesOrders/report")) {
      apiEndpoint = "api/salesOrders/export";
    } else if(pathname.includes("/inventory-dashboard/purchases/purchaseOrders/report")) {
      apiEndpoint = "api/purchaseOrders/export";
    }
    
    makeExportRequest(
        setLoading,
        apiEndpoint,
        data,
        "Item"
        )
    
    
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} 
          className='w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto my-3'>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <TextInput label="Date From" name="dateFrom" type="date" register={register} errors={errors} className='w-full'/>
          <TextInput label="Date To" name="dateTo" type="date" register={register} errors={errors} className='w-full'/>

         
          </div>
         <SubmitButton isLoading={loading} title="Export Report"/>
        </form>
  )
}
