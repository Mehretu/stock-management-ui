"use client"
import DataTable from "@/components/dashboard/DataTable";
import FixedHeader from "@/components/dashboard/FixedHeader";
import { getData } from "@/lib/getData";
import { useEffect, useState } from "react";

export default function Adjustments() {

  const [addStockAdjustment, setAddStockAdjustment] = useState([]);
  const [transferStockAdjustment, setTransferStockAdjustment] = useState([]);
  const [selectAllAdd, setSelectAllAdd] = useState(false);
  const [selectAllTransfer, setSelectAllTransfer] = useState(false);
  const [selectedRowsAdd, setSelectedRowsAdd] = useState([]);
  const [selectedRowsTransfer, setSelectedRowsTransfer] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const [addStockAdjustmentData, transferStockAdjustmentData] = await Promise.all([
        getData("adjustments/add"),
        getData("adjustments/transfer")
      ]);
      setAddStockAdjustment(addStockAdjustmentData);
      setTransferStockAdjustment(transferStockAdjustmentData);
    }
    fetchData();
  }, []);

  const toggleSelectAllAdd = () => {
    setSelectAllAdd(!selectAllAdd);
    if (!selectAllAdd) {
      setSelectedRowsAdd(addStockAdjustment.map(item => item.id));
    } else {
      setSelectedRowsAdd([]);
    }
  };

  const toggleSelectAllTransfer = () => {
    setSelectAllTransfer(!selectAllTransfer);
    if (!selectAllTransfer) {
      setSelectedRowsTransfer(transferStockAdjustment.map(item => item.id));
    } else {
      setSelectedRowsTransfer([]);
    }
  };
  
  
 
 
  const addColumns =["referenceNumber","addStockQty","createdAt","updatedAt"]
  const transferColumns =["referenceNumber","transferStockQty",""]

  

  return (
    <div>
    {/* {Header} */}
    <FixedHeader title="Adjustments" newLink="/inventory-dashboard/inventory/adjustments/new" />

    {/* {Table} */}
    <div className="my-4 p-8">
      <h2 className="py-4 font-semibold">Stock Increment Adjustment</h2>
      <DataTable 
          data={addStockAdjustment} 
          columns={addColumns} 
          base="inventory"
          resourceTitle="adjustments/add"
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
          data={transferStockAdjustment} 
          columns={transferColumns} 
          resourceTitle="adjustments/transfer"
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
