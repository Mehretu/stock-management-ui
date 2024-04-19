"use client"
import React, { useEffect, useState } from 'react'
import NewSales from '@/components/dashboard/NewSales';
import { getData } from '@/lib/getData';
import NewPurchase from '@/components/dashboard/NewPurchase';

export default function AddToPurchases() {
    const [selectedItems, setSelectedItems] = useState([]);
useEffect(() => {
  const fetchData = async () => {
      try {
          const queryParams = new URLSearchParams(window.location.search);
          const selectedIdsParam = queryParams.get('selectedItems');
          if (selectedIdsParam) {
              const ids = JSON.parse(selectedIdsParam);

              const itemDataPromises = ids.map(async itemId => {
                  const data = await getData(`items/${itemId}`);
                  return data;
              });

              const itemDataArray = await Promise.all(itemDataPromises);

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
        <NewPurchase tableInitialData={selectedItems} isUpdate={false}/>
    </div>
  )
}
