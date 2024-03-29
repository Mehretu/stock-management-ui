"use client"
import Image from "next/image";
import React, { useRef } from "react";
import logo from "../../public/ilogo.png";
import { convertIsoToDate } from "@/lib/convertIstoToDate";
import { useReactToPrint } from "react-to-print";
export default function SalesInvoice({order}) {
  const invoiceDate = convertIsoToDate(order.createdAt)
  
  console.log(invoiceDate)

  const invoiceRef = useRef()

//   function handlePrint(){
//     console.log("printed")
// }
  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
  })

  return (
    <div className="flex flex-col">
      {/* Download Button */}
        <div className="flex items-end justify-end mb-4 mt-2">
        <button onClick={handlePrint}
          type="button"
          className="inline-flex items-center justify-center px-4 py-3 text-xs font-bold text-white transition-all duration-200 bg-gray-700 hover:bg-gray-900 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 "
        >
          Download/Print Invoice
        </button>
      </div>
      {/* Invoice */}
    <div ref={invoiceRef}>
    <div className="max-w-4xl mx-auto border border-gray-500 p-8 rounded-sm ">
      {/* Header */}
      <div className="flex justify-between border-b border-gray-500 pb-8">
        <div className="flex flex-col">
          <h2>Bill From:</h2>
          <p>Nile Store</p>
          <p>Adiss Ababa</p>
          <p>Ethiopia</p>
          <p>nile@gmail.com</p>
        </div>
        <Image src={logo} alt="limifood logo" className="w-36 h-16" />
      </div>
      {/* Header End */}
      <div className="flex justify-between border-b border-gray-500 py-8">
        <div className="flex flex-col">
          <h2>Bill To:</h2>
          <p>{order.customer.name}</p>
          <p>{order.customer.address}</p>
          <p>{order.customer.phone}</p>
          <p>{order.customer.email}</p>
        </div>
        <div className="flex flex-col ">
          <div className="flex justify-between">
            <p>Order #</p>
            <p>{order.referenceNumber}</p>
          </div>
          <div className="flex justify-between gap-4">
            <p>Invoice Date</p>
            <p>{invoiceDate}</p>
          </div>
          <div className="flex justify-between">
            <p>Amount Due</p>
            <p>{order.orderTotalWithoutVAT} ETB </p>
          </div>
        </div>
      </div>

      <div className="relative overflow-x-auto ">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Item
              </th>
              <th scope="col" className="px-6 py-3">
                From
              </th>
              <th scope="col" className="px-6 py-3">
                Qty
              </th>
              <th scope="col" className="px-6 py-3">
                Unit Cost
              </th>
              <th scope="col" className="px-6 py-3">
                Line Total
              </th>
            </tr>
          </thead>
          <tbody>
            {
              order.itemsOrdered.map((item,i)=>{
                return(
              <tr key={i} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
               {item.item.title}
              </th>
              <td className="px-6 py-4">{item.origin}</td>
              <td className="px-6 py-4">{item.quantity}</td>
              <td className="px-6 py-4">{item.price}</td>
              <td className="px-6 py-4">{item.totalPrice}</td>
            </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>

      <div className="flex justify-between border-b border-gray-500 py-8">
        <div className="flex flex-col">
          <h2>NOTES</h2>
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between gap-4">
            <p>SubTotal</p>
            <p>{order.orderTotalWithoutVAT}</p>
          </div>
          <div className="flex justify-between">
            <p>Tax</p>
            <p>{order.vat}</p>
          </div>
          <div className="flex justify-between">
            <p>Total</p>
            <p>{order.orderTotal}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center pt-8">
        <Image src={logo} alt="limifood logo" className="w-36 h-16" />
      </div>
    </div>
    </div>
    </div>
  
  );
}