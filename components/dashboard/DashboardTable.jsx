"use client"
import {  Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DeleteBtn from "./DeleteBtn";

export default function DashBoardTable({data =[],columns=[],resourceTitle,itemsPerPage}) {
   
    const [currentPage, setCurrentPage] = useState(1);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const reload = () => {
        
        window.location.reload();
    };
 
  return (
    
<div className="relative overflow-x-auto shadow-md sm:rounded-lg ">
    {
         data.length>0 ? ( 
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr> 
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
            currentItems.map((item,i)=>{
                const itemId = item.id;
                return(
                    <tr
                    key={i}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
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
    {/* {Pagination} */}
    <div className="flex flex-col items-center">
                {/* Help text */}
                <span className="text-sm text-gray-700 dark:text-gray-400 mt-2">
                    Showing <span className="font-semibold text-gray-900 dark:text-white">{indexOfFirstItem + 1}</span> to{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                        {Math.min(indexOfLastItem, data.length)}
                    </span>{" "}
                    of <span className="font-semibold text-gray-900 dark:text-white">{data.length}</span> Entries
                </span>
                <div className="inline-flex mt-2 xs:mt-0">
                    {/* Previous button */}
                    <button
                        className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-slate-600 rounded-s hover:bg-slate-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        onClick={() => handleClick(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <svg
                            className="w-3.5 h-3.5 me-2 rtl:rotate-180"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 10"
                        >
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5H1m0 0 4 4M1 5l4-4"/>
                        </svg>
                        Prev
                    </button>
                    {/* Next button */}
                    <button
                        className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-slate-600 border-0 border-s border-gray-700 rounded-e hover:bg-slate-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        onClick={() => handleClick(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                        <svg
                            className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 10"
                        >
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                        </svg>
                    </button>
                </div>
            </div>
   
</div>

  )
}
