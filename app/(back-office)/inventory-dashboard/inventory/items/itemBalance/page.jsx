"use client"
import DataTable from "@/components/dashboard/DataTable";
import TableActions from "@/components/dashboard/TableActions";
import { getData } from "@/lib/getData";
import { useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

export default function ItemBalance() {
  const [itemBalance, setItemBalance] = useState([]);
  const [brands,setBrands] = useState("")
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedShop, setSelectedShop] = useState("")
  const [selectedWarehouse, setSelectedWarehouse] = useState("")
  const [searchQuery,setSearchQuery] = useState("")
  const tableRef = useRef(null);

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
        setSelectedRows(items.map(item => item.id));
    } else {
        setSelectedRows([]);
    }
  };


  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
  });

  useEffect(() => {
    async function fetchItems(){
      const itemsData = await getData("items/itemBalance")
      const brandsData = await getData("brands")
      setItemBalance(itemsData)
      setBrands(brandsData)
    }
    fetchItems()
  },[])
  const handleSearch = (query,shop,warehouse) =>{
    setSearchQuery(query)
    setSelectedShop(shop)
    setSelectedWarehouse(warehouse)
 }

 let filteredItemBalance = itemBalance;
 const processedItems = useMemo(() => {
   if (searchQuery) {
    filteredItemBalance = filteredItemBalance.filter(itemBalance => itemBalance.itemName.toLowerCase().includes(searchQuery.toLowerCase()));
   }

   return filteredItemBalance.map(itemBalance => ({
       ...itemBalance,
   }));
}, [itemBalance, searchQuery]);

 
  const columns =["itemName","itemNumber","brand","origin","quantityInStock","quantityInStore", "total"]
  return (
    <div>
         <TableActions 
        onPrint={handlePrint} 
        onSearch={handleSearch} 
        searchQuery={searchQuery} 
        title="Item Balance"
        isBalance="true"
        />

    <div className="my-4 p-8">
      <DataTable 
          data={processedItems} 
          columns={columns} 
          selectAll={selectAll}
          toggleSelectAll={toggleSelectAll}
          setSelectedRows={setSelectedRows}
          resourceTitle="itemBalance"
          showAddToShopButton={false}
          itemsPerPage={10}
          tableRef={tableRef}

          
          
          />
    </div>
   
   
    
</div>
  )
}
