"use client"
import DataTable from "@/components/dashboard/DataTable";
import FixedHeader from "@/components/dashboard/FixedHeader";
import { getData } from "@/lib/getData";
import { useEffect, useState } from "react";

export default  function Warehouse() {

  const [warehouses, setWarehouses] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    async function fetchWarehouses(){
      const warehousesData = await getData("warehouse")
      setWarehouses(warehousesData)
    }
    fetchWarehouses()
  },[])

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
        setSelectedRows(warehouses.map(item => item.id));
    } else {
        setSelectedRows([]);
    }
};



 
  const columns =["title","location","warehouseType"]
  return (
    <div>
    {/* {Header} */}
    <FixedHeader title="Warehouses" newLink="/inventory-dashboard/inventory/warehouse/new" />

    {/* {Table} */}
    <div className="my-4 p-8">
      <DataTable 
          data={warehouses} 
          columns={columns} 
          resourceTitle="warehouse"
          selectAll={selectAll}
          toggleSelectAll={toggleSelectAll}
          setSelectedRows={setSelectedRows}
          showAddToShopButton={false}

          
          />
    </div>
   
    
</div>
  )
}
