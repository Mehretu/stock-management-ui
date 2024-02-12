"use client"
import DataTable from "@/components/dashboard/DataTable";
import FixedHeader from "@/components/dashboard/FixedHeader";
import { getData } from "@/lib/getData";
import { useEffect, useState } from "react";

export default function Items() {
    const [items, setItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);

    useEffect(() => {
      async function fetchItems() {
          const itemsData = await getData("items");
          setItems(itemsData);
      }
      fetchItems();
  }, []);

  // const items = await getData("items")

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
        setSelectedRows(items.map(item => item.id));
    } else {
        setSelectedRows([]);
    }
};



 
  const columns =["title","buyingPrice","sellingPrice","category.title","quantity","supplier.title","warehouse.title","brand.title"]
  return (
    <div>
    {/* {Header} */}
    <FixedHeader title="Items" newLink="/inventory-dashboard/inventory/items/new" />

    {/* {Table} */}

    <div className="my-4 p-8">
      <DataTable 
            data={items} 
            columns={columns} 
            resourceTitle="items" 
            selectAll={selectAll}
            toggleSelectAll={toggleSelectAll}
            setSelectedRows={setSelectedRows}
            showAddToShopButton={true}
           
            
            />
    </div>
   
    
</div>
  )
}
