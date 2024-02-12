import { makeDeleteRequest } from '@/lib/apiRequest';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function DeleteSelected({ selectedRows, resourceName,reload }) {
    const [loading, setLoading] = useState(false);
    const [deleting,setDeleting]= useState(false)
    

   

    const handleDeleteSelected = async () => {
        setLoading(true);
        try {
            if (selectedRows.length === 0) {
                toast.error("No items selected for deletion");
                return;
            }

            const result = await Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete selected items!"
            });

            if (result.isConfirmed) {
                for (const itemId of selectedRows) {
                    await makeDeleteRequest(
                        setDeleting, 
                        `api/${resourceName}/${itemId}`, 
                        resourceName,
                        
                        );
                }
                toast.success(`Selected ${resourceName} deleted successfully`);
                reload()
                
                
            }
        } catch (error) {
            console.error("Error deleting selected items:", error);
            toast.error("An error occurred while deleting selected items");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDeleteSelected}
            className={`px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={loading}
        >
            {loading ? "Deleting..." : "Delete Selected"}
        </button>
    );
}
