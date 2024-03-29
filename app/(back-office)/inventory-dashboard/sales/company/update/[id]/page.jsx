import { getData } from '@/lib/getData';
import NewCompany from '../../new/page';

export default async function Update({params:{id}}) {
    const data = await getData(`companies/${id}`);
    console.log(data)
  return (
    <div>
        <NewCompany initialData={data} isUpdate={true}/>
    </div>
  )
}
