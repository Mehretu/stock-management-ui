"use client"
import DataTable from "@/components/dashboard/DataTable";
import FixedHeader from "@/components/dashboard/FixedHeader";
import { getData } from "@/lib/getData";
import { useEffect, useState } from "react";

export default  function Categories() {
  const [categories, setCategories] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    async function fetchCategories(){
      const categoriesData = await getData("categories")
      setCategories(categoriesData)
    }
    fetchCategories()
  },[])

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
        setSelectedRows(categories.map(item => item.id));
    } else {
        setSelectedRows([]);
    }
};

  const columns =["title","description"]
  return (
    <div>
    {/* {Header} */}
    <FixedHeader title="Categories" newLink="/inventory-dashboard/inventory/categories/new" />

    {/* {Table} */}
    <div className="my-4 p-8">
      <DataTable 
            data={categories} 
            columns={columns} 
            resourceTitle="categories"
            selectAll={selectAll}
            toggleSelectAll={toggleSelectAll}
            setSelectedRows={setSelectedRows}
            showAddToShopButton={false}
            
            />
    </div>
   
    
</div>
  )
}
