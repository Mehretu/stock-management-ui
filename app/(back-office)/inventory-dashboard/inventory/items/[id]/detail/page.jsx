import ItemDetails from "@/components/dashboard/ItemDetails";
import SalesInvoice from "@/components/dashboard/SalesInvoice";
import { getData } from "@/lib/getData";
import React from "react";

export default async function page({params:{id}}) {
    
    const item = await getData(`items/${id}`)
    console.log(item)
    
  return (
    <ItemDetails item={item} />

  );
}