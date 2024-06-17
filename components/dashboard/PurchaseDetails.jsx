"use client"
import React, { useRef } from "react";
import { convertIsoToDate } from "@/lib/convertIstoToDate";
import { useReactToPrint } from "react-to-print";

export default function PurchaseDetails({ order }) {
  const purchaseDate = convertIsoToDate(order.createdAt);
  const deliveryDate = convertIsoToDate(order.deliveryDate);
  const updatedAt = convertIsoToDate(order.updatedAt);

  const invoiceRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
  });

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
      {/* Download Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handlePrint}
          type="button"
          className="inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Download/Print Detail
        </button>
      </div>

      {/* Invoice */}
      <div ref={invoiceRef} className="p-6">
        <div className="grid grid-cols-1 gap-4 border-b border-gray-200 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Supplier:</p>
              <p>{order?.supplier?.title}</p>
            </div>
            <div>
              <p className="font-semibold">Order Number:</p>
              <p>{order.orderNumber}</p>
            </div>
            <div>
              <p className="font-semibold">Order Date:</p>
              <p>{purchaseDate}</p>
            </div>
            <div>
              <p className="font-semibold">Delivery Date:</p>
              <p>{deliveryDate}</p>
            </div>
            <div>
              <p className="font-semibold">Receiving Location:</p>
              <p>{order.recievingLocation}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Updated At:</p>
              <p>{updatedAt}</p>
            </div>
            <div>
              <p className="font-semibold">Purchase Status:</p>
              <p>{order.purchaseStatus}</p>
            </div>
            <div>
              <p className="font-semibold">Purchased By:</p>
              <p>{order.purchaseRepresentative?.name}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <p className="font-semibold">Items Ordered</p>
          <table className="w-full text-sm text-left table-auto">
            <thead className="text-xs font-medium text-gray-700 uppercase border border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3">Item</th>
                <th className="px-6 py-3">From</th>
                <th className="px-6 py-3">Qty</th>
                <th className="px-6 py-3">Unit Cost</th>
                <th className="px-6 py-3">Line Total</th>
              </tr>
            </thead>
            <tbody>
              {order.itemsOrdered?.map((item, i) => (
                <tr key={i} className="border border-gray-200 hover:bg-gray-100">
                  <td className="px-6 py-4">{item.item.title}</td>
                  <td className="px-6 py-4">{item.origin}</td>
                  <td className="px-6 py-4">{item.quantity}</td>
                  <td className="px-6 py-4">{item.price}</td>
                  <td className="px-6 py-4">{item.totalPrice}</td>
                </tr>
              ))}
                        </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 border-t border-gray-200 pt-4">
          <div>
            <p className="font-semibold">SubTotal:</p>
            <p>{order.purchaseTotalwithoutVat}</p>
          </div>
          <div>
            <p className="font-semibold">Tax:</p>
            <p>{order.vat}</p>
          </div>
          <div>
            <p className="font-semibold">Total:</p>
            <p>{order.totalCost}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

