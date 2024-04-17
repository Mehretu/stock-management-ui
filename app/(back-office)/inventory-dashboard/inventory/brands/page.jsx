"use client"
import DataTable from "@/components/dashboard/DataTable";
import FixedHeader from "@/components/dashboard/FixedHeader";
import { getData } from "@/lib/getData";
import { useEffect, useState } from "react";

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);


  useEffect(() => {
    async function fetchBrands(){
      const brandsData = await getData("brands")
      setBrands(brandsData)
    }
    fetchBrands()
  },[])

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
        setSelectedRows(brands.map(item => item.id));
    } else {
        setSelectedRows([]);
    }
};


 
  const columns =["title","Date","Updated At"]
  return (
    <div>
    {/* {Header} */}
    <FixedHeader title="Brands" newLink="/inventory-dashboard/inventory/brands/new" />

    {/* {Table} */}
    <div className="my-4 p-8">
      <DataTable 
          data={brands} 
          columns={columns} 
          resourceTitle="brands"
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
