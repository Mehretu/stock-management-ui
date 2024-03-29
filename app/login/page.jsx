"use client"
import LoginForm from "@/components/Auth/LoginForm";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
import { MdOutlineInventory } from "react-icons/md";

export default function Login() {
    // const {data:session,status} =useSession()
    // const router = useRouter()

    // if(status==='loading'){
    //     return (
    //         <div className="flex items-center justify-center w-full max-h-full border border-gray-100 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
    //           <div className="px-3 py-1 mt-10 mb-10 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">loading user please wait...</div>
    //         </div>
    //       )
    // }
    // if(status==='authenticated'){
    //     router.push('/inventory-dashboard/home/overview')
    // }
  return (
    <section className='bg-gray-50 dark:bg-gray-900'>
        <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
            {/* {Logo} */}
            <a href="/"
            className='flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white'
            >

                <MdOutlineInventory
                className='w-8 h-8 mr-2 text-blue-500'
                />
                Stock Management System
            </a>
            <div className='w-full bg-white rounded-lg shadow-2xl dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700'>
                <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
                    <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center'>
                        Sign in to your account
                    </h1>
                    <LoginForm/>
                </div>
            </div>
        </div>
    </section>
  )
}
