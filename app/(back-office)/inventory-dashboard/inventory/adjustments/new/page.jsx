import AdjustmentForm from '@/components/dashboard/AdjustmentForm'
import { getData } from '@/lib/getData'


export default async function NewAdjustments() {
  
const itemsData =  getData("items")
const warehousesData =  getData("warehouse")
const suppliersData = getData("supplier")

const [items,warehouses,suppliers] = await Promise.all([
    itemsData,
    warehousesData,
    suppliersData
  ]);

  return (
    <AdjustmentForm items={items} warehouses={warehouses} suppliers={suppliers}/>
  )
}
