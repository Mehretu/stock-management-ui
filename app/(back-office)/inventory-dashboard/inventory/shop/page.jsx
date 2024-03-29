"use client"
import CurrentStock from "@/components/dashboard/CurrentStock";
import DataTable from "@/components/dashboard/DataTable";
import FixedHeader from "@/components/dashboard/FixedHeader";
import WarehouseAccordion from "@/components/dashboard/WarehouseAccordion";
import { getData } from "@/lib/getData";
import { useEffect, useState } from "react";

export default function Shop() {

  const [shops, setShops] = useState([]);
  const [brands,setBrands] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    async function fetchData(){
     try{
      const shopsData = await getData("shop");
      console.log("Shops Data",shopsData)
      setShops(shopsData);
    
    
      const brandsData = await getData("brands");
      console.log("Brands Data",brandsData)
      setBrands(brandsData);
     }catch (error){
      console.error("Error fetching data",error)
     }
    }
    fetchData();

  },[])

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
        setSelectedRows(shops.map(item => item.id));
    } else {
        setSelectedRows([]);
    }
};



 
  const columns =["title","location","Stock Qty"]
  return (
    <div>
    {/* {Header} */}
    <FixedHeader title="Shops" newLink="/inventory-dashboard/inventory/shop/new" />

    {/* {Table} */}
    <div className="my-4 p-8">
      <DataTable 
          data={shops} 
          columns={columns} 
          base="inventory"
          resourceTitle="shop"
          selectAll={selectAll}
          toggleSelectAll={toggleSelectAll}
          setSelectedRows={setSelectedRows}
          showAddToShopButton={false}
          itemsPerPage={2}


          
          />

       
    </div>
    <div className="my-2 p-8">
      <h2 className="font-semibold text-xl">Items In Shop</h2>
    {
          shops.map((shop,i) => {
            return <WarehouseAccordion  key={i} title={`Items | ${shop.title}`} items={shop.items} brands={brands}/>
          })
        }
    </div>
   
    
</div>
  )
}
