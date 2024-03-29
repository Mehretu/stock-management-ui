import React from 'react'
import { getData } from '@/lib/getData';
import NewSales from '@/components/dashboard/NewSales';

export default async function Update({params:{id}}) {
    const data = await getData(`salesOrders/${id}`);
    console.log(data)
  return (
    <div>
        <NewSales initialData={data} isUpdate={true}/>
    </div>
  )
}
