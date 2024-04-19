import  { useMemo, useState } from 'react';
import DataTable from './DataTable';
import { useReactToPrint } from 'react-to-print';

export default function WarehouseAccordion({ items, title ,brands}) {
  

  const [isOpen, setIsOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

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
  const processedItems = useMemo(() => {
    return items.map(item => ({
      ...item,
      brand: brands.find(brand => brand.id === item.brandId)?.title || 'Unknown'
    }));
  }, [items, brands]);

  const columns =["Item No","Item Name","brand","Buying Price","Selling Price","quantity","status"]


  return (
    <div className='mt-6'>
         <div id={`accordion-collapse-${title}`} data-accordion="collapse" >
      <h2 id={`accordion-collapse-heading-${title}`}>
        <button
          type="button"
          onClick={toggleAccordion}
          className={`flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-blue-300 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3 ${
            isOpen ? 'bg-gray-100 dark:bg-gray-800' : ''
          }`}
          data-accordion-target={`#accordion-collapse-body-${title}`}
          aria-expanded={isOpen}
          aria-controls={`accordion-collapse-body-${title}`}
        >
          <span>{title}</span>
          <svg
            data-accordion-icon
            className={`w-3 h-3 ${
              isOpen ? 'rotate-180' : ''
            } shrink-0`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5 5 1 1 5"
            />
          </svg>
        </button>
      </h2>
      <div
        id={`accordion-collapse-body-${title}`}
        className={`${
          isOpen ? '' : 'hidden'
        }`}
        aria-labelledby={`accordion-collapse-heading-${title}`}
      >
        <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700">
          {/* Render your item list here */}
          <DataTable 
            data={processedItems} 
            columns={columns} 
            resourceTitle="items" 
            itemsPerPage={10}
            base="inventory"
            selectAll={selectAll}
            toggleSelectAll={toggleSelectAll}
            setSelectedRows={setSelectedRows}
            showAddToShopButton={false}
          />

        </div>
      </div>
    </div>
    </div>
   
  );
}
