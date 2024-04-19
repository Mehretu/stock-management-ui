"use client"
import DataTable from "@/components/dashboard/DataTable";
import FixedHeader from "@/components/dashboard/FixedHeader";
import TableActions from "@/components/dashboard/TableActions";
import { getData } from "@/lib/getData";
import { useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

export default function SalesOrders() {
    const [salesOrders, setSalesOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQuery,setSearchQuery] = useState('')
    const [selectedPaymentStatus,setSelectedPaymentStatus] = useState('')
    const [selectedOrderStatus,setSelectedOrderStatus] = useState('')
    const [selectedDateRange,setSelectedDateRange] = useState('all')
    const tableRef = useRef(null);


    useEffect(() => {

      async function fetchData() {
        try{
          const [salesOrdersData,customersData] = await Promise.all([
            getData("salesOrders"),
            getData("customers")

          ])
          setSalesOrders(salesOrdersData);
          setCustomers(customersData)
        }catch(error){
          console.error("Error Fetching Data",error)
        }
      }
      fetchData();
  }, []);


  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
        setSelectedRows(salesOrders.map(item => item.id));
    } else {
        setSelectedRows([]);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
  });
  const handleSearch = (query,paymentStatus,orderStatus,orderDate) =>{
    setSearchQuery(query)
    setSelectedPaymentStatus(paymentStatus)
    setSelectedOrderStatus(orderStatus)
    setSelectedDateRange(orderDate)
  }
    
    

  const processedSales = useMemo(() => {
    let filteredSalesOrders = salesOrders;

    if (searchQuery) {
      filteredSalesOrders = filteredSalesOrders.filter(salesOrder => salesOrder.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (selectedPaymentStatus){
      filteredSalesOrders = filteredSalesOrders.filter(salesOrder => salesOrder.paymentStatus === selectedPaymentStatus) 
    }
    if (selectedOrderStatus){
      filteredSalesOrders = filteredSalesOrders.filter(salesOrder => salesOrder.orderStatus === selectedOrderStatus) 
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
    
    return filteredSalesOrders.map(salesOrder => ({
        ...salesOrder,
        customer: customers.find(customer => customer.id === salesOrder.customerId)?.name || 'Unknown'
        
    }));
}, [salesOrders,customers,searchQuery,selectedPaymentStatus,selectedOrderStatus,selectedDateRange]);


  const columns =["Ref No","Date","customer","Total","Paid","Remaining","Payment Status","Order Status","Payment Method"]
  return (
    <div>
    {/* {Header} */}
    <FixedHeader title="Sales" newLink="/inventory-dashboard/sales/salesOrders/new"/>

    <TableActions 
        onPrint={handlePrint}
        onSearch={handleSearch} 
        searchQuery={searchQuery}
        selectedPaymentStatus={selectedPaymentStatus}
        selectedOrderStatus={selectedOrderStatus}
        selectedDateRange={selectedDateRange}
        isSales="true"
        title="Sales Orders"
        />
    {/* {Table} */}

    <div className="my-4 p-8">
      <DataTable 
            data={processedSales} 
            columns={columns}
            base="sales"
            resourceTitle="salesOrders" 
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
