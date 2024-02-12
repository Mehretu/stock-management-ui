import { makePostRequest } from '@/lib/apiRequest';
import { getData } from '@/lib/getData';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function AddToShop({ selectedRows, resourceName, reload }) {
  const [loading, setLoading] = useState(false);
  const [selectedShop, setSelectedShop] = useState(""); // Initialize with an empty string
  const [shops,setShops] = useState([])

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
        await makePostRequest(
          setLoading,
          `api/shop/add`,
          {
            itemIds: selectedRows, // Assuming selectedRows contains itemIds
            shopId: selectedShop // Use the selected shop
          },
          resourceName,
          reload // Assuming reload is a function to refresh data
        );
        toast.success(`Selected items added to shop successfully`);
        // reload();
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
        className="border border-gray-300 rounded px-2 py-1"
      >
        <option value="">Select Shop</option>
        {shops.map((shop) => (
          <option key={shop.id} value={shop.id}>
            {shop.title}
          </option>
        ))}
      </select>
      <button
        onClick={handleAddToShop}
        disabled={!selectedShop || selectedRows.length === 0 || loading}
        className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? "Adding..." : "Add to Shop"}
      </button>
    </div>
  );
}
