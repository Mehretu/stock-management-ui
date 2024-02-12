"use client"
import {  Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DeleteBtn from "./DeleteBtn";
import { useEffect, useState } from "react";
import DeleteSelected from "./DeleteSelected";
import AddToShop from "./AddToShop";

export default function DataTable({data =[],columns=[],resourceTitle,selectAll=[],toggleSelectAll,setSelectedRows,showAddToShopButton}) {
    // const {selectAll,setSelectAll}=useState(false);
    // const {selectedRows,setSelectedRows}=useState([])

    const [selectedRows, setSelectedRowsLocal] = useState([]);

    const reload = () => {
        console.log("Data deleted. Refreshing...");
        
        window.location.reload();
    };


    useEffect(() => {
        setSelectedRows(selectedRows);
    }, [selectedRows]);

    const toggleRowSelection = itemId => {
        if (selectedRows.includes(itemId)) {
            setSelectedRowsLocal(selectedRows.filter(id => id !== itemId));
        } else {
            setSelectedRowsLocal([...selectedRows, itemId]);
        }
    };
    useEffect(() => {
        if (selectAll) {
            setSelectedRowsLocal(data.map(item => item.id));
        } else {
            setSelectedRowsLocal([]);
        }
    }, [selectAll, data]);

  


    
    
  
    
  return (
    
<div className="relative overflow-x-auto shadow-md sm:rounded-lg ">
    
    
{
                // Conditionally render buttons if any items are selected
                selectedRows.length > 0 && (
                    <div className="flex justify-end p-4 gap-2">
                        {/* Example of a button */}
                        {/* <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                            Delete Selected
                        </button> */}
                    <DeleteSelected selectedRows={selectedRows} resourceName={resourceTitle} reload={reload}/>

                        {showAddToShopButton && (
                        <AddToShop selectedRows={selectedRows} resourceName={resourceTitle} reload={reload} />
                    )}
                    </div>
                )
            }
    {
        data.length>0 ? ( 
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th className="w-4 p-4">
                <div className="flex items-center">
                            <input 
                            id="checkbox-all" 
                            type="checkbox" 
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            checked={selectAll}
                            onChange={toggleSelectAll}
                            />

                            <label htmlFor="checkbox-all" className="sr-only">checkbox</label>
                </div>
                    
                </th>   
                {
                    columns.map((columnName,i)=>{
                        return(
                            
                            <th key={i} scope="col" className="px-6 py-3">
                            
                            {columnName}
                            </th>   
                        )
                    })
                }
                
                <th scope="col" className="px-6 py-3">
                    Actions
                </th>  
            </tr>
        </thead>
        <tbody>
           {
            data.map((item,i)=>{
                const itemId = item.id;
                const isSelected = selectedRows.includes(itemId);
                return(
                    <tr
                    key={i}
                    className={`${isSelected ? 'bg-blue-100' : 'bg-white'} border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600`}
                >
                        {/* {
                            columns.map((columnName,i) =>{
                                return(
                                    <td key={i} className="px-6 py-4">
                                            {item[columnName]}
                                    </td>
                                );
                            })
                        } */}
                    <td className="w-4 p-4">
                    <div className="flex items-center">
                        <input id={`checkbox-table-${itemId } `}
                        type="checkbox" 
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        checked={isSelected}
                        onChange={() => toggleRowSelection(itemId)}
                        />
                        <label htmlFor={`checkbox-table-${itemId}`} className="sr-only">checkbox</label>
                    </div>
                    </td>
                        {
                            columns.map((columnName,i)=>(
                                <td key={i} className="px-6 py-4 ">
                                    {columnName.includes(".")?(
                                        columnName.split(".").reduce((obj,key) => obj[key],item)
                                    ): columnName === "imageUrl" ?(
                                        <Image
                                        src={item[columnName]}
                                        alt={`Image for ${resourceTitle}`}
                                        className="w-10 h-10 object-cover rounded-full"
                                    />
                                    ): columnName ==="createdAt" || columnName ==="updatedAt" ?(
                                        new Date(item[columnName]).toLocaleDateString()
                                    ): (
                                        item[columnName]
                                    )
                                    }
                                </td>
                               
                            ))
                        }
        
                    <td className="px-6 py-4 text-right flex items-center space-x-4">
                  {
                    (resourceTitle.includes("adjustments"))?
                "": ( 
                <Link href={`/inventory-dashboard/inventory/${resourceTitle}/update/${item.id}`} className="font-medium text-blue-600 dark:text-blue-500  flex items-center space-x-1">
                <Pencil className="w-4 h-4"/>
                <span>Edit</span>
                </Link>
               )}
                        <DeleteBtn id={item.id} endpoint={resourceTitle}/>
                    </td>
                </tr>
                )
            })
           }
           
        </tbody>
    </table>):(
        <p className="p-4 text-xl bg-white text-center">There is No Data to Display</p>
    )
    }
   
</div>

  )
}
