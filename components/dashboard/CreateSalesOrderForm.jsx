  "use client"
  import SelectInput from '@/components/FormInputs/SelectInput'
  import SubmitButton from '@/components/FormInputs/SubmitButton'
  import TextInput from '@/components/FormInputs/TextInput'
  import { makePostRequest, makePutRequest } from '@/lib/apiRequest'
  import { Plus, XCircle } from 'lucide-react'
  import { useRouter } from 'next/navigation'
  import { useEffect, useState } from 'react'
  import { useForm } from 'react-hook-form'
  import Input from '../FormInputs/Input'
  import { AutoComplete } from 'primereact/autocomplete';
  import toast from 'react-hot-toast'

  export default function CreateSalesOrderForm({customers={},items={},initialData={},tableInitialData={},isUpdate=false}) {
    const router = useRouter()
    const [orderedItems, setOrderedItems] = useState([]);
    const [customerValue, setCustomerValue] = useState(initialData?.customer?.name || null  )
    const [itemValue, setItemValue] = useState(initialData?.item?.title || null)
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [filterItems, setFilterItems] = useState([]);
    const [vatPercentage, setVatPercentage] = useState(0);


    
    const timestamp = Date.now()
    const referenceNumbers =  `SALES-${timestamp}`


    const {
      register,
      handleSubmit,
      reset,
      formState: {errors},
      setValue,
      watch
    } = useForm({
      defaultValues:{...initialData, discount: initialData?.discount || 0}
    })
    const [loading,setLoading]=useState(false)
    function redirect(){
      router.push("/inventory-dashboard/sales/salesOrders")
      router.refresh()
    }

  

    // Function to add a new row for an item
    const addNewItemRow = () => {
      setItemValue(null)
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



    const handleItemChange = (e,selectedIndex) => {
      const updatedItems = [...orderedItems];

    // Update the selected item based on the input value
      updatedItems[selectedIndex].itemName = e.value;
      setItemValue(e.value)
      const selectedItem = items.find((item) => item.title === e.value.title);
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
    const handleItemSuggestion = (event) => {
      setTimeout(() => {
        let _filteredItems;

        if(!event.query.trim().length){
          _filteredItems = [...items];
        }
        else{
          _filteredItems = items.filter((item) => {
            return item.title.toLowerCase().startsWith(event.query.toLowerCase());
          });
        }
      setFilterItems(_filteredItems);

      })
      

    };
    const handleCustomerSuggestion = (event) => {
      const query = event.query.toLowerCase();
      let _filteredCustomers = customers.filter((customer) => customer.name.toLowerCase().includes(query));
      setFilteredCustomers(_filteredCustomers);
    };

    const handleCustomerChange = (e) => {
      const customer = setCustomerValue(e.value);
      console.log("Customer", customer)
      const selectedCustomer = customers.find((customer) => customer.name === e.value.name);
      console.log("Selected Customer",selectedCustomer)
      if (selectedCustomer) {
        setValue('customerId', selectedCustomer.id);

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
  console.log("Here",initialData)

  useEffect(() => {
    if (tableInitialData?.length) {
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
    } else if (initialData && initialData.itemsOrdered?.length) {
      setOrderedItems(
        initialData.itemsOrdered?.map((itemOrdered) => ({
          itemId: itemOrdered.itemId,
          itemName: itemOrdered.item?.title,
          itemNumber: itemOrdered.item?.itemNumber,
          quantity: itemOrdered.quantity,
          price: itemOrdered.price,
          availableQuantity: itemOrdered.item?.quantity,
          total: itemOrdered.totalPrice,
        }))
      );
    } else {
      setOrderedItems([]);
    }
  }, [tableInitialData, initialData]);

  const handleVatChange = (e) => {
    console.log("Event", e)
  const selectedOption = vatOptions.find((option) => option.id === e)

  if(selectedOption){
    const vatPercentage = selectedOption.id === 'vat' ? 15 : 0 ;
    setVatPercentage(vatPercentage);
  }

  }

  const calculateTotalAmount = () => {
    const subtotal = parseFloat(orderedItems.reduce((total, item) => total + item.total, 0));
    const totalAfterDiscount = subtotal - parseFloat(watch("discount") || 0);
    const amount = totalAfterDiscount < 0 ? 0 : totalAfterDiscount;
    return amount.toFixed(2)
  };
  
  const calculateVat = (totalAmount, percentage) => {
    const vat = parseFloat((totalAmount * percentage)/100);
    return vat.toFixed(2)
  }


  useEffect(() => {
    const totalAmount = calculateTotalAmount();
    const calculatedVat = parseFloat(calculateVat(totalAmount,vatPercentage))
    const grandTotal = parseFloat(parseFloat(calculatedVat) + parseFloat(totalAmount))
    setValue('paidAmount', totalAmount)
    setValue('subTotal',totalAmount)
    setValue('vAt',calculatedVat.toFixed(2))
    setValue('grandTotal',grandTotal.toFixed(2))
  },[orderedItems, vatPercentage,watch("discount")])




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

              <div className='card flex justify-content-center'>
              <AutoComplete
              value={customerValue}
              suggestions={filteredCustomers}
              completeMethod={handleCustomerSuggestion}
              field="name"
              onChange={handleCustomerChange}
              className='custom-autocomplete'
            />
              </div>

            </div>
            <TextInput label="Tin Number" type='text' name="tinNumber" register={register} errors={errors}  />
            <TextInput label="Reference Number" type='text' name="referenceNumber" register={register} errors={errors}  defaultValue={referenceNumbers}/>
            <SelectInput name="vat" label="VAT%" register={register} options={vatOptions} onChange={handleVatChange} /> 

            
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
                          <AutoComplete
                          id={`item-autocomplete-${index}`}
                          value={item.itemName}
                          suggestions={filterItems}
                          completeMethod={handleItemSuggestion}
                          field="title"
                          onChange={(e) => handleItemChange(e,index)}
                          className='custom-autocomplete'
                        />
                      ) : (
                        <AutoComplete
                        id={`item-autocomplete-${index}`}
                        value={itemValue}
                        suggestions={filterItems}
                        completeMethod={handleItemSuggestion}
                        field="title"
                        onChange={(e) => handleItemChange(e,index)}
                        className='custom-autocomplete'
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
                      
                        <button className='flex items-center mx-1' type="button" onClick={() => removeItemRow(index)}>
                          <XCircle className='w-4 h-4 text-red-500 rounded-lg bg-white hover:bg-red-500'/>
                        </button>
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
            <TextInput label="Paid Amount" type="number" name="paidAmount" register={register} errors={errors} className='w-full' step='0.01'/>
            <TextInput label="Sub Total" type="number" name="subTotal" register={register} errors={errors} className='w-full' step='0.01'/>
            <TextInput label="VAT" type="number" name="vAt" register={register} errors={errors} className='w-full' step='0.01'/>
            <TextInput label="Discount" type='number' name='discount' register={register} errors={errors} className='w-full' step='0.01'/>
            <TextInput label="Grand Total" type='number' name='grandTotal' register={register} errors={errors} className='w-full' step='0.01'/>

            


            <SelectInput name="paymentMethod" label="Select the Payment Method" register={register} className='w-full' options={paymentMethods}/> 
            </div>
          <SubmitButton isLoading={loading} title={isUpdate?"Updated Sales":"New Sales"}/>
          </form>
    )
    
  }
