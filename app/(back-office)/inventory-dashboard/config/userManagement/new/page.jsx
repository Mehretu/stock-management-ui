"use client"
import SubmitButton from '@/components/FormInputs/SubmitButton'
import TextInput from '@/components/FormInputs/TextInput'
import FormHeader from '@/components/dashboard/FormHeader'
import { makePostRequest, makePutRequest } from '@/lib/apiRequest'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function NewUser({initialData={},isUpdate=false}) {
  
  const router = useRouter()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialData,
  })
  const [loading,setLoading]=useState(false)
  function redirect(){
    router.push("/inventory-dashboard/config/userManagement")
    router.refresh()
  }

  async function onSubmit(data){
    console.log(data)
    setLoading(true)

    if(isUpdate){
      makePutRequest(
        setLoading,
        `api/user/${initialData.id}`,
        data,
        "User",
        redirect,
        reset
        );
    }else{
      makePostRequest(
        setLoading,
        "api/user",
        data,
        "User",
        reset
        )
    }
  }
  return (
    <div>
        {/* {Header} */}
        <FormHeader title={isUpdate?"Update User":"New User"} href="/inventory-dashboard/config/userManagement"/>
        {/* {Form} */}
        <form onSubmit={handleSubmit(onSubmit)} 
          className='w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto my-3'>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <TextInput label="Name" name="name" register={register} errors={errors}/>
          <TextInput label="Email" name="email" type='email' register={register} errors={errors}/>
          <TextInput label="Phone Number" name="phone" register={register} errors={errors}/>
          <TextInput label="Password" name="password" register={register} errors={errors}/>

          </div>
         <SubmitButton isLoading={loading} title={isUpdate?"Updated Customer":"New Customer"}/>
        </form>
    </div>
  )
}
