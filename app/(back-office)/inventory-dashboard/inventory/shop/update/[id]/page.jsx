import React from 'react'
import { getData } from '@/lib/getData';
import NewShop from '../../new/page';

export default async function Update({params:{id}}) {
    const data = await getData(`warehouse/${id}`);
    console.log(data)
  return (
    <div>
        <NewShop initialData={data} isUpdate={true} />
    </div>
  )
}
