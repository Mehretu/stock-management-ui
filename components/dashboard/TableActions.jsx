"use client"
import { getData } from '@/lib/getData';
import { Download, Search } from 'lucide-react'
import {  useEffect, useState } from 'react';

export default function TableActions(
  {
    title,
    isPurchase=false,
    isSales=false,
    isItem=false,
    onPrint,
    onSearch,
    searchQuery,
    selectedCategory,
    selectedShop,
    selectedWarehouse,
    selectedStatus,
    selectedPaymentStatus,
    selectedOrderStatus,
    selectedPurchaseStatus,
    selectedDateRange,
  }) {
  const [categories,setCategories] = useState([])
  const [shops,setShops] = useState([])
  const [warehouses,setWarehouses] = useState([])
 
  useEffect(() => {
    async function fetchData() {
        const [categoriesData,shopsData,warehousesData] = await Promise.all([
          getData("categories"),
          getData("shop"),
          getData("warehouse")
        ])
        setCategories(categoriesData);
        setShops(shopsData);
        setWarehouses(warehousesData)
    }
    fetchData();
}, []);
 const dateRanges = [
    { label: 'All Time', id: 'all' },
    { label: 'Last 30 Days', id: 'last30days' },
    { label: 'Last 7 Days', id: 'last7days' },
 ]
 const statuses = [
  {
    title:"Available",
    id:"AVAILABLE"
  },
  {
    title:"UnAvailable",
    id:"NOT_AVAILABLE"
  },
  {
    title:"Low In Quantity",
    id:"LOW_IN_QUANTITY"
  },
 ]
 
 const paymentStatus =[
  {
    title:"Fully Paid",
    id:"PAID"
  },
  {
    title:"Outstanding",
    id:"OUTSTANDING"
  },
  {
    title:"Partially Paid",
    id:"PARTIAL"
  }
 ]
 const orderStatus =[
  {
    title:"Pending",
    id:"PENDING"
  },
  {
    title:"Shipped",
    id:"SHIPPED"
  },
  {
    title:"Delivered",
    id:"DELIVERED"
  }
 ]
 const purchaseStatus =[
  {
    title:"Pending",
    id:"PENDING"
  },
  {
    title:"Recieved",
    id:"RECIEVED"
  },
  
 ]

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    onSearch(searchQuery,selectedCategory,selectedShop,selectedWarehouse,selectedStatus)
  };
  const handleShopChange = (event) => {
    const selectedShop = event.target.value;
    onSearch(searchQuery,selectedCategory,selectedShop,selectedWarehouse,selectedStatus)
  }
  const handleWarehouseChange = (event) => {
    const selectedWarehouse = event.target.value;
    onSearch(searchQuery,selectedCategory,selectedShop,selectedWarehouse,selectedStatus)
  }
  const handleStatusChange = (event) => {
    const selectedStatus = event.target.value;
    onSearch(searchQuery,selectedCategory,selectedShop,selectedWarehouse,selectedStatus)
  }
  const handlePaymentStatusChange = (event) =>{
    const selectedPaymentStatus = event.target.value;
    onSearch(searchQuery,selectedPaymentStatus,selectedOrderStatus,selectedDateRange)
  }
  const handleOrderStatusChange = (event) =>{
    const selectedOrderStatus = event.target.value;
    onSearch(searchQuery,selectedPaymentStatus,selectedOrderStatus,selectedDateRange)
  }
  const handlePurchaseStatusChange = (event) =>{
    const selectedPurchaseStatus = event.target.value;
    onSearch(searchQuery,selectedPurchaseStatus,selectedDateRange)
  }
  const handleDateRangeChange = (event) => {
    const selectedDateRange = event.target.value;

    onSearch(searchQuery,selectedPurchaseStatus, selectedDateRange);
  };


 
  return (
    <div className="flex mx-8 mt-4 justify-between py-6 px-12 bg-slate-200 rounded-lg items-center gap-8">
    <button 
      onClick={()=> {onPrint();}}
     className="flex items-center gap-2 text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50  font-medium rounded-lg text-xs px-3 py-1 text-center ">
      <Download className='w-4 '/>
      <span>Export</span>
      </button>
    {/* {search} */}
    <div className=" flex-grow ">
      <label htmlFor="table-search" className="sr-only">Search</label>
      <div className="relative">
          <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none ">
             <Search className="w-4 h-4 text-gray-500 dark:text-gray-400 text-xs"/>
          </div>
          <input 
            type="text" 
            id="table-search" 
            className="block py-2 ps-10 text-xs font-medium text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full" 
            placeholder={`Search for ${title}`}
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            />
      </div>
  </div>
      <div className='flex flex-wrap items-center gap-2 '>
        <span className='text-xs font-medium text-gray-600'>Filter By:</span>
      {
        isItem? 
          (
            <select
        value={selectedCategory}
        onChange={handleCategoryChange}
        className="bg-gray-50 border border-gray-300 text-gray-600 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-24 p-2"
      >
        <option value="" >Category</option>
        {categories.map((category) => (
          <option 
                key={category.id} 
                value={category.id} 
                className="z-10 bg-gray-100 divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
                >
            {category.title}
          </option>
        ))}
      </select>
          ):null
        
      }
      {
        isItem ? (
          <select
        value={selectedShop}
        onChange={handleShopChange}
        className="bg-gray-50 border border-gray-300 text-gray-600 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-24 p-2"
      >
        <option value="" >Shop</option>
        {shops.map((shop) => (
          <option 
                key={shop.id} 
                value={shop.id} 
                className="z-10 bg-gray-100 divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
                >
            {shop.title}
          </option>
        ))}
      </select>
        ):null
      }
      {
        isItem? (
          <select
        value={selectedWarehouse}
        onChange={handleWarehouseChange}
        className="bg-gray-50 border border-gray-300 text-gray-600 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-24 p-2"
      >
        <option value="" >Store</option>
        {warehouses.map((warehouse) => (
          <option 
                key={warehouse.id} 
                value={warehouse.id} 
                className="z-10 bg-gray-100 divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
                >
            {warehouse.title}
          </option>
        ))}
      </select>
        ): null
      }
      {
        isItem ? (
          <select
        value={selectedStatus}
        onChange={handleStatusChange}
        className="bg-gray-50 border border-gray-300 text-gray-600 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-24 p-2"
      >
        <option value="" >Status</option>
        {statuses.map((status) => (
          <option 
                key={status.id} 
                value={status.id} 
                className="z-10 bg-gray-100 divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
                >
            {status.title}
          </option>
        ))}
      </select>
        ):null
      }
      {
        isSales?(
          <select
        value={selectedPaymentStatus}
        onChange={handlePaymentStatusChange}
        className="bg-gray-50 border border-gray-300 text-gray-600 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-32 p-2"
      >
        <option value="" >Payment Status</option>
        {paymentStatus.map((status) => (
          <option 
                key={status.id} 
                value={status.id} 
                className="z-10 bg-gray-100 divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
                >
            {status.title}
          </option>
        ))}
      </select>
        ):null
      }
      {
        isSales?(
          <select
        value={selectedOrderStatus}
        onChange={handleOrderStatusChange}
        className="bg-gray-50 border border-gray-300 text-gray-600 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-28 p-2"
      >
        <option value="" >Order Status</option>
        {orderStatus.map((status) => (
          <option 
                key={status.id} 
                value={status.id} 
                className="z-10 bg-gray-100 divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
                >
            {status.title}
          </option>
        ))}
      </select>
        ):null
      }
      
      {
        isPurchase?(
          <select
        value={selectedPurchaseStatus}
        onChange={handlePurchaseStatusChange}
        className="bg-gray-50 border border-gray-300 text-gray-600 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-32 p-2"
      >
        <option value="" >Purchase Status</option>
        {purchaseStatus.map((status) => (
          <option 
                key={status.id} 
                value={status.id} 
                className="z-10 bg-gray-100 divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
                >
            {status.title}
          </option>
        ))}
      </select>
        ):null
      }
            {
        isPurchase || isSales?(
          <select
        value={selectedDateRange}
        onChange={handleDateRangeChange}
        className="bg-gray-50 border border-gray-300 text-gray-600 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-32 p-2"
      >
        <option value="" >Date Range</option>
        {dateRanges.map((dateRange) => (
          <option 
                key={dateRange.id} 
                value={dateRange.id} 
                className="z-10 bg-gray-100 divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
                >
            {dateRange.label}
          </option>
        ))}
      </select>
        ):null
      }
     
     
    
      
        
      </div>

      

  </div>
  )
}
