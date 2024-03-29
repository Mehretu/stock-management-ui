import ShopAdjustmentForm from '@/components/dashboard/ShopAdjustmentForm'
import { getData } from '@/lib/getData'


export default async function NewShopAdjustments() {
  
const itemsData =  getData("items")
const warehousesData =  getData("warehouse")
const shopsData = getData("shop")
const suppliersData = getData("supplier")

const [items,warehouses,shops,suppliers] = await Promise.all([
    itemsData,
    warehousesData,
    shopsData,
    suppliersData
  ]);

  return (
    <ShopAdjustmentForm items={items} warehouses={warehouses} shops={shops} suppliers={suppliers}/>
  )
}
