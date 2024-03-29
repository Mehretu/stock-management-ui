
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import CreateSalesOrderForm from './CreateSalesOrderForm';
import { getData } from '@/lib/getData';

export default function AddToSales({ selectedRows, resourceName, reload }) {
  const [loading, setLoading] = useState(false);
  const [showSalesOrderForm, setShowSalesOrderForm] = useState(false); 
  const [selectedItems, setSelectedItems] = useState([]); 
  const [items,setItems] = useState([]);
  const [customers,setCustomers] = useState([]);



  useEffect(() => {
    async function fetchData() {
      try{
        const [itemsData,customersData] = await Promise.all([
          getData("items"),
          getData("customers"),
        ]);

        console.log("Items Data",itemsData)
        setItems(itemsData);

        console.log("Customers Data",customersData)
        setCustomers(customersData);

      }catch(error) {
        console.error("Error fetching data:", error);
      }   
    }
    fetchData();
}, []);


  const handleAddToSales = async () => {
    setLoading(true);
    try {
      if (selectedRows.length === 0) {
        toast.error("No items selected to add to sales");
        return;
      }
        // Fetch selected items
        const selectedItems = await Promise.all(selectedRows.map(async itemId => {
            const response = await fetch(`/api/items/${itemId}`);
            if (!response.ok) {
              throw new Error("Failed to fetch item details");
            }
            return response.json();
          }));
    
          // Set state to show the sales order form and pass the selected items as props
          setShowSalesOrderForm(true);
          setSelectedItems(selectedItems);
          console.log("Selected Items",selectedItems)
        } catch (error) {
          console.error("Error adding selected items to sales:", error);
          toast.error("An error occurred while adding selected items to shop");
        } finally {
          setLoading(false);
        }
      };

  return (
    <div>
      {showSalesOrderForm ? (
        // Render the sales order form component with the selected items as props
        <CreateSalesOrderForm tableInitialData={selectedItems} items={items} customers={customers} />
      ) : (
        // Render the button to add to sales
        <button
          onClick={handleAddToSales}
          className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? "Adding..." : "Add to Sales"}
        </button>
      )}
    </div>
  );
}
