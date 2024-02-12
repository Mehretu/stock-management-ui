"use client"
import DataTable from "@/components/dashboard/DataTable";
import FixedHeader from "@/components/dashboard/FixedHeader";
import { getData } from "@/lib/getData";
import { useEffect, useState } from "react";

export default function Units() {

  const [units, setUnits] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(()=> {
    async function fetchUnits(){
      const unitsData = await getData("units")
      setUnits(unitsData)

    }
    fetchUnits()
  },[])

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
        setSelectedRows(units.map(item => item.id));
    } else {
        setSelectedRows([]);
    }
};

 
  const columns =["title","abbreviation"]
  return (
    <div>
    {/* {Header} */}
    <FixedHeader title="Units" newLink="/inventory-dashboard/inventory/units/new" />

    {/* {Table} */}
    <div className="my-4 p-8">
      <DataTable 
      data={units} 
      columns={columns} 
      resourceTitle="units"
      selectAll={selectAll}
      toggleSelectAll={toggleSelectAll}
      setSelectedRows={setSelectedRows}
      showAddToShopButton={false}
      
      />
    </div>
   
    
</div>
  )
}
