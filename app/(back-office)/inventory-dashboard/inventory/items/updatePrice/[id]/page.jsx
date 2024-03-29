import React from 'react'
import { getData } from '@/lib/getData';
import UpdatePrice from '@/components/dashboard/UpdatePrice';

export default async function page({params:{id}}) {
    const data = await getData(`items/${id}`);
    console.log(data)
  return (
    <div>
        <UpdatePrice initialData={data}/>
    </div>
  )
}
