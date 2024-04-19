"use client"
import DataTable from "@/components/dashboard/DataTable";
import FixedHeader from "@/components/dashboard/FixedHeader";
import { getData } from "@/lib/getData";
import { useEffect, useState } from "react";

export default function ShopAdjustments() {

  const [addStocktoShop, setAddStocktoShop] = useState([]);
  const [transferStocktoShop, setTransferStocktoShop] = useState([]);
  const [selectAllAdd, setSelectAllAdd] = useState(false);
  const [selectAllTransfer, setSelectAllTransfer] = useState(false);
  const [selectedRowsAdd, setSelectedRowsAdd] = useState([]);
  const [selectedRowsTransfer, setSelectedRowsTransfer] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const [addStocktoShopData, transferStocktoShopData] = await Promise.all([
        getData("shopadjustments/add"),
        getData("shopadjustments/transfer")
      ]);
      setAddStocktoShop(addStocktoShopData);
      setTransferStocktoShop(transferStocktoShopData);
    }
    fetchData();
  }, []);

  const toggleSelectAllAdd = () => {
    setSelectAllAdd(!selectAllAdd);
    if (!selectAllAdd) {
      setSelectedRowsAdd(addStocktoShop.map(item => item.id));
    } else {
      setSelectedRowsAdd([]);
    }
  };

  const toggleSelectAllTransfer = () => {
    setSelectAllTransfer(!selectAllTransfer);
    if (!selectAllTransfer) {
      setSelectedRowsTransfer(transferStocktoShop.map(item => item.id));
    } else {
      setSelectedRowsTransfer([]);
    }
  };
  
  
 
 
  const addColumns =["referenceNumber","addStockQty","createdAt","updatedAt"]
  const transferColumns =["referenceNumber","transferStockQty"]

  

  return (
    <div>
    {/* {Header} */}
    <FixedHeader title="Shop Adjustments" newLink="/inventory-dashboard/inventory/shopAdjustments/new" />

    {/* {Table} */}
    <div className="my-4 p-8">
      <h2 className="py-4 font-semibold">Stock Increment Adjustment</h2>
      <DataTable 
          data={addStocktoShop} 
          columns={addColumns}
          base="inventory"
          resourceTitle="shopadjustments/add"
          selectAll={selectAllAdd}
          toggleSelectAll={toggleSelectAllAdd}
          setSelectedRows={setSelectedRowsAdd}
          showAddToShopButton={false}
          itemsPerPage={2}


          />
    </div>
    <div className="my-4 p-8">
    <h2 className="py-4 font-semibold">Stock Transfer Adjustment</h2>
      <DataTable 
          data={transferStocktoShop} 
          columns={transferColumns} 
          resourceTitle="shopadjustments/transfer"
          selectAll={selectAllTransfer}
          toggleSelectAll={toggleSelectAllTransfer}
          setSelectedRows={setSelectedRowsTransfer}
          showAddToShopButton={false}
          itemsPerPage={2}

          
          />
    </div>
   
    
</div>
  )
}
