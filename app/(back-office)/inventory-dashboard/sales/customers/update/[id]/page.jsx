import { getData } from '@/lib/getData';
import NewCustomer from '../../new/page';

export default async function Update({params:{id}}) {
    const data = await getData(`customers/${id}`);
    console.log(data)
  return (
    <div>
        <NewCustomer initialData={data} isUpdate={true}/>
    </div>
  )
}
