"use client"
import React, { useEffect, useState } from 'react'
import { getData } from '@/lib/getData';
import NewShop from '../../new/page';

export default function Update({params:{id}}) {
  const [data,setData] = useState([])
  useEffect(() => {
   async function fetchData(){
     const data = await getData(`shop/${id}`);
     setData(data)
   }
   fetchData
  },[id])
    console.log(data)
  return (
    <div>
        <NewShop initialData={data} isUpdate={true} />
    </div>
  )
}
