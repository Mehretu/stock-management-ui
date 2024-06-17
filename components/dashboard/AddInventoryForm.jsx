"use client"
import SelectInput from '@/components/FormInputs/SelectInput'
import SubmitButton from '@/components/FormInputs/SubmitButton'
import TextInput from '@/components/FormInputs/TextInput'
import TextareaInput from '@/components/FormInputs/TextareaInput'
import { makePostRequest } from '@/lib/apiRequest'
import { AutoComplete } from 'primereact/autocomplete'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function AddInventoryForm({items,warehouses,suppliers}) {

  const [supplierValue, setSupplierValue] = useState(null);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [itemValue, setItemValue] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);


  const timestamp = Date.now()
  const referenceNumbers =  `REF-${timestamp}`
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm()
  const [loading,setLoading]=useState(false)

  const handleSupplierSuggestion = (event) => {
    const query = event.query.toLowerCase();
    let _filteredSuppliers = suppliers.filter((supplier) => supplier.title.toLowerCase().includes(query));
    console.log("Filtered Suppliers", _filteredSuppliers)
    setFilteredSuppliers(_filteredSuppliers);
  };
    

  
  const handleSupplierChange = (e) => {
    const supplier = setSupplierValue(e.value);
    console.log("Supplier", supplier)
    const selectedSupplier = suppliers.find((supplier) => supplier.title === e.value.title);
    console.log("Selected Supplier",selectedSupplier)
    if (selectedSupplier) {
      setValue('supplierId', selectedSupplier.id);
      
    }
  };

  const handleItemSuggestion = (event) => {
    const query = event.query.toLowerCase();
    let _filteredItems = items.filter((item) => item.title.toLowerCase().includes(query));
    console.log("Filtered Items", _filteredItems)
    setFilteredItems(_filteredItems);
  };
    

  
  const handleItemChange = (e) => {
    const item = setItemValue(e.value);
    console.log("Item", item)
    const selectedItem = items.find((item) => item.title === e.value.title);
    console.log("Selected Item",selectedItem)
    if (selectedItem) {
      setValue('itemId', selectedItem.id);
      
    }
  };

  
    
    async function onSubmit(data){
      console.log(data)
      setLoading(true)
      makePostRequest(
        setLoading,
        "api/adjustments/add",
        data,
        "Stock Adjustment",
        reset
        )
    
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} 
    className='w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto my-3'>
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
    <TextInput type="text" label="Reference Number" name="referenceNumber" register={register} errors={errors} defaultValue={referenceNumbers}/>
    

    <div className="flex p-2 space-x-16 ">
           <div className=''>
           <label htmlFor="item-autocomplete" className="block text-sm font-medium leading-6 text-gray-900 mb-2 ">
              Item
            </label>

                <AutoComplete
                value={itemValue}
                suggestions={filteredItems}
                completeMethod={handleItemSuggestion}
                field="title"
                onChange={handleItemChange}
                className='w-1/2'
                />
           </div>
    
          <div>

          <label htmlFor="supplier-autocomplete" className="block text-sm font-medium leading-6 text-gray-900 mb-2 ">
              Supplier
            </label>

                <AutoComplete
                value={supplierValue}
                suggestions={filteredSuppliers}
                completeMethod={handleSupplierSuggestion}
                field="title"
                onChange={handleSupplierChange}
                className='w-80'
                />
          </div>   
          </div>

    <TextInput type="number" label="Enter Quantity of Stock to Add" name="addStockQty" register={register} errors={errors} />

    <SelectInput name="recievingWarehouseId" label="Select the Warehouse that will recieve the stock" register={register} className='w-full' options={warehouses}/> 
    <TextareaInput label="Adjustment Notes" name="notes" register={register} errors={errors}/>
    </div>
   <SubmitButton isLoading={loading} title="Adjustment"/>
  </form>
  )
}
