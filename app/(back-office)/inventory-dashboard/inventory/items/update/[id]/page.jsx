"use client"
import React, { useEffect, useState } from 'react'
import { getData } from '@/lib/getData';
import NewItem from '@/components/dashboard/NewItem';

export default function Update({params:{id}}) {
  const [data,setData] = useState([])
  useEffect(() => {
   async function fetchData(){
     const data = await getData(`items/${id}`);
     setData(data)
   }
   fetchData()
  },[id])
  return (
    <div>
        <NewItem initialData={data} isUpdate={true}/>
    </div>
  )
}
