import FormHeader from '@/components/dashboard/FormHeader'
import { getData } from '@/lib/getData'
import CreatePurchaseOrderForm from './CreatePurchaseOrderForm';

export default async function NewPurchase({tableInitialData={},  initialData={},isUpdate=false}) {
  const supplierData=  getData('supplier')
  const itemsData=  getData('items')

  //Parallel Fetching
  const [suppliers,items] = await 
  Promise.all([
    supplierData,
    itemsData
    
  ]);

  return (
    <div>
        {/* {Header} */}
        <FormHeader title={isUpdate?"Update Purchases":"New Purchase"} href="/inventory-dashboard/purchases/purchaseOrders"/>
        {/* {Form} */}
        <CreatePurchaseOrderForm suppliers={suppliers} items={items} initialData={initialData} tableInitialData={tableInitialData} isUpdate={isUpdate}/>
    </div>
  )
}
