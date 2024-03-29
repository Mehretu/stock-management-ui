import React from 'react'
import { getData } from '@/lib/getData';
import AddMoreItem from '@/components/dashboard/AddMoreItem';

export default async function page({params:{id}}) {
    const data = await getData(`items/${id}`);
    console.log(data)
  return (
    <div>
        <AddMoreItem initialData={data}/>
    </div>
  )
}
