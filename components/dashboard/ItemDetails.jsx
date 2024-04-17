"use client"
import React, { useRef } from "react";
import { convertIsoToDate } from "@/lib/convertIstoToDate";
import { useReactToPrint } from "react-to-print";

export default function ItemDetails({ item }) {
  const createdAt = convertIsoToDate(item.createdAt);
  const updatedAt = convertIsoToDate(item.updatedAt);

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
              <p className="font-semibold">Item Name:</p>
              <p>{item.title}</p>
            </div>
            <div>
              <p className="font-semibold">Item Number:</p>
              <p>{item.itemNumber}</p>
            </div>
            <div>
              <p className="font-semibold">Quantity:</p>
              <p>{item.quantity}</p>
            </div>
            <div>
              <p className="font-semibold">Brand:</p>
              <p>{item.brand?.title}</p>
            </div>
            <div>
              <p className="font-semibold">UOM:</p>
              <p>{item.unit?.title}</p>
            </div>
            <div>
              <p className="font-semibold">Warehouse:</p>
              <p>{item.warehouse? (
                item.warehouse.title
              ):(
                <span className="text-red-300"> Not in Warehouse</span>
              )}</p>
            </div>
            <div>
              <p className="font-semibold">Shop:</p>
              <p>{item.shop?(
                item.shop.title
              ):(
                <span className="text-red-300"> Not in Shop</span>
              )}</p>
            </div>
            <div>
              <p className="font-semibold">Status:</p>
              <p>{item.itemStatus}</p>
            </div>
            
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
              <p className="font-semibold">Created At:</p>
              <p>{createdAt}</p>
            </div>
            <div>
              <p className="font-semibold">Updated At:</p>
              <p>{updatedAt}</p>
            </div>
            <div>
              <p className="font-semibold">Buying Price:</p>
              <p>{item.buyingPrice}</p>
            </div>
            <div>
              <p className="font-semibold">Selling Price:</p>
              <p>{item.sellingPrice}</p>
            </div>
            <div>
              <p className="font-semibold">Average Price:</p>
              {
                item.priceHistory?.length > 0 ? (
                  <p>
                    {parseFloat(
                      (item.priceHistory.reduce((acc, curr) => acc + parseFloat(curr.sellingPrice), 0) + parseFloat(item.sellingPrice)) / (item.priceHistory.length + 1)
                    ).toFixed(2)}
                  </p>
                ) : (
                  <p>{parseFloat(item.sellingPrice).toFixed(2)}</p>
                )
             }
            </div>
            <div>
              <p className="font-semibold">Tax Rate:</p>
              <p>{item.taxRate}</p>
            </div>
            <div>
              <p className="font-semibold">Unit Vat:</p>
              <p>{item.unitVat}</p>
            </div>
            <div>
              <p className="font-semibold">Total Price:</p>
              <p>{item.totalPrice}</p>
            </div>
            <div>
              <p className="font-semibold">Unit Price With Vat:</p>
              <p>{item.unitPriceWithVat}</p>
            </div>
            <div>
              <p className="font-semibold">Total Price With Vat:</p>
              <p>{item.totalPriceWithVat}</p>
            </div>
            <div>
              <p className="font-semibold">Category:</p>
              <p>{item.category?.title}</p>
            </div>
            <div>
              <p className="font-semibold">Supplier:</p>
              <p>{item.suppler? (
                item.supplier.title
              ):(
                <span> Unknown </span>
              )}</p>
            </div>
            <div>
              <p className="font-semibold">Description:</p>
              <p>{item.description? (
                item.description
              ):(
                <span> Unknown </span>
              )}</p>
            </div>
            <div>
              <p className="font-semibold">Note:</p>
              <p>{item.notes? (
                item.notes
              ):(
                <span> Unknown </span>
              )}</p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

