import NewSales from '@/components/dashboard/NewSales';
import React from 'react'

export default async function Page() {
    const data = {};

  return (
        <NewSales initialData={data} isUpdate={false}/>
  )
}
