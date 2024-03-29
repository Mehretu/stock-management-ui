"use client"
import SelectInput from '@/components/FormInputs/SelectInput'
import SubmitButton from '@/components/FormInputs/SubmitButton'
import TextInput from '@/components/FormInputs/TextInput'
import { makePostRequest, makePutRequest } from '@/lib/apiRequest'
import { Plus, X, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Input from '../FormInputs/Input'
import { Autocomplete, TextField } from '@mui/material'
import toast from 'react-hot-toast'

export default function CreateSalesOrderForm({customers={},items={},initialData={},tableInitialData={},isUpdate=false}) {
  const router = useRouter()
  const [orderedItems, setOrderedItems] = useState([]);
  const timestamp = Date.now()
  const referenceNumbers =  `SALES-${timestamp}`


  const {
    register,
    handleSubmit,
    reset,
    formState: {errors},
    setValue,
  } = useForm({
    defaultValues:initialData
  })
  const [loading,setLoading]=useState(false)
  function redirect(){
    router.push("/inventory-dashboard/sales/salesOrders")
    router.refresh()
  }

 

  // Function to add a new row for an item
  const addNewItemRow = () => {
    const newItemRow = {
      itemId: undefined,
      itemName: '',
      itemNumber:'',
      quantity: '1',
      price: '',
      total: '',
      availableQuantity:'',
      

    };
    setOrderedItems([...orderedItems, newItemRow]);
  };

  const removeItemRow = (index) => {
    const updatedItems = [...orderedItems];
    updatedItems.splice(index, 1);
    setOrderedItems(updatedItems);
  };



  const handleSuggestionSelected = (event, option, selectedIndex) => {
    const selectedItem = items.find((item) => item.title === option.title || item.itemNumber === option.itemNumber);
    if (selectedItem) {
      const updatedItems = [...orderedItems];
      updatedItems[selectedIndex] = {
        ...updatedItems[selectedIndex],
        itemId: selectedItem.id,
        itemName: selectedItem.title,
        itemNumber: selectedItem.itemNumber,
        availableQuantity: selectedItem.quantity,
        price: selectedItem.sellingPrice,
        total: selectedItem.sellingPrice * updatedItems[selectedIndex].quantity, 
      };
      setOrderedItems(updatedItems);
    } 
  };
  const handleCustomerSuggestion = (event, option) => {
    if (option) {
      const selectedCustomer = customers.find((customer) => customer.name === option.name);
      if (selectedCustomer) {
        setValue('customerId', selectedCustomer.id); 
      }
    }
  };
  const handleQuantityChange = (index, value, availableQuantity) => {

    if(value <= availableQuantity){
      const updatedItems = [...orderedItems];
      updatedItems[index].quantity = value;
      updatedItems[index].total = value * updatedItems[index].price; 
      console.log("Quntity change:", updatedItems);
      setOrderedItems(updatedItems);
    }else{
      toast.error("The Inserted Quantity Is More Than The Available ")

    }
    
  };
  

  const vatOptions = [
    {
        title:"No Vat",
        id:"novat"
    },
    {
        title:"Vat 15%",
        id:"vat"
    }
  ]
  const paymentMethods = [
    {
      title:"Cash",
      id:"cash"
    },
    {
        title:"Credit card",
        id:"creditCard"
    },
    {
      title:"Bank Transfer",
      id:"transfer"
    }
  ]
 console.log("Ordered Items",orderedItems)

 useEffect(() => {
  if (tableInitialData.length) {
    setOrderedItems(
      tableInitialData.map((item) => ({
        itemId: item.id,
        itemName: item.title,
        itemNumber: item.itemNumber,
        quantity: 1, 
        price: item.sellingPrice,
        availableQuantity: item.quantity,
        total: item.sellingPrice, 
      }))
    );
  } else {
    setOrderedItems([]);
  }
}, [tableInitialData]);


 async function onSubmit(data) {
  console.log("data from frontend", data);

  // Filter out items with empty or undefined values
  const filteredItems = orderedItems.filter((item) =>
    item.itemId && item.itemName && item.quantity && item.itemNumber
  );

  const updatedData = {
    ...data,
    items: filteredItems.map((item) => ({
      itemNumber: item.itemNumber,
      quantity: item.quantity,
      price: item.price,
      availableQuantity: item.availableQuantity,
      total: item.total,
      itemId: item.itemId,
      itemName: item.itemName,
    })),
  };

  console.log("Updated Data", updatedData);
  setLoading(true);

  if (isUpdate) {
    makePutRequest(
      setLoading,
      `api/salesOrders/${initialData.id}`,
      updatedData,
      "Sales",
      redirect,
      reset
    );
  } else {
    makePostRequest(
      setLoading,
      "api/salesOrders",
      updatedData,
      "Sales",
      reset
    );
  }
}

  return (
    <form onSubmit={handleSubmit(onSubmit)} 
          className='w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto my-3'>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <div className="sm:col-span-2">
            <label htmlFor="customer-autocomplete" className="block text-sm font-medium leading-6 text-gray-900 mb-2 ">
              Customer Name
            </label>
            <Autocomplete
              id='customer-autocomplete'
              freeSolo
              disableClearable
              options={customers}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  size="small"
                  className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"


                />
              )}
              onChange={(event, option) => handleCustomerSuggestion(event, option)}
            />
          </div>
          <TextInput label="Tin Number" type='text' name="tinNumber" register={register} errors={errors}  />
          <TextInput label="Reference Number" type='text' name="referenceNumber" register={register} errors={errors}  defaultValue={referenceNumbers}/>
          <SelectInput name="vat" label="VAT" register={register} options={vatOptions} /> 

          
        {/* Items Ordered Section */}
        <div className="mt-8 mb-8 relative overflow-x-auto shadow-md sm:rounded-lg sm:col-span-2">
          <h2 className='mb-6 text-lg font-semibold' >Items Ordered</h2>
          <table className='table-auto w-full border border-gray-200 rounded-lg'>
            <thead className="text-xs font-medium text-gray-700 uppercase bg-gray-50 hover:bg-gray-200 sticky top">
              <tr>
                <th scope="col" className="px-6 py-3 text-left border-b border-gray-200 w-3/4">Item Name</th>
                <th scope="col" className="px-6 py-3 text-left border-b border-gray-200 ">Item No</th>
                <th scope="col" className="px-6 py-3 text-left border-b border-gray-200 ">Quantity</th>
                <th scope="col" className="px-6 py-3 text-left border-b border-gray-200 ">Price</th>
                <th scope="col" className="px-6 py-3 text-left border-b border-gray-200 ">Available</th>
                <th scope="col" className="px-6 py-3 text-left border-b border-gray-200 ">Total</th>
              </tr>
            </thead>
            <tbody>
              {orderedItems.map((item, index) => (
                <tr key={index} className="bg-white hover:bg-gray-100 ">
                  <td className='px-4 py-4 text-left'>
                    {item.itemId ? (
                   <span className="w-full whitespace-nowrap">{item.itemName}</span>
                    ) : (
                      <Autocomplete
                        id={`item-autocomplete-${index}`}
                        freeSolo
                        disableClearable
                        options={items}
                        getOptionLabel={(option) => option.title || option.itemNumber}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size='small'
                            InputProps={{
                              ...params.InputProps,
                              type: 'search',
                            }}
                          />
                        )}
                        onChange={(event, option) => handleSuggestionSelected(event, option, index)}
                      />
                    )}
                  </td>

                  <td>
                    <Input
                      type="text"
                      name={`items[${index}].itemNumber`}
                      value={item.itemNumber}
                      register={register}
                      errors={errors}
                      className='mb-2 px-1 py-1 text-left'
                      isRequired={false}
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      name={`items[${index}].quantity`}
                      value={item.quantity}
                      register={register}
                      errors={errors}
                      className='mb-2 px-1 py-1 text-left'
                      onChange={(value) => handleQuantityChange(index, value, item.availableQuantity)}
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      name={`items[${index}].price`}
                      value={item.price}
                      register={register}
                      errors={errors}
                      className='mb-2 px-1 py-1 text-left'
                      isRequired={false}
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      name={`items[${index}].availableQuantity`}
                      value={item.availableQuantity}
                      register={register}
                      errors={errors}
                      className='mb-2 px-1 py-1 text-left'
                      isRequired={false}
                    />
                  </td>
                  <td >
                    <Input
                      type='number'
                      name={`items[${index}].total`}
                      value={item.total}
                      register={register}
                      errors={errors}
                      className='mb-2 px-1 py-1 text-left'
                      isRequired={false}
                    />
                  </td>
                  <td>
                    {item.itemId ? (
                      <button className='flex items-center mx-1' type="button" onClick={() => removeItemRow(index)}>
                        <XCircle className='w-4 h-4 text-red-500 rounded-lg bg-white hover:bg-red-500'/>
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" onClick={addNewItemRow} className='m-2 bg-slate-100 hover:bg-slate-200 text-gray-900 font-bold py-2 px-4 rounded inline-flex items-center'>
            <Plus className='mr-2 w-4 h-4 bg-blue-500 text-white rounded-lg text-sm'/>
            <span className='text-sm font-light'>Add Row</span>
            </button> 
        </div>
          <TextInput label="Paid Amount" type="number" name="paidAmount" register={register} errors={errors} className='w-full'/>
          <SelectInput name="paymentMethod" label="Select the Payment Method" register={register} className='w-full' options={paymentMethods}/> 
          </div>
         <SubmitButton isLoading={loading} title={isUpdate?"Updated Sales":"New Sales"}/>
        </form>
  )
  
}
