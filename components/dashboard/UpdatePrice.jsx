"use client"
import SubmitButton from '@/components/FormInputs/SubmitButton'
import TextInput from '@/components/FormInputs/TextInput'
import FormHeader from '@/components/dashboard/FormHeader'
import { makePutRequest } from '@/lib/apiRequest'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function UpdatePrice({initialData={}}) {
  const router=useRouter()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues:initialData,
  })
  const [loading,setLoading]=useState(false)
  function redirect(){
    router.push("/inventory-dashboard/inventory/items")
    router.refresh()
  }

  async function onSubmit(data){
    console.log(data)
    setLoading(true)
    {
      makePutRequest(
        setLoading,
        `api/items/updatePrice/${initialData.id}`,
        data,
        "Item",
        redirect,
        reset

      )
    }
   
  }
  return (
    <div>
        {/* {Header} */}
        <FormHeader title="Update Price" href="/inventory-dashboard/inventory/items"/>
        {/* {Form} */}
        <form onSubmit={handleSubmit(onSubmit)} 
          className='w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto my-3'>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <TextInput label="Buying Price" type="number" name="buyingPrice" register={register} errors={errors} className='w-full'/>
          <TextInput label="Selling Price" type="number" name="sellingPrice" register={register} errors={errors} className='w-full'/>
          </div>
         <SubmitButton isLoading={loading} title="Updated Price"/>
        </form>
    </div>
  )
}
