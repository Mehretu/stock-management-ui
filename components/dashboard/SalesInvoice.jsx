"use client"
import React, { useRef } from "react";
import logo from "../../public/ilogo.png";
import { convertIsoToDate } from "@/lib/convertIstoToDate";
import { useReactToPrint } from "react-to-print";
import Image from "next/image"; // Import for using next/image component

// This line marks the SalesInvoice component as a Client Component
export default function SalesInvoice({ order }) {
  console.log("Order", order)
  const invoiceDate = convertIsoToDate(order.createdAt);

  const invoiceRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
  });

  return (
    <div className="flex flex-col bg-gray-100">
      {/* Download Button */}
      <div className="flex items-end justify-end mb-4 mt-2">
        <button
          onClick={handlePrint}
          type="button"
          className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white transition-all duration-200 bg-blue-600 hover:bg-blue-700 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 "
        >
          Download/Print Invoice
        </button>
      </div>
      {/* Invoice */}
      <div ref={invoiceRef} className="max-w-4xl mx-auto shadow-md bg-white rounded-sm p-8">
        {/* Header */}
        <div className="flex justify-between border-b border-gray-200 pb-8">
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold">Bill From:</h2>
            <p>Nile Store</p>
            <p>Adiss Ababa</p>
            <p>Ethiopia</p>
            <p>nile@gmail.com</p>
          </div>
          <Image src={logo} alt="limifood logo" className="w-36 h-16" />
        </div>
        {/* Header End */}
        <div className="flex justify-between border-b border-gray-200 py-8">
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold">Bill To:</h2>
            <p>{order.customer?.name}</p>
            <p>{order.customer?.address}</p>
            <p>{order.customer?.phone}</p>
            <p>{order.customer?.email}</p>
          </div>
          <div className="flex flex-col ">
            <div className="flex justify-between">
              <p className="font-medium">Order #</p>
              <p>{order.referenceNumber}</p>
            </div>
            <div className="flex justify-between gap-4">
              <p className="font-medium">Invoice Date</p>
              <p>{invoiceDate}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-medium">Amount Due</p>
              <p>{order.orderTotalWithoutVAT} ETB </p>
            </div>
          </div>
        </div>

        <div className="relative overflow-x-auto ">
          {/* Invoice table */}
          <table className="w-full text-sm text-left table-auto border border-gray-200">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 font-medium border border-gray-200">
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
              {/* Loop through each item in the order and render a table row */}
              {order.itemsOrdered?.map((item, i) => (
                <tr key={i} className="bg-white border-b border-gray-200 hover:bg-gray-100">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {item.item.title}
                  </th>
                  <td className="px-6 py-4">{item.origin}</td>
                  <td className="px-6 py-4">{item.quantity}</td>
                  <td className="px-6 py-4">{item.price}</td>
                  <td className="px-6 py-4">{item.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between border-b border-gray-200 py-8">
          <div className="flex flex-col">
            <h2>NOTES</h2>
          </div>
          <div className="flex flex-col ">
            <div className="flex justify-between gap-4">
              <p className="font-medium">SubTotal</p>
              <p>{order.orderTotalWithoutVAT}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-medium">Tax</p>
              <p>{order.vat}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-medium">Total</p>
              <p>{order.orderTotal}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center pt-8">
          <Image src={logo} alt="limifood logo" className="w-36 h-16" />
        </div>
      </div>
    </div>
  );
}

