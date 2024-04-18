"use client"
import PurchaseDetails from "@/components/dashboard/PurchaseDetails";
import { getData } from "@/lib/getData";
import { useEffect, useState } from "react";

export default function page({params:{id}}) {

  const [order,setOrder] = useState([])

  useEffect(() =>{
    async function fetchData(){
      const orderData = await getData(`purchaseOrders/${id}`)
      setOrder(orderData)
    }
    fetchData()
  },[])
    
    
  
  return (
    <PurchaseDetails order={order} />

  );
}