import PurchaseDetails from "@/components/dashboard/PurchaseDetails";
import { getData } from "@/lib/getData";
import React from "react";

export default async function page({params:{id}}) {
    
    const order = await getData(`purchaseOrders/${id}`)
    console.log(order)
    
  return (
    <PurchaseDetails order={order} />

  );
}