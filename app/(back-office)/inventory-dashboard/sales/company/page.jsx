"use client"
import DataTable from "@/components/dashboard/DataTable";
import FixedHeader from "@/components/dashboard/FixedHeader";
import TableActions from "@/components/dashboard/TableActions";
import { getData } from "@/lib/getData";
import { useEffect, useState } from "react";

export default function Company() {
    const [companies, setCompanies] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);

    useEffect(() => {
      async function fetchItems() {
          const companiesData = await getData("companies");
          setCompanies(companiesData);
      }
      fetchItems();
  }, []);

  // const items = await getData("items")

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
        setSelectedRows(companies.map(item => item.id));
    } else {
        setSelectedRows([]);
    }
  };




  const columns =["title","email","phone"]
  return (
    <div>
    {/* {Header} */}
    <FixedHeader 
        title="Companies"  
        newLink="/inventory-dashboard/sales/company/new"
        />
   
    <TableActions/>
  
      {/* {Table} */}

    <div className="my-4 p-8">
      <DataTable 
            data={companies} 
            columns={columns}
            base="sales"
            resourceTitle="companies" 
            selectAll={selectAll}
            toggleSelectAll={toggleSelectAll}
            setSelectedRows={setSelectedRows}
            itemsPerPage={10}  
            />
    </div>
   
    
</div>
  )
}
