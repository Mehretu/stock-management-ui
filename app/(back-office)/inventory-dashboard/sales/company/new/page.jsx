"use client"
import SubmitButton from '@/components/FormInputs/SubmitButton'
import TextInput from '@/components/FormInputs/TextInput'
import FormHeader from '@/components/dashboard/FormHeader'
import { makePostRequest, makePutRequest } from '@/lib/apiRequest'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function NewCompany({initialData={},isUpdate=false}) {
  const {data:session} = useSession()
  
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
    router.push("/inventory-dashboard/sales/company")
    router.refresh()
  }

  async function onSubmit(data){
    console.log(data)
    setLoading(true)
    const companyData = {
      ...data,
      userId: session.user.id
    }

    if(isUpdate){
      makePutRequest(
        setLoading,
        `api/companies/${initialData.id}`,
        companyData,
        "Company",
        redirect,
        reset
        );
    }else{
      makePostRequest(
        setLoading,
        "api/companies",
        companyData,
        "Company",
        reset
        )
    }
  }
  return (
    <div>
        {/* {Header} */}
        <FormHeader title={isUpdate?"Company Details":"New Company"} href="/inventory-dashboard/sales/company"/>
        {/* {Form} */}
        <form onSubmit={handleSubmit(onSubmit)} 
          className='w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto my-3'>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <TextInput label="Company Name" name="title" register={register} errors={errors} defaultValue={initialData?.title}/>
          <TextInput label="Owner Name" name="ownerName" register={register} errors={errors} defaultValue={initialData?.ownerName}/>
          <TextInput label="Tin Number" name="tinNumber" register={register} errors={errors} defaultValue={initialData?.tinNumber}/>
          <TextInput label="Email" name="email" type='email' register={register} errors={errors} defaultValue={initialData?.email}/>
          <TextInput label="Phone Number" name="phone" register={register} errors={errors} defaultValue={initialData?.phone}/>
          <TextInput label="Fax" name="fax" register={register} errors={errors} defaultValue={initialData?.fax}/>
          <TextInput label="Address" name="address" register={register} errors={errors} defaultValue={initialData?.address}/>

          </div>
         <SubmitButton isLoading={loading} title={isUpdate?"Updated Company":"New Company"}/>
        </form>
    </div>
  )
}
