import FormHeader from '@/components/dashboard/FormHeader'
import { getData } from '@/lib/getData'
import CreateSalesOrderForm from './CreateSalesOrderForm'

export default async function NewSales({initialData={},isUpdate=false,tableInitialData={}}) {
  const customersData=  getData('customers')
  const companiesData = getData('companies')
  const itemsData=  getData('items')

  //Parallel Fetching
  const [customers,companies,items] = await 
  Promise.all([
    customersData,
    companiesData,
    itemsData
    
  ]);

  return (
    <div>
        {/* {Header} */}
        <FormHeader title={isUpdate?"Update Sales":"New Sales"} href="/inventory-dashboard/sales/salesOrders"/>
        {/* {Form} */}
        <CreateSalesOrderForm tableInitialData={tableInitialData} customers={customers} companies={companies} items={items} initialData={initialData} isUpdate={isUpdate}/>
    </div>
  )
}
