"use client"
import DataTable from "@/components/dashboard/DataTable";
import FixedHeader from "@/components/dashboard/FixedHeader";
import { getData } from "@/lib/getData";
import { useEffect, useState } from "react";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);


    useEffect(() => {
      async function fetchItems() {
          const usersData = await getData("user");
          setUsers(usersData);
      }
      fetchItems();
  }, []);


  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
        setSelectedRows(users.map(item => item.id));
    } else {
        setSelectedRows([]);
    }
  };




  const columns =["name","email","role"]
  return (
    <div>
    {/* {Header} */}
    <FixedHeader 
        title="Users"  
        newLink="/inventory-dashboard/config/userMannagement/new"
        />
   
      {/* {Table} */}

    <div className="my-4 p-8">
      <DataTable 
            data={users} 
            columns={columns}
            base="config"
            resourceTitle="user" 
            selectAll={selectAll}
            toggleSelectAll={toggleSelectAll}
            setSelectedRows={setSelectedRows}
            itemsPerPage={10}  
            />
    </div>
   
    
</div>
  )
}
