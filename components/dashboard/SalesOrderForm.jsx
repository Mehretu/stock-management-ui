
// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import Autosuggest from 'react-autosuggest';
// import { useRouter } from 'next/navigation';

// const CreateSalesOrderForm = ({
//   customers,
//   companies,
//   items,
//   initialData = {},
//   isUpdate = false,
// }) => {
//   const router = useRouter();
//   const [orderedItems, setOrderedItems] = useState([]);
//   const timestamp = Date.now();
//   const referenceNumbers = `SALES-${timestamp}`;

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm({
//     defaultValues: initialData,
//   });
//   const [loading, setLoading] = useState(false);

//   function redirect() {
//     router.push('/inventory-dashboard/sales/salesOrders');
//     router.refresh();
//   }

//   // Function to add a new row for an item
//   const addNewItemRow = () => {
//     const newItemRow = {
//       itemName: '',
//       itemNumber: '',
//       quantity: '',
//       price: '',
//       total: '',
//       availableQuantity: '',
//     };
//     setOrderedItems([...orderedItems, newItemRow]);
//   };

//   const removeItemRow = (index) => {
//     const updatedItems = [...orderedItems];
//     updatedItems.splice(index, 1);
//     setOrderedItems(updatedItems);
//   };

//   // Item selection logic with autosuggest
//   const [suggestions, setSuggestions] = useState([]);
//   const handleSuggestionSelected = (event, { suggestion }) => {
//     const selectedItem = items.find((item) => item.title === suggestion);
//     if (selectedItem) {
//       setOrderedItems((prevItems) => {
//         const updatedItems = [...prevItems];
//         updatedItems[updatedItems.length - 1] = {
//           ...updatedItems[updatedItems.length - 1],
//           itemName: selectedItem.title,
//           itemNumber: selectedItem.itemNumber,
//           availableQuantity: selectedItem.quantity,
//           price: selectedItem.sellingPrice,
//           total: selectedItem.sellingPrice * updatedItems[updatedItems.length - 1].quantity, // Update total on selection
//         };
//         return updatedItems;
//       });
//     }
//   };

//   const handleSuggestionsFetchRequested = ({ value }) => {
//     const filteredSuggestions = items.filter((item) =>
//       item.title.toLowerCase().includes(value.toLowerCase())
//     );
//     setSuggestions(filteredSuggestions);
//   };

//   const handleSuggestionsClearRequested = () => {
//     setSuggestions([]);
//   };

//   const getSuggestionValue = (suggestion) => suggestion;

//   const renderSuggestion = (suggestion) => (
//     <div className="suggestion">
//       {suggestion}
//     </div>
//   );

//   const handleQuantityChange = (index, value) => {
//     const updatedItems = [...orderedItems];
//     updatedItems[index].quantity = value;
//     updatedItems[index].total = value * updatedItems[index].price;
//     setOrderedItems(updatedItems);
//   };

//   const vatOptions = [
//     {
//       title: 'No Vat',
//       id: 'novat',
//     },
//     {
//       title: 'Vat 15%',
//       id: 'vat',
//     },
//   ];
//   const paymentMethods = [
//     {
//       title: 'Credit card',
//       id: 'creditCard',
//     },
//     {
//       title: 'Cash',
//       id: 'cash',
//     },
//     {
//       title: 'Bank Transfer',
//       id: 'transfer',
//     },
//   ];

//   async function onSubmit(data) {
//     console.log(data);
//     setLoading(true);
//     if (isUpdate) {
//       makePutRequest(
//         setLoading,
//         `api/salesOrders/${initialData.id}`,
//         data,
//         'Sales',
//         redirect,
//         reset
//       );
//     } else {
//       makePostRequest(setLoading, 'api/salesOrders', data, 'Sales', reset);
//     }
//   }

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className="w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto my-3">
//       <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
//         <SelectInput label="Select Customer" name="customerId" register={register} options={customers} className="w-full" />
//         <SelectInput name="companyId" label="Select Company" register={register} className="w-full" options={companies} />
//         <TextInput label="Tin Number" type="text" name="tinNumber" register={register} errors={errors} className="w-full" />
//         <TextInput label="Reference Number" type="text" name="referenceNumber" register={register} errors={errors} className="w-full" defaultValue={referenceNumbers} />
//         <SelectInput name="vat" label="VAT" register={register} options={vatOptions} className="w-full" />

//         {/* Items Ordered Section */}
//         <div className="mt-8 mb-8 relative overflow-x-auto shadow-md sm:rounded-lg sm:col-span-2">
//           <h2 className="mb-6 text-lg font-semibold">Items Ordered</h2>
//           <table>
//             <thead className="text-xs text-gray-700 uppercase bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
//               <tr>
//                 <th scope="col" className="px-6 py-3">Item Name</th>
//                 <th scope="col" className="px-6 py-3">Item Number</th>
//                 <th scope="col" className="px-6 py-3">Quantity</th>
//                 <th scope="col" className="px-6 py-3">Price</th>
//                 <th scope="col" className="px-6 py-3">Available Quantity</th>
//                 <th scope="col" className="px-6 py-3">Total</th>
//                 <th scope="col" className="px-6 py-3"></th>
//               </tr>
//             </thead>
//             <tbody>
//               {orderedItems.map((item, index) => (
//                 <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
//                   <td>
//                     <Autosuggest
//                       suggestions={suggestions}
//                       onSuggestionSelected={handleSuggestionSelected}
//                       onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
//                       onSuggestionsClearRequested={handleSuggestionsClearRequested}
//                       getSuggestionValue={getSuggestionValue}
//                       renderSuggestion={renderSuggestion}
//                       inputProps={{ placeholder: "Type or click to select an item", name: `items[${index}].itemName`, ...register(`items[${index}].itemName`) }}
//                     />
//                   </td>
//                   <td>
//                     <Input type="text" name={`items[${index}].itemNumber`} value={item.itemNumber} {...register(`items[${index}].itemNumber`)} errors={errors} />
//                   </td>
//                   <td>
//                     <Input type="number" name={`items[${index}].quantity`} value={item.quantity} onChange={(value) => handleQuantityChange(index, value)} {...register(`items[${index}].quantity`)} errors={errors} />
//                   </td>
//                   <td>
//                     <Input type="number" name={`items[${index}].price`} value={item.price} {...register(`items[${index}].price`)} errors={errors} />
//                   </td>
//                   <td>
//                     <Input type="number" name={`items[${index}].availableQuantity`} value={item.availableQuantity} {...register(`items[${index}].availableQuantity`)} errors={errors} />
//                   </td>
//                   <td>
//                     <Input type="number" name={`items[${index}].total`} value={item.total} {...register(`items[${index}].total`)} errors={errors} />
//                   </td>
//                   <td>
//                     {index > 0 && (
//                       <button type="button" onClick={() => removeItemRow(index)} className="flex items-center mx-1">
//                         <X className="w-4 h-4 text-white rounded-lg bg-red-400 hover:bg-red-500" />
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <button type="button" onClick={addNewItemRow} className="bg-blue-500 hover:bg-blue-700 w-4 h-4 rounded text-white mt-2 ml-2">
//             <Plus className="w-4 h-4" />
//           </button> {/* Add Item button */}
//         </div>
//         <TextInput label="Paid Amount" type="number" name="paidAmount" register={register} errors={errors} className="w-full" />
//         <SelectInput name="paymentMethod" label="Select the Payment Method" register={register} className="w-full" options={paymentMethods} />
//       </div>
//       <SubmitButton isLoading={loading} title={isUpdate ? "Updated Sales" : "New Sales"} />
//     </form>
//   );
// };

// export default CreateSalesOrderForm;

