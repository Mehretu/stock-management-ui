"use client"
import React, { useEffect, useState } from 'react'
import NewSales from '@/components/dashboard/NewSales';
import { getData } from '@/lib/getData';

export default function AddToSales() {
    const [selectedItems, setSelectedItems] = useState([]);
useEffect(() => {
  const fetchData = async () => {
      try {
          const queryParams = new URLSearchParams(window.location.search);
          const selectedIdsParam = queryParams.get('selectedItems');
          if (selectedIdsParam) {
              const ids = JSON.parse(selectedIdsParam);

              // Map over the array of item IDs and fetch data for each item
              const itemDataPromises = ids.map(async itemId => {
                  const data = await getData(`items/${itemId}`);
                  return data;
              });

              // Wait for all API requests to resolve
              const itemDataArray = await Promise.all(itemDataPromises);

              // Update the selectedItems state with the fetched item data
              setSelectedItems(itemDataArray);
          }
      } catch (error) {
          console.error('Error fetching item data:', error);
      }
  };

  fetchData();
}, []);

  
  console.log("Selected Items",selectedItems)
 
    
  return (
    <div>
        <NewSales tableInitialData={selectedItems} isUpdate={false}/>
    </div>
  )
}
