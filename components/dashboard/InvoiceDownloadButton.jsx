"use client"
export default function InvoiceDownloadButton() {
    function handlePrint(){
        console.log("printed")
    }
  return (
    <div className="flex items-end justify-end mb-4 mt-2">
        <button onClick={handlePrint}
          type="button"
          className="inline-flex items-center justify-center px-4 py-3 text-xs font-bold text-white transition-all duration-200 bg-gray-700 hover:bg-gray-900 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 "
        >
          Download Invoice
        </button>
      </div>
  )
}
