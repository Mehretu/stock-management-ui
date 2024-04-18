"use client"
import SalesInvoice from "@/components/dashboard/SalesInvoice";
import { getData } from "@/lib/getData";
import React, { useEffect, useState } from "react";

export default function page({params:{id}}) {
    
  const [order,setOrder] = useState([])
  useEffect(() => {
   async function fetchData(){
     const data = await getData(`salesOrders/${id}`);
     setOrder(data)
   }
   fetchData
  },[id])    
  console.log(order)
    
  return (
    <SalesInvoice order={order} />

  );
}