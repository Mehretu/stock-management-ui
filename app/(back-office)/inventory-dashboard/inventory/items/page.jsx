"use client"
import DataTable from "@/components/dashboard/DataTable";
import FixedHeader from "@/components/dashboard/FixedHeader";
import TableActions from "@/components/dashboard/TableActions";
import { getData } from "@/lib/getData";
import { useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

export default function Items() {
    const [items, setItems] = useState([]);
    const [brands,setBrands] = useState([]);
    const [categories,setCategories] = useState([]);
    const [suppliers,setSuppliers] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedCategory,setSelectedCategory] = useState("")
    const [selectedShop, setSelectedShop] = useState("")
    const [selectedWarehouse, setSelectedWarehouse] = useState("")
    const [selectedStatus,setSelectedStatus] = useState("")
    const [searchQuery,setSearchQuery] = useState('')
    const tableRef = useRef(null);


    useEffect(() => {
      async function fetchData() {
        try{
          const [itemsData, brandsData, categoriesData, suppliersData] = await Promise.all([
            getData("items"),
            getData("brands"),
            getData("categories"),
            getData("supplier")
          ]);

          console.log("Items Data",itemsData)
          setItems(itemsData);

          console.log("Brands Data",brandsData)
          setBrands(brandsData);

          console.log("Categories Data",categoriesData)
          setCategories(categoriesData);

          console.log("Suppliers Data",suppliersData);
          setSuppliers(suppliersData);

        }catch(error) {
          console.error("Error fetching data:", error);
        }   
      }
      fetchData();
  }, []);




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

  const handleSearch = (query,category,shop,warehouse,status) =>{
     setSearchQuery(query)
     setSelectedCategory(category)
     setSelectedShop(shop)
     setSelectedWarehouse(warehouse)
     setSelectedStatus(status)
  }

  const processedItems = useMemo(() => {
    let filteredItems = items;

    if (selectedCategory) {
        filteredItems = filteredItems.filter(item => item.categoryId === selectedCategory);
    }
    
    if (selectedShop) {
        filteredItems = filteredItems.filter(item => item.shopId === selectedShop);
    }
    if (selectedWarehouse){
      filteredItems = filteredItems.filter(item => item.warehouseId === selectedWarehouse);
    }
    if (selectedStatus){
      filteredItems =  filteredItems.filter(item => item.itemStatus === selectedStatus);
    } 

    if (searchQuery) {
        filteredItems = filteredItems.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return filteredItems.map(item => ({
        ...item,
        brand: brands.find(brand => brand.id === item.brandId)?.title || 'Unknown',
        category: categories.find(category => category.id === item.categoryId)?.title || 'Unknown',
        supplier: suppliers.find(supplier => supplier.id === item.supplierId)?.title || 'Unknown',
    }));
}, [items, brands, categories, suppliers, searchQuery, selectedCategory, selectedShop,selectedWarehouse,selectedStatus]);


 
  const columns =["Item Name","Item No","Buying Price","Selling Price","Total Price","category","quantity","supplier","brand","status"]
  return (
    <div>
    {/* {Header} */}
    <FixedHeader 
        title="Items"  
        newLink="/inventory-dashboard/inventory/items/new"
        />
   
    <TableActions 
        onPrint={handlePrint} 
        onSearch={handleSearch} 
        searchQuery={searchQuery} 
        selectedCategory={selectedCategory} 
        selectedShop={selectedShop}
        selectedWarehouse={selectedWarehouse}
        isItem="true"
        title="Items"
        />
  
      {/* {Table} */}

    <div className="my-4 p-8">
      <DataTable 
            data={processedItems} 
            columns={columns}
            base="inventory"
            resourceTitle="items" 
            selectAll={selectAll}
            toggleSelectAll={toggleSelectAll}
            setSelectedRows={setSelectedRows}
            showAddToShopButton={true}
            showAddToSalesButton={true}
            itemsPerPage={10}
            tableRef={tableRef}
           
            
            />
    </div>
   
    
</div>
  )
}
