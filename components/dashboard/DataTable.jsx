"use client"
import {  ChevronDown, Pencil, PencilLine, Plus, Printer, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DeleteBtn from "./DeleteBtn";
import { useEffect, useRef, useState } from "react";
import DeleteSelected from "./DeleteSelected";
import AddToShop from "./AddToShop";
import { makePutRequest } from "@/lib/apiRequest";
import { useRouter } from "next/navigation";
import { convertIsoToDate } from "@/lib/convertIstoToDate";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { useSession } from "next-auth/react";
export default function DataTable({data =[],columns=[],base,resourceTitle,selectAll=[],toggleSelectAll,setSelectedRows,showAddToSalesButton,showAddToShopButton,itemsPerPage,tableRef=null}) {

    const [showAddQuantityForm, setShowAddQuantityForm] = useState(false);
    const [showChangePaidForm,setShowChangePaidForm] = useState(false);
    const [showChangePriceForm, setShowChangePriceForm] = useState(false);
    const [showAddItemForm,setShowAddItemForm] = useState(false)
    const [quantityToAdd, setQuantityToAdd] = useState(0);
    const [paidAmount,setPaidAmount] = useState(0);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [selectedRows, setSelectedRowsLocal] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const formRef = useRef(null);
    const router = useRouter()
    const [isLoading,setLoading] = useState()
    const {data:session,status}=useSession()

    const handleAddQuantity = (itemId) => {
        setSelectedItemId(itemId);
        setShowAddQuantityForm(true);
    };
    const handleChangePrice = (itemId) => {
        setSelectedItemId(itemId);
        setShowChangePriceForm(true);
    }
    const handleAddmore = (itemId) => {
        setSelectedItemId(itemId);
        setShowAddItemForm(true);
    }
    const handlePaidChange = (itemId) => {
        setSelectedItemId(itemId);
        setShowChangePaidForm(true);
    }
    const handleUpdateOrderStatus = (itemId,newStatus) => {
        setSelectedItemId(itemId);
        setLoading(true);
        makePutRequest(
            setLoading,
            `api/salesOrders/updateOrderStatus/${itemId}`,
            {status:newStatus},
            "Order Status",
            () =>{
                window.location.reload();

            }
        )
        setLoading(false);
    }
    const handleUpdatePurchaseStatus = (itemId,newStatus) => {
        setSelectedItemId(itemId);
        setLoading(true);
        makePutRequest(
            setLoading,
            `api/purchaseOrders/updatePurchaseStatus/${itemId}`,
            {status:newStatus},
            "Purchase Status",
            () => {
                window.location.reload();
            }
        )
        setLoading(false);
    }
    function redirect(){
        router.push("/inventory-dashboard/inventory/items")
      }
      console.log(selectedItemId)

    const handleConfirmAddQuantity = () => {
        setLoading(true)
        makePutRequest(
            setLoading,
            `api/items/addMoreQty/${selectedItemId}`,
            {quantityToAdd},
            "Quantity",
            () => {
                // After successful update, reload the page
                window.location.reload();
            }
            );
        setQuantityToAdd(0);
        setLoading(false)
        setShowAddQuantityForm(false);
       
    };
    const handleConfirmPaidAmount = () => {
        setLoading(true)
        makePutRequest(
            setLoading,
            `api/salesOrders/changePaidAmount/${selectedItemId}`,
            {paidAmount},
            "Paid Amount",
            () => {
                window.location.reload();
            }
        );
        setPaidAmount(0);
        setLoading(false);
        setShowChangePaidForm(false);
    };

    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const reload = () => {
        
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

  
    useEffect(() => {
        function handleClickOutside(event) {
            if (formRef.current && !formRef.current.contains(event.target)) {
                setShowAddQuantityForm(false);
                setShowChangePriceForm(false);
                setShowAddItemForm(false);
                setShowChangePaidForm(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
 
  return (
    
<div className="relative overflow-x-auto shadow-md sm:rounded-lg  ">
<div className="mb-1 mt-2 p-2">
</div>   
                    
                {
                // Conditionally render buttons if any items are selected
                selectedRows.length > 0 && (
                    
                    <div className="flex justify-between p-4">
                        <div className="flex gap-2">
                        <Link 
                        href={`/inventory-dashboard/sales/salesOrders/addToSales?selectedItems=${JSON.stringify(selectedRows)}`} 
                        >
                        <button 
                        type="button" 
                        className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800">
                            <div className="flex items-center gap-1">
                            <span>
                                <Plus className="h-3 w-3"/>
                            </span>
                            <span>
                                Add To Sales
                            </span>
                            </div>
                            </button>

                        </Link>
                        <Link 
                        href={`/inventory-dashboard/purchases/purchaseOrders/addToPurchases?selectedItems=${JSON.stringify(selectedRows)}`} 
                        >
                        <button 
                        type="button" 
                        className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800">
                            <div className="flex items-center gap-1">
                            <span>
                                <Plus className="h-3 w-3"/>
                            </span>
                            <span>
                                Add To Purchases
                            </span>
                            </div>
                            </button>

                        </Link>

                        </div>
                        <div className="flex gap-2">
                        <DeleteSelected selectedRows={selectedRows} resourceName={resourceTitle} reload={reload}/>

                        {showAddToShopButton && (
                        <AddToShop selectedRows={selectedRows} resourceName={resourceTitle} reload={reload} />
                        )}
                        </div>
                    
                     
                    </div>

                )
            }
    {
         data.length>0 ? ( 
        <table ref={tableRef} className="w-full text-xs text-left rtl:text-right">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
                <th className="w-3 p-3">
                {
                 (resourceTitle.includes("itemBalance"))?
                 "":
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
                }
                    
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
   
               {
                (resourceTitle.includes("itemBalance"))?
                "":
                <th  scope="col" className="px-6 py-3 actions-column">
                Actions
                </th> 
               } 
            </tr>
        </thead>
        <tbody>
           {
            currentItems.map((item,i)=>{
                const itemId = item.id;
                const isSelected = selectedRows.includes(itemId);
                return(
                    <tr
                    key={i}
                    className={`${isSelected ? 'bg-blue-100' : 'bg-white'} border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600`}
                >
                    <td className="w-4 p-4">
                    {
                        (resourceTitle.includes("itemBalance"))?
                        "":
                        <div className="flex items-center">
                        <input id={`checkbox-table-${itemId } `}
                        type="checkbox" 
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        checked={isSelected}
                        onChange={() => toggleRowSelection(itemId)}
                        />
                        <label htmlFor={`checkbox-table-${itemId}`} className="sr-only">checkbox</label>
                    </div>
                    }
                    </td>
                        {
                            columns.map((columnName,i)=>(
                                <td key={i} className="px-6 py-4 ">
                                    {columnName ==="Item No" ?(
                                        item.itemNumber
                                    ):
                                    columnName ==="Item Name" ?(
                                        <div className="relative">
                                        <div className="flex items-center">
                                            {item.title}
                                            <button type="button" onClick={() => handleAddmore(item.id)} className="absolute flex right-0 bg-slate-400 text-white rounded hover:bg-blue-600">
                                            <ChevronDown className="w-4 h-4"/>
                                            </button>

                                        </div>
                                        {showAddItemForm && selectedItemId === itemId && (
                                            <div ref={formRef} className="absolute top-full left-0 z-10 duration-300 text-gray-500 bg-blue-50 p-2 border border-gray-200 shadow-sm space-y-2 rounded-lg w-60">
                                                <div className="p-2">
                                                    <div className="flex">
                                                       <ul className="text-sm">
                                                        <li className="items-center mb-2">
                                                            <span className="flex me-2 font-semibold text-gray-500">
                                                            <Link href={`/inventory-dashboard/${base}/${resourceTitle}/addMoreItem/${item.id}`} className="font-medium text-blue-600 dark:text-blue-500  flex items-center space-x-1">
                                                            <Pencil className="w-4 h-4"/>
                                                            <p>Add More Item</p>
                                                            </Link>       
                                                            </span>
                                                        </li>
                                                       </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>                                       
                                    ):
                                    columnName ==="Buying Price" ?(
                                        item.buyingPrice
                                    ):
                                    columnName ==="Total Price" ?(
                                        item.totalPrice
                                    ):
                                    columnName ==="Ref No" ?(
                                        item.referenceNumber
                                    ):
                                    columnName ==="Order No" ?(
                                        item.orderNumber
                                    ):
                                    columnName ==="Total" ?(
                                        item.orderTotal
                                    ):
                                    columnName ==="Cost" ?(
                                        item.totalCost
                                    ):
                                    columnName ==="Remaining" ?(
                                        item.remainingAmount
                                    ):
                                    columnName ==="Payment Method" ?(
                                        item.paymentMethod
                                    ):
                                    columnName === "Stock Qty"?(
                                        item.stockQty
                                    ):
                                    columnName === "Warehouse Type"?(
                                        item.warehouseType
                                    ):
                                    columnName.includes(".")?(
                                        columnName.split(".").reduce((obj,key) => obj[key],item)
                                    ): 
                                    columnName === "imageUrl" ?(
                                        <Image
                                        src={item[columnName]}
                                        alt={`Image for ${resourceTitle}`}
                                        className="w-10 h-10 object-cover rounded-full"
                                    />
                                    ): columnName ==="Date" ?(
                                        convertIsoToDate(item.createdAt)
                                        
                                    ): columnName ==="Updated At" ?(
                                        convertIsoToDate(item.updatedAt)

                                    ): columnName ==="order date" ?(
                                        convertIsoToDate(item.orderDate)
                                        
                                    ): columnName ==="delivery date" ?(
                                        convertIsoToDate(item.deliveryDate)
                                        
                                    ): columnName ==="By" ?(
                                        item.purchaseRepresentative && <span>{item.purchaseRepresentative.name}</span>
                                        
                                    ):columnName ==="status" && item.itemStatus === "AVAILABLE" ?(
                                        <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                                        <span className="w-2 h-2 me-1 bg-green-500 rounded-full"></span>
                                            Available
                                        </span>
                                    ): columnName ==="status" && item.itemStatus === "NOT_AVAILABLE"  ?(
                                        <span className="inline-flex items-center bg-green-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                                        <span className="w-2 h-2 me-1 bg-red-500 rounded-full"></span>
                                            Unavailable
                                        </span>
                                    ):
                                    columnName ==="status" && item.purchaseStatus ==="PENDING" ?(
                                        <span className="inline-flex items-center bg-green-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                                        <span className="w-2 h-2 me-1 bg-orange-500 rounded-full"></span>
                                            Pending
                                            <div>
                                            <DropdownMenu>
                                            <DropdownMenuTrigger>
                                            <div 
                                                className="relative inline-flex items-center p-3 text-sm font-medium text-center text-white bg-transparent rounded-lg hover:bg-slate-200 focus:ring-4 focus:outline-none">
                                                <ChevronDown className='text-slate-900 w-4 h-4'/>                         
                                                </div>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                            <DropdownMenuItem className="hover:bg-blue-300">
                                                <button onClick={()=> handleUpdatePurchaseStatus(item.id,"Recieved")}>Recieved</button>
                                            </DropdownMenuItem>

                                            </DropdownMenuContent>
                                            </DropdownMenu>
                                            </div>
                                        </span>
                                    ):
                                    columnName ==="status" && item.purchaseStatus ==="RECIEVED" ?(
                                        <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                                        <span className="w-2 h-2 me-1 bg-green-500 rounded-full"></span>
                                            Recieved
                                        </span>
                                    ):
                                    columnName ==="status" && item.itemStatus ==="LOW_IN_QUANTITY" ?(
                                        <span className="inline-flex items-center bg-green-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                                        <span className="w-2 h-2 me-1 bg-orange-500 rounded-full"></span>
                                            Low
                                        </span>
                                    ):columnName ==="Payment Status" && item.paymentStatus === "PAID" ?(
                                        <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                                        <span className="w-2 h-2 me-1 bg-green-500 rounded-full"></span>
                                            Fully Paid
                                        </span>
                                    ):columnName ==="Payment Status" && item.paymentStatus === "PARTIAL" ?(
                                        <span className="inline-flex items-center bg-green-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                                        <span className="w-2 h-2 me-1 bg-yellow-500 rounded-full">
                                            
                                        </span>
                                            Partially Paid
                                        </span>
                                    ):columnName ==="Payment Status" && item.paymentStatus === "OUTSTANDING" ?(
                                        <span className="inline-flex items-center bg-green-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                                        <span className="w-2 h-2 me-1 bg-red-500 rounded-full"></span>
                                            Not Paid
                                        </span>
                                    ):columnName ==="Order Status" && item.orderStatus === "PENDING" ?(
                                        <span className="inline-flex items-center bg-green-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                                        <span className="w-2 h-2 me-1 bg-red-500 rounded-full"></span>
                                            Pending
                                            <div>
                                            <DropdownMenu>
                                            <DropdownMenuTrigger>
                                            <div 
                                                className="relative inline-flex items-center p-3 text-sm font-medium text-center text-white bg-transparent rounded-lg hover:bg-slate-200 focus:ring-4 focus:outline-none">
                                                <ChevronDown className='text-slate-900 w-4 h-4'/>                         
                                                </div>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                            <DropdownMenuItem className="hover:bg-blue-300">
                                                <button onClick={()=> handleUpdateOrderStatus(item.id,"Shipped")}>Shipped</button>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="hover:bg-blue-300">
                                                <button onClick={()=> handleUpdateOrderStatus(item.id,"Delivered")}>Delivered</button>
                                            </DropdownMenuItem>

                                            </DropdownMenuContent>
                                            </DropdownMenu>
                                            </div>
                                        </span>                  
                                    )
                                    :columnName ==="Order Status" && item.orderStatus === "SHIPPED" ?(
                                        <span className="inline-flex items-center bg-green-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                                        <span className="w-2 h-2 me-1 bg-yellow-500 rounded-full"></span>
                                            Shipped
                                            <div>
                                            <DropdownMenu>
                                            <DropdownMenuTrigger>
                                            <div 
                                                className="relative inline-flex items-center p-3 text-sm font-medium text-center text-white bg-transparent rounded-lg hover:bg-slate-200 focus:ring-4 focus:outline-none">
                                                <ChevronDown className='text-slate-900 w-4 h-4'/>                  
                                               </div>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                            <DropdownMenuItem className="hover:bg-blue-300">
                                                <button onClick={()=> handleUpdateOrderStatus(item.id,"Pending")}>Pending</button>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="hover:bg-blue-300">
                                                <button onClick={()=> handleUpdateOrderStatus(item.id,"Delivered")}>Delivered</button>
                                            </DropdownMenuItem>

                                            </DropdownMenuContent>
                                            </DropdownMenu>
                                            </div>
                                        </span>
                                    ):columnName ==="Order Status" && item.orderStatus === "DELIVERED" ?(
                                        <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                                        <span className="w-2 h-2 me-1 bg-green-500 rounded-full"></span>
                                            Delivered
                                            <div>
                                            <DropdownMenu>
                                            <DropdownMenuTrigger>
                                            <div 
                                                className="relative inline-flex items-center p-3 text-sm font-medium text-center text-white bg-transparent rounded-lg hover:bg-slate-200 focus:ring-4 focus:outline-none">
                                                <ChevronDown className='text-slate-900 w-4 h-4'/>   
                                                </div>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                            <DropdownMenuItem className="hover:bg-blue-300">
                                                <button onClick={()=> handleUpdateOrderStatus(item.id,"Pending")}>Pending</button>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="hover:bg-blue-300">
                                                <button onClick={()=> handleUpdateOrderStatus(item.id,"Shipped")}>Shipped</button>
                                            </DropdownMenuItem>
                                            </DropdownMenuContent>
                                            </DropdownMenu>
                                            </div>
                                        </span>
                                    ):columnName === 'Paid' ? (
                                        <div className="relative">
                                            <div className="flex items-center gap-4">
                                                {item.paidAmount}
                                                <button type="button" onClick={() => handlePaidChange(item.id)} className="absolute ml-8  bg-white text-slate-400 rounded hover:bg-blue-600 ">
                                                    <PencilLine className="h-4 w-4"/>
                                                </button>
                                            </div>
                                            {showChangePaidForm && selectedItemId === itemId && (
                                                <div ref={formRef} className="absolute top-full left-0 z-10 duration-300 text-gray-500 bg-blue-50 p-4 border border-gray-200 shadow-sm space-y-2 rounded-lg w-80">
                                                    <div className="p-3">
                                                        <div className="flex">
                                                           
                                                        <ul>
                                                        <li>
                                                        <div className="text-xs space-y-2">
                                                         <span className="flex me-2 font-semibold text-gray-500 gap-2">
                                                            <p>Recieved:</p>
                                                            {
                                                                item.paymentHistory?.length > 0 ? (
                                                                    <ul>
                                                                      {item.paymentHistory.map((historyItem, index) => (
                                                                        <li key={index} > 
                                                                        {parseFloat(historyItem.paidAmount).toFixed(2)}
                                                                        {historyItem.recievedBy && <span> -    By {historyItem.recievedBy}</span>}

                                                                        </li>
                                                                        
                                                                      ))}
                                                                    </ul>

                                                                ):(
                                                                    <p>{item.paidAmount}</p>
                                                                )
                                                            }
                                                         </span>


                                                        <span className="flex me-2 font-semibold text-gray-500 gap-2">
                                                                    Update Paid Amount
                                                                </span>
                                                                <span className="flex me-2 font-semibold text-gray-500 gap-2">
                                                                <input type="number" name="paidAmount" value={paidAmount} onChange={(e) => setPaidAmount(parseInt(e.target.value))} className="w-30 px-2 py-1 border border-gray-300 rounded-md" />

                                                                </span>
                                                                <span className="flex me-2 font-semibold text-gray-500 gap-2">
                                                                    <button type="button"onClick={handleConfirmPaidAmount} className={`ml-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isLoading}>
                                                                    {isLoading ? 'Updating...' : 'Update'}
                                                                    </button>
                                                                </span>

                                                        </div>
                                                        </li>
                                                        </ul>
                                                            
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ):
                                    columnName === 'quantity' ? (
                                        <div className="relative">
                                            <div className="flex items-center gap-2">
                                            {item[columnName]}
                                                <button type="button" onClick={() => handleAddQuantity(item.id)} className="absolute ml-8  bg-slate-400 text-white rounded hover:bg-blue-600 ">
                                                    <Plus className="h-4 w-4"/>
                                                </button>
                                            </div>
                                            {showAddQuantityForm && selectedItemId === itemId && (
                                                <div ref={formRef} className="absolute top-full left-0 z-10 duration-300 text-gray-500 bg-blue-50 p-4 border border-gray-200 shadow-sm space-y-2 rounded-lg w-80">
                                                    <div className="p-3">
                                                        <div className="flex">
                                                           <div className="items-center mb-2 space-y-2">
                                                           <span className="flex me-2 font-semibold text-gray-500 gap-2">
                                                                Add More Quantity
                                                            </span>
                                                            <span className="flex me-2 font-semibold text-gray-500 gap-2">
                                                            <input type="number" name="quantity" value={quantityToAdd} onChange={(e) => setQuantityToAdd(parseInt(e.target.value))} className="w-30 px-2 py-1 border border-gray-300 rounded-md" />

                                                            </span>
                                                            <span className="flex me-2 font-semibold text-gray-500 gap-2">
                                                                <button type="button"onClick={handleConfirmAddQuantity} className={`ml-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isLoading}>
                                                                {isLoading ? 'Adding...' : 'Add'}
                                                                </button>
                                                            </span>
                                                           </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ):
                                    columnName === 'Selling Price' ? (
                                        <div className="relative">
                                            <div className="flex items-center gap-2">
                                                {item.sellingPrice}
                                                <button type="button" onClick={() => handleChangePrice(item.id)} className="absolute ml-8 bg-slate-400 text-white rounded hover:bg-blue-600">
                                                <ChevronDown className="w-4 h-4"/>
                                                </button>
                                            </div>
                                            {showChangePriceForm && selectedItemId === itemId && (
                                                <div ref={formRef} className="absolute top-full left-0 z-10 duration-300 text-gray-500 bg-blue-50 p-4 border border-gray-200 shadow-sm space-y-2 rounded-lg w-80">
                                                    <div className="p-3">
                                                        <div className="flex">
                                                           <ul className="text-sm">
                                                            <li className="items-center mb-2">
                                                                <span className="flex me-2 font-semibold text-gray-500 gap-2">
                                                                    <p>Unit Price:</p>
                                                                    <p>{parseFloat(item.sellingPrice).toFixed(2)}</p>               
                                                                </span>
                                                                <span className="flex me-2 font-semibold text-gray-500 gap-2">
                                                                    <p>Unit Vat:</p>
                                                                    <p>{parseFloat(item.unitVat).toFixed(2)}</p>
                                                                    
                                                                </span>
                                                                <span className="flex me-2 font-semibold text-gray-500 gap-2">
                                                                    <p>Unit Price With Vat:</p>
                                                                    <p>{parseFloat(item.unitPriceWithVat).toFixed(2)}</p>
                                                                    
                                                                </span>
                                                                <span className="flex me-2 font-semibold text-gray-500 gap-2">
                                                                    <p>Total Price With Vat:</p>
                                                                    <p>{parseFloat(item.totalPriceWithVat).toFixed(2)}</p>
                                                                    
                                                                </span>
                                                                <span className="flex me-2 font-semibold text-gray-500 gap-2">
                                                                    <p>Average Price:</p>
                                                                    {
                                                                         item.priceHistory?.length > 0 ? (
                                                                            <p>
                                                                              {parseFloat(
                                                                                (item.priceHistory.reduce((acc, curr) => acc + parseFloat(curr.sellingPrice), 0) + parseFloat(item.sellingPrice)) / (item.priceHistory.length + 1)
                                                                              ).toFixed(2)}
                                                                            </p>
                                                                          ) : (
                                                                            <p>{parseFloat(item.sellingPrice).toFixed(2)}</p>
                                                                          )
                                                                    }
                                                                </span>
                                                                <span className="flex me-2 font-semibold text-gray-500 gap-2">
                                                                    <p>Date:</p>
                                                                    <p>{convertIsoToDate(item.updatedAt)}</p>
                                                                    
                                                                </span>
                                                                <span className="flex me-2 font-semibold text-gray-500 gap-2">
                                                                <Link href={`/inventory-dashboard/${base}/${resourceTitle}/updatePrice/${item.id}`} className="font-medium text-blue-600 dark:text-blue-500  flex items-center space-x-1">
                                                                <Pencil className="w-4 h-4"/>
                                                                <p>Set New Price</p>
                                                                </Link>   
                                                                </span>
                                                            </li>
                                                           </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ):
                                    (
                                        item[columnName]
                                    )
                                    }
                                    
                                </td>
                               
                            ))
                        }
                                {/* Add condition to render status column */}
                    
                    <td className="px-6 py-4 text-xs text-right flex items-center space-x-4">
                  {
                    (resourceTitle.includes("adjustments") || resourceTitle.includes("itemBalance"))?
                "":( 
                <Link href={`/inventory-dashboard/${base}/${resourceTitle}/update/${item.id}`} className="font-medium text-blue-600 dark:text-blue-500  flex items-center space-x-1">
                <Pencil className="w-4 h-4"/>
               
                </Link>
                
               )
               }
               {
                 (resourceTitle.includes("salesOrders"))? 
                 <Link href={`/inventory-dashboard/${base}/${resourceTitle}/${item.id}/invoice`} className="font-medium text-blue-600 flex items-center space-x-1">
                     <Printer className="w-4 h-4"/>
                 </Link>: " "
               }
               { (resourceTitle.includes("items") || resourceTitle.includes("purchaseOrders") )?
               <Link href={`/inventory-dashboard/${base}/${resourceTitle}/${item.id}/detail`} className="font-medium text-blue-600 flex items-center space-x-1">
               <Search className="w-4 h-4"/>
                 </Link>: " "
                  
                 
               }
               {
                (resourceTitle.includes("itemBalance"))?
                "":                       
                 <DeleteBtn id={item.id} endpoint={resourceTitle}/>

               }
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
