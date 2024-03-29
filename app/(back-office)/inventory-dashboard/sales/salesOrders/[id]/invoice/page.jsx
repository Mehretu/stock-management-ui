import SalesInvoice from "@/components/dashboard/SalesInvoice";
import { getData } from "@/lib/getData";
import React from "react";

export default async function page({params:{id}}) {
    
    const order = await getData(`salesOrders/${id}`)
    console.log(order)
    
  return (
    <SalesInvoice order={order} />

  );
}