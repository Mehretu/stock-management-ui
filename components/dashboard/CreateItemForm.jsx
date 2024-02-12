"use client"
import ImageInput from '@/components/FormInputs/ImageInput'
import SelectInput from '@/components/FormInputs/SelectInput'
import SubmitButton from '@/components/FormInputs/SubmitButton'
import TextInput from '@/components/FormInputs/TextInput'
import TextareaInput from '@/components/FormInputs/TextareaInput'
import { makePostRequest, makePutRequest } from '@/lib/apiRequest'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function CreateItemForm({categories,units,brands,warehouses,suppliers,initialData={},isUpdate=false}) {
  const router = useRouter()
  const [imageUrl,setImageUrl]=useState(initialData.imageUrl)
  const {
    register,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm({
    defaultValues:initialData
  })
  const [loading,setLoading]=useState(false)
  function redirect(){
    router.push("/inventory-dashboard/inventory/items")
    router.refresh()
  }

  async function onSubmit(data){
    data.imageUrl=imageUrl
    console.log(data)
    setLoading(true)
    if(isUpdate){
      makePutRequest(
        setLoading,
        `api/items/${initialData.id}`,
        data,
        "Item",
        redirect,
        reset
        );

    }else{
      makePostRequest(
        setLoading,
        "api/items",
        data,
        "Item",
        reset
        )
        setImageUrl("")
    }
    
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} 
          className='w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto my-3'>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <TextInput label="Item Title" name="title" register={register} errors={errors} className='w-full'/>
          <SelectInput name="categoryId" label="Select the Item Category" register={register} className='w-full' options={categories}/> 
          <TextInput label="Item SKU" name="sku" register={register} errors={errors}  className='w-full'/>
          <TextInput label="Item Barcode" name="barcode" register={register} errors={errors} className='w-full'/>
          <TextInput label="Item Quantity" type="number" name="quantity" register={register} errors={errors} className='w-full'/>
          <SelectInput name="unitId" label="Select the Item Unit" register={register} className='w-full' options={units}/> 
          <SelectInput name="brandId" label="Select the Item Brand" register={register} className='w-full' options={brands}/> 
          <TextInput label="Buying Price" type="number" name="buyingPrice" register={register} errors={errors} className='w-full'/>
          <TextInput label="Selling Price" type="number" name="sellingPrice" register={register} errors={errors} className='w-full'/>
          <SelectInput name="supplierId" label="Select the Item Supplier" register={register} className='w-full' options={suppliers}/> 

          <TextInput label="Re-Order Point" type="number" name="reOrderPoint" register={register} errors={errors} className='w-full'/>
          <SelectInput name="warehouseId" label="Select the Item Warehouse" register={register} className='w-full' options={warehouses}/> 
          <TextInput label="Item Weight in Kgs" type="number" name="weight" register={register} errors={errors} className='w-full'/>
          <TextInput label="Item Dimensions in cm (20 x 30)" name="dimensions" register={register} errors={errors} className='w-full'/>
          <TextInput label="Item Tax Rate in %" type="number" name="taxRate" register={register} errors={errors} className='w-full'/>
          <TextareaInput label="Item Description" name="description" register={register} errors={errors}/>
          <TextareaInput label="Item Notes" name="notes" register={register} errors={errors}/>
           {/* Upload thing */}
          <ImageInput label="Item Image" imageUrl={imageUrl} setImageUrl={setImageUrl} endpoint='imageUploader'/>
          </div>
         <SubmitButton isLoading={loading} title={isUpdate?"Updated Item":"New Item"}/>
        </form>
  )
}
