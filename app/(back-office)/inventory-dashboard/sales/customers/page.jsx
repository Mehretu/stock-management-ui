"use client"
import DataTable from "@/components/dashboard/DataTable";
import FixedHeader from "@/components/dashboard/FixedHeader";
import TableActions from "@/components/dashboard/TableActions";
import { getData } from "@/lib/getData";
import { useEffect, useState } from "react";

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);


    useEffect(() => {
      async function fetchItems() {
          const customersData = await getData("customers");
          setCustomers(customersData);
      }
      fetchItems();
  }, []);


  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
        setSelectedRows(customers.map(item => item.id));
    } else {
        setSelectedRows([]);
    }
  };




  const columns =["name","email","phone"]
  return (
    <div>
    {/* {Header} */}
    <FixedHeader 
        title="Customers"  
        newLink="/inventory-dashboard/sales/customers/new"
        />
   
      {/* {Table} */}

    <div className="my-4 p-8">
      <DataTable 
            data={customers} 
            columns={columns}
            base="sales"
            resourceTitle="customers" 
            selectAll={selectAll}
            toggleSelectAll={toggleSelectAll}
            setSelectedRows={setSelectedRows}
            showAddToShopButton={true}
            itemsPerPage={10}  
            />
    </div>
   
    
</div>
  )
}
