"use client"
import React, { useEffect, useState } from 'react'
import { getData } from '@/lib/getData';
import NewCategory from '../../new/page';

export default async function Update({params:{id}}) {
   const [data,setData] = useState([])
   useEffect(() => {
    async function fetchData(){
      const data = await getData(`categories/${id}`);
      setData(data)
    }
    fetchData()
   },[id])
    console.log(data)
  return (
    <div>
        <NewCategory initialData={data} isUpdate={true}/>
    </div>
  )
}
