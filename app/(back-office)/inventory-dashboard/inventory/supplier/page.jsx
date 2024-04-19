"use client"
import DataTable from "@/components/dashboard/DataTable";
import FixedHeader from "@/components/dashboard/FixedHeader";
import { getData } from "@/lib/getData";
import { useEffect, useState } from "react";

export default function Supplier() {

  const [suppliers, setSuppliers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);


  useEffect(() => {
    async function fetchSuppliers(){
      const suppliersData = await getData("supplier")
      setSuppliers(suppliersData)
    }
    fetchSuppliers()
  },[])

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
        setSelectedRows(suppliers.map(item => item.id));
    } else {
        setSelectedRows([]);
    }
};

  const columns =["title","phone","email"]
  return (
    <div>
    {/* {Header} */}
    <FixedHeader title="Suppliers" newLink="/inventory-dashboard/inventory/supplier/new" />

    {/* {Table} */}
    <div className="my-4 p-8">
      <DataTable 
      data={suppliers} 
      columns={columns} 
      base="inventory"
      resourceTitle="supplier"
      selectAll={selectAll}
      toggleSelectAll={toggleSelectAll}
      setSelectedRows={setSelectedRows}
      showAddToShopButton={false}
      itemsPerPage={2}

      />
    </div>
   
    
</div>
  )
}
