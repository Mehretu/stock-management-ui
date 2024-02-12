"use client"
import DataTable from "@/components/dashboard/DataTable";
import FixedHeader from "@/components/dashboard/FixedHeader";
import { getData } from "@/lib/getData";
import { useEffect, useState } from "react";

export default function Shop() {

  const [shops, setShops] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    async function fetchShops(){
      const shopsData = await getData("shop")
      setShops(shopsData)
    }
    fetchShops()
  },[])

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
        setSelectedRows(shops.map(item => item.id));
    } else {
        setSelectedRows([]);
    }
};



 
  const columns =["title","location"]
  return (
    <div>
    {/* {Header} */}
    <FixedHeader title="Shops" newLink="/inventory-dashboard/inventory/shop/new" />

    {/* {Table} */}
    <div className="my-4 p-8">
      <DataTable 
          data={shops} 
          columns={columns} 
          resourceTitle="shop"
          selectAll={selectAll}
          toggleSelectAll={toggleSelectAll}
          setSelectedRows={setSelectedRows}
          showAddToShopButton={false}

          
          />
    </div>
   
    
</div>
  )
}
