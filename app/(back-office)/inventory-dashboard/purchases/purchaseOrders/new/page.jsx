import NewPurchase from '@/components/dashboard/NewPurchase';
import React from 'react'

export default async function Page() {
    const data = {};
  return (
        <NewPurchase initialData={data} isUpdate={false}/>
  )
}
