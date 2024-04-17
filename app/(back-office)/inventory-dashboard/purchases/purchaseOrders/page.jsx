"use client"
import DataTable from "@/components/dashboard/DataTable";
import FixedHeader from "@/components/dashboard/FixedHeader";
import TableActions from "@/components/dashboard/TableActions";
import { getData } from "@/lib/getData";
import { useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

export default function PurchaseOrders() {
    const [purchaseOrders, setPurchseOrders] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQuery,setSearchQuery] = useState('');
    const [selectedPurchaseStatus,setSelectedPurchaseStatus] = useState('');
    const [selectedDateRange,setSelectedDateRange] = useState("all")
    const tableRef = useRef(null);


    useEffect(() => {

      async function fetchData() {
        try{
          const [purchaseOrderData,supplierData] = await Promise.all([
            getData("purchaseOrders"),
            getData("supplier")

          ])
          setPurchseOrders(purchaseOrderData);
          setSuppliers(supplierData)
        }catch(error){
          console.error("Error Fetching Data",error)
        }
      }
      fetchData();
  }, []);


  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
        setSelectedRows(purchaseOrders.map(item => item.id));
    } else {
        setSelectedRows([]);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
  });

  const handleSearch = (query,purchaseStatus,orderDate) => {
     setSearchQuery(query)
     setSelectedPurchaseStatus(purchaseStatus)
     setSelectedDateRange(selectedDateRange)
  }

  const processedPurchases = useMemo(() => {
    let filterPurchaseOrders = purchaseOrders;
    if(searchQuery){
      filterPurchaseOrders = filterPurchaseOrders.filter(purchaseOrder => purchaseOrder.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if(selectedPurchaseStatus){
      filterPurchaseOrders = filterPurchaseOrders.filter(purchaseOrder => purchaseOrder.purchaseStatus === selectedPurchaseStatus)
    }

    if (selectedDateRange === 'last30days') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      filteredSalesOrders = filteredSalesOrders.filter(salesOrder => 
          new Date(salesOrder.orderDate) >= thirtyDaysAgo
      );
  } else if (selectedDateRange === 'last7days') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      filteredSalesOrders = filteredSalesOrders.filter(salesOrder => 
          new Date(salesOrder.orderDate) >= sevenDaysAgo
      );
  }
    
    return filterPurchaseOrders.map(purchaseOrder => ({
        ...purchaseOrder,
        supplier: suppliers.find(supplier => supplier.id === purchaseOrder.supplierId)?.title || 'Unknown'
        
    }));
}, [purchaseOrders,suppliers,searchQuery,selectedPurchaseStatus,selectedDateRange]);


  const columns =["Order No","order date","supplier","delivery date","Cost","status","By"]
  return (
    <div>
    {/* {Header} */}
    <FixedHeader title="Purchases" newLink="/inventory-dashboard/purchases/purchaseOrders/new"/>

    <TableActions 
       onPrint={handlePrint} 
       onSearch={handleSearch} 
       searchQuery={searchQuery} 
       isPurchase="true" 
       selectedPurchaseStatus={selectedPurchaseStatus}
       selectedDateRange={selectedDateRange}
       title="Purchase Orders"
       />
    {/* {Table} */}

    <div className="my-4 p-8">
      <DataTable 
            data={processedPurchases} 
            columns={columns}
            base="purchases"
            resourceTitle="purchaseOrders" 
            selectAll={selectAll}
            toggleSelectAll={toggleSelectAll}
            setSelectedRows={setSelectedRows}
            itemsPerPage={10}
            tableRef={tableRef}
           
            
            />
    </div>
   
    
</div>
  )
}
