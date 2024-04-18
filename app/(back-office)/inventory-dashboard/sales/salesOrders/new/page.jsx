""
import NewSales from '@/components/dashboard/NewSales';

export default async function Page() {
    const data = {};
    console.log("check format",data)

  return (
        <NewSales initialData={data} isUpdate={false}/>
  )
}
