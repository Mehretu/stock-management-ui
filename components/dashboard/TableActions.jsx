"use client"
import { getData } from '@/lib/getData';
import { Download, Filter, Search } from 'lucide-react'
import {  useEffect, useState } from 'react';

export default function TableActions(
  {
    title,
    isPurchase=false,
    isSales=false,
    isItem=false,
    isBalance=false,
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
  const [showFilters, setShowFilters] = useState(false)

  
 
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
  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };


 
  return (
<div className="flex flex-col mx-1 mt-2 md:flex-row md:justify-between py-4 px-4 bg-slate-200 rounded-lg md:items-center gap-2">
  <div className='flex items-center justify-between w-full md:w-auto mb-0'>
    <button 
      onClick={()=> {onPrint();}}
      className="mx-1 my-0 flex items-center gap-1 text-white bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 shadow-md shadow-blue-500/50 font-small rounded-md text-xs px-2 py-1 text-center">
      <Download className='w-4'/>
      <span className='hidden md:block'>Export</span>
    </button>
    <div className="relative flex-grow md:flex-grow-0 md:ml-2">
      <label htmlFor="table-search" className="sr-only">Search</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-gray-500 text-xs"/>
        </div>
        <input 
          type="text" 
          id="table-search" 
          className="block py-2 pl-10 pr-3 text-xs font-medium text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full" 
          placeholder={`Search for ${title}`}
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
    <button
      onClick={handleToggleFilters}
      className="m-2 flex items-center gap-1 text-gray-600 hover:text-gray-900 focus:outline-none md:hidden">
      <Filter className='w-4 h-4'/>
    </button>
  </div>
  <div className={`mt-0 flex md:mt-0 md:flex md:gap-1 ${showFilters ? '' : 'hidden md:flex'} items-center flex-wrap`}>
    {
      (isBalance) ? "" : <span className='text-xs font-medium text-gray-600'>Filter By:</span>
    }
    {
      isItem && (
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="bg-gray-50 border border-gray-300 text-gray-600 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2 mx-1 my-1 ml-0 md:ml-0">
          <option value="">Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id} className="bg-gray-100 divide-y divide-gray-100 rounded-lg shadow w-full dark:bg-gray-700 dark:divide-gray-600">
              {category.title}
            </option>
          ))}
        </select>
      )
    }
    {
      isItem && (
        <select
          value={selectedShop}
          onChange={handleShopChange}
          className="bg-gray-50 border border-gray-300 text-gray-600 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2 mx-1 my-1 ml-4 md:ml-0">
          <option value="">Shop</option>
          {shops.map((shop) => (
            <option key={shop.id} value={shop.id} className="z-10 bg-gray-100 divide-y divide-gray-100 rounded-lg shadow w-full dark:bg-gray-700 dark:divide-gray-600">
              {shop.title}
            </option>
          ))}
        </select>
      )
    }
    {
      isItem && (
        <select
          value={selectedWarehouse}
          onChange={handleWarehouseChange}
          className="bg-gray-50 border border-gray-300 text-gray-600 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2 mx-1 my-1 ml-4 md:ml-0">
          <option value="">Store</option>
          {warehouses.map((warehouse) => (
            <option key={warehouse.id} value={warehouse.id} className="z-10 bg-gray-100 divide-y divide-gray-100 rounded-lg shadow w-full dark:bg-gray-700 dark:divide-gray-600">
              {warehouse.title}
            </option>
          ))}
        </select>
      )
    }
    {
      isItem && (
        <select
          value={selectedStatus}
          onChange={handleStatusChange}
          className="bg-gray-50 border border-gray-300 text-gray-600 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2 mx-1 my-1 ml-4 md:ml-0">
          <option value="">Status</option>
          {statuses.map((status) => (
            <option key={status.id} value={status.id} className="z-10 bg-gray-100 divide-y divide-gray-100 rounded-lg shadow w-full dark:bg-gray-700 dark:divide-gray-600">
              {status.title}
            </option>
          ))}
        </select>
      )
    }
    {
      isSales && (
        <select
          value={selectedPaymentStatus}
          onChange={handlePaymentStatusChange}
          className="bg-gray-50 border border-gray-300 text-gray-600 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2 mx-1 my-1 ml-4 md:ml-0">
          <option value="">Payment Status</option>
          {paymentStatus.map((status) => (
            <option key={status.id} value={status.id} className="z-10 bg-gray-100 divide-y divide-gray-100 rounded-lg shadow w-full dark:bg-gray-700 dark:divide-gray-600">
              {status.title}
            </option>
          ))}
        </select>
      )
    }
    {
      isSales && (
        <select
          value={selectedOrderStatus}
          onChange={handleOrderStatusChange}
          className="bg-gray-50 border border-gray-300 text-gray-600 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2 mx-1 my-1 ml-4 md:ml-0">
          <option value="">Order Status</option>
          {orderStatus.map((status) => (
            <option key={status.id} value={status.id} className="bg-gray-100 divide-y divide-gray-100 rounded-lg shadow w-full dark:bg-gray-700 dark:divide-gray-600">
              {status.title}
            </option>
          ))}
        </select>
      )
    }
    {
      isPurchase && (
        <select
          value={selectedPurchaseStatus}
          onChange={handlePurchaseStatusChange}
          className="bg-gray-50 border border-gray-300 text-gray-600 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2 mx-1 my-1 ml-4 md:ml-0">
          <option value="">Purchase Status</option>
          {purchaseStatus.map((status) => (
            <option key={status.id} value={status.id} className="bg-gray-100 divide-y divide-gray-100 rounded-lg shadow w-full dark:bg-gray-700 dark:divide-gray-600">
              {status.title}
            </option>
          ))}
        </select>
      )
    }
    {
      (isPurchase || isSales) && (
        <select
          value={selectedDateRange}
          onChange={handleDateRangeChange}
          className="bg-gray-50 border border-gray-300 text-gray-600 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2 mx-1 my-1 ml-4 md:ml-0">
          <option value="">Date Range</option>
          {dateRanges.map((dateRange) => (
            <option key={dateRange.id} value={dateRange.id} className="bg-gray-100 divide-y divide-gray-100 rounded-lg shadow w-full dark:bg-gray-700 dark:divide-gray-600">
              {dateRange.label}
            </option>
          ))}
        </select>
      )
    }
  </div>
</div>


  )
}
