"use client"
import SubmitButton from '@/components/FormInputs/SubmitButton'
import TextInput from '@/components/FormInputs/TextInput'
import FormHeader from '@/components/dashboard/FormHeader'
import { makePostRequest } from '@/lib/apiRequest'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import FileInput from '../FormInputs/FileInput'
import SelectInput from '../FormInputs/SelectInput'
import { getData } from '@/lib/getData'
import Radio from '../FormInputs/Radio'
import { parseExcelFile } from '@/lib/excelUtils'

const specificOptions = [
  {
      title:"Items",
      id:"items"
  },
  {
      title:"Sales Orders",
      id:"sales"
  },
  {
      title:"Purchase Orders",
      id:"purchases"
  }
]

export default function ImportForm() {
  const router=useRouter()
  const [shops,setShops] = useState([])
  const [warehouses,setWarehouses] = useState([])
  const [importType,setImportType] = useState('shop')
  const [specificId, setSpecificId] = useState(specificOptions[0].id)
  

  useEffect(() =>{
    async function fetchData(){
        const shopData = await getData("shop")
        const warehouseData = await getData("warehouse")
        setShops(shopData);
        setWarehouses(warehouseData);
      
    }
    fetchData()
  },[])
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
    
    setLoading(true)
    let importData = {}

    if (data.specificId) {
      if (data.specificId === "items") {
        const defaultId = importType === "shop" ? shops[0]?.id : warehouses[0]?.id;

        const items = await parseExcelFile(data.file[0]);

         importData = {
          ...data,
          items: items,
        };

        if (!data.shopId && importType === "shop") {
          importData.shopId = defaultId;
        }
        if (!data.warehouseId && importType === "warehouse") {
          importData.warehouseId = defaultId;
        }
      }
      console.log("Import Data",importData)

    
      makePostRequest(
        setLoading,
        `api/${data.specificId}/import`,
        importData,
        "Item",
        redirect,
        reset

      )
    }
    
   
  }
  return (
    <div>
        {/* {Header} */}
        <FormHeader title="Import Excel" href="/inventory-dashboard/config/import"/>
        {/* {Form} */}
        <form onSubmit={handleSubmit(onSubmit)} 
          className='w-auto max-w-xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 mx-auto my-3'>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <FileInput label="Select Excel File" register={register} accept=".xls,.xlsx,.csv"/>
         {specificId === "items" && (
           <div className='flex'>
           <Radio label="Shop" value="shop" id="shop" name="importType" checked={importType === 'shop'} onChange={() => setImportType('shop')}/>
           <Radio label="Warehouse" value="warehouse" id="warehouse" name="importType" checked={importType === 'warehouse'} onChange={() => setImportType('warehouse')}/>
           </div>
         )

         }
          {specificId === "items" && (
                      <SelectInput 
                      label={importType === 'shop'? "Shop":"Warehouse"} 
                      name={importType === 'shop'? "shopId" : "warehouseId"} 
                      register={register} errors={errors} 
                      options={importType === 'shop'? shops : warehouses} 
                      disabled={specificId !== 'items'}
                      specificId={specificId}

                      />
          )}
          <SelectInput 
            label="Specific" 
            name="specificId" 
            value={specificId} 
            register={register} 
            errors={errors} 
            options={specificOptions} 
            onChange={(value) => setSpecificId(value)}
            />
          </div>
         <SubmitButton isLoading={loading} title="Import Excel"/>
        </form>
    </div>
  )
}
