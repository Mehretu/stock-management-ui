"use client"
import SubmitButton from '@/components/FormInputs/SubmitButton'
import TextInput from '@/components/FormInputs/TextInput'
import FormHeader from '@/components/dashboard/FormHeader'
import { makePutRequest } from '@/lib/apiRequest'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function AddMoreItem({initialData={}}) {
  const router=useRouter()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
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
        `api/items/addMoreItem/${initialData.id}`,
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
        <FormHeader title="Add More Item" href="/inventory-dashboard/inventory/items"/>
        {/* {Form} */}
        <form onSubmit={handleSubmit(onSubmit)} 
          className='w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto my-3'>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <TextInput label="Item Name" name="title"  register={register} defaultValue={initialData.title} errors={errors} />
          <TextInput label="Quantity" name="quantity" register={register} errors={errors} type='number'/>
          <TextInput label="Buying Price" type="number" name="buyingPrice" register={register} errors={errors} className='w-full'/>
          <TextInput label="Selling Price" type="number" name="sellingPrice" register={register} errors={errors} className='w-full'/>
          </div>
         <SubmitButton isLoading={loading} title="Added Item"/>
        </form>
    </div>
  )
}
