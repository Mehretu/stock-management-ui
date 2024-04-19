import NewPurchase from '@/components/dashboard/NewPurchase';

export default async function Page() {
    const data = {};
  return (
        <NewPurchase initialData={data} isUpdate={false}/>
  )
}
