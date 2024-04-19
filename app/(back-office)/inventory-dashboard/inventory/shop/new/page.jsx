"use client"
import SelectInput from '@/components/FormInputs/SelectInput'
import SubmitButton from '@/components/FormInputs/SubmitButton'
import TextInput from '@/components/FormInputs/TextInput'
import TextareaInput from '@/components/FormInputs/TextareaInput'
import FormHeader from '@/components/dashboard/FormHeader'
import { makePostRequest, makePutRequest } from '@/lib/apiRequest'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function NewShop({initialData={},isUpdate=false}) {
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
    router.push("/inventory-dashboard/inventory/shop")
    router.refresh()
  }

  async function onSubmit(data){
    console.log(data)
    setLoading(true)
    if(isUpdate){
      makePutRequest(
        setLoading,
        `api/shop/${initialData.id}`,
        data,
        "Shop",
        redirect,
        reset

      )
    }else{
      makePostRequest(
        setLoading,
        "api/shop",
        data,
        "Shop",
        reset
        )
    }
   
  }
  return (
    <div>
        {/* {Header} */}
        <FormHeader title={isUpdate?"Update Shop":"New Shop"} href="/inventory-dashboard/inventory/shop"/>
        {/* {Form} */}
        <form onSubmit={handleSubmit(onSubmit)} 
          className='w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto my-3'>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <TextInput label="Shop Title" name="title" register={register} errors={errors} className='w-full'/>
          <TextInput label="Location" name="location" register={register} errors={errors}/>
          {/* <TextInput label="Warehouse Type" name="type" register={register} errors={errors}/> */}
          <TextareaInput label="Shop Description" name="description" register={register} errors={errors}/>
          </div>
         <SubmitButton isLoading={loading} title={isUpdate?"Updated Shop":"New Shop"}/>
        </form>
    </div>
  )
}
