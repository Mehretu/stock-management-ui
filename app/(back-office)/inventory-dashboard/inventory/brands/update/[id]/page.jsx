"use client"
import  { useEffect, useState } from 'react'
import NewBrand from '../../new/page'
import { getData } from '@/lib/getData';

export default function Update({params:{id}}) {
   const [data ,setData] = useState([])

   useEffect(() => {
    async function fetchData(){
      const data = await getData(`brands/${id}`);
      setData(data)
    }
      fetchData()
   },[id])
    console.log(data)
  return (
    <div>
        <NewBrand initialData={data} isUpdate={true}/>
    </div>
  )
}
