import { makePostRequest } from '@/lib/apiRequest';
import { getData } from '@/lib/getData';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function AddToShop({ selectedRows, resourceName, reload }) {
  const [loading, setLoading] = useState(false);
  const [selectedShop, setSelectedShop] = useState(""); 
  const [shops,setShops] = useState([])
  const router = useRouter()
  console.log("Selected Rows",selectedRows)

  useEffect(() => {
    async function fetchShops() {
        const shopsData = await getData("shop");
        setShops(shopsData);
    }
    fetchShops();
}, []);

  const handleShopChange = (event) => {
    setSelectedShop(event.target.value); // Update the selected shop when the user selects a shop from the dropdown
  };

  const handleAddToShop = async () => {
    setLoading(true);
    try {
      if (selectedRows.length === 0) {
        toast.error("No items selected to add to shop");
        return;
      }

      if (!selectedShop) {
        toast.error("Please select a shop");
        return;
      }

      const result = await Swal.fire({
        title: "Confirm",
        text: "Are you sure you want to add selected items to the shop?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, add to shop"
      });

      if (result.isConfirmed) {
        const selectedItems = [];

        for (const itemId of selectedRows) {
            const response = await fetch(`/api/items/${itemId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch item details");
            }
            const selectedItem = await response.json();
            selectedItems.push(selectedItem);
        }
        // Now you have the details of selected items, you can proceed with your logic
        console.log("Selected Items",selectedItems);
  
        const timestamp = Date.now()
        const referenceNumbers = selectedRows.map(() => `REF-${timestamp}`)
       

        for (const selectedItem of selectedItems) {
          await makePostRequest(
              setLoading, 
              'api/shopadjustments/transfer', 
              {
                itemId:selectedItem.id,
                givingWarehouseId:selectedItem.warehouseId,
                recievingShopId:selectedShop,
                transferStockQty:selectedItem.quantity,
                notes:"PLACEHOLDER",
                referenceNumber:referenceNumbers[selectedItems.indexOf(selectedItem)]

              },
              resourceName,
              );
      }
     
        toast.success(`Selected items added to shop successfully`);
        router.push("/inventory-dashboard/inventory/items")

      }
    } catch (error) {
      console.error("Error adding selected items to shop:", error);
      toast.error("An error occurred while adding selected items to shop");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <select
        value={selectedShop}
        onChange={handleShopChange}
        className="text-gray-900 hover:text-gray-900 text-sm px-5 py-1.5 border border-gray-800 text-center inline-flex items-center rounded  me-2 mb-2 sm:w-auto"
      >
        <option value="" >Select Shop</option>
        {shops.map((shop) => (
          <option key={shop.id} value={shop.id} className="z-10 bg-gray-100 divide-y divide-gray-100 rounded-lg shadow w-full sm:w-auto dark:bg-gray-700 dark:divide-gray-600">
            {shop.title}
          </option>
        ))}
      </select>
      <button
        onClick={handleAddToShop}
        disabled={!selectedShop || selectedRows.length === 0 || loading}
        className={`text-gray-900 text-xs hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg px-3 py-1 me-2 mb-2 sm:w-auto ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? "Adding..." : "Add to Shop"}
      </button>
    </div>
  );
}
