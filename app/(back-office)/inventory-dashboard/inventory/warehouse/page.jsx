"use client"
import CurrentStock from "@/components/dashboard/CurrentStock";
import DataTable from "@/components/dashboard/DataTable";
import FixedHeader from "@/components/dashboard/FixedHeader";
import WarehouseAccordion from "@/components/dashboard/WarehouseAccordion";
import { getData } from "@/lib/getData";
import { useEffect, useState } from "react";

export default  function Warehouse() {

  const [warehouses, setWarehouses] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    async function fetchData(){
     try{
      const warehousesData = await getData("warehouse");
      console.log("Warehouse Data",warehousesData)
      setWarehouses(warehousesData);

      const brandsData = await getData("brands");
      console.log("Brands Data",brandsData);
      setBrands(brandsData);
     }catch(error){
      console.error("Error fetching data",error)
     }
    }
    fetchData();
  },[])

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
        setSelectedRows(warehouses.map(item => item.id));
    } else {
        setSelectedRows([]);
    }
};



 
  const columns =["title","location","Warehouse Type","Stock Qty"]
  return (
    <div>
    {/* {Header} */}
    <FixedHeader title="Stores" newLink="/inventory-dashboard/inventory/warehouse/new" />

    {/* {Table} */}
    <div className="my-4 p-8">
      <DataTable 
          data={warehouses} 
          columns={columns} 
          base="inventory"
          resourceTitle="warehouse"
          selectAll={selectAll}
          toggleSelectAll={toggleSelectAll}
          setSelectedRows={setSelectedRows}
          showAddToShopButton={false}
          itemsPerPage={10}

          
          />
       
    </div>
    <div className="my-4 p-8">
      <h2 className="font-semibold text-xl">Items In Store</h2>
     {
          warehouses.map((warehouse,i) => {
            return <WarehouseAccordion key={i} title={`Items | ${warehouse.title}`} items={warehouse.items} brands={brands}/>
            // <CurrentStock  key={i} title={`Items | ${warehouse.title}`} items={warehouse.items}/>
          })
        }
    </div>

   
    
</div>
  )
}
