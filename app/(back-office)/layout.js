"use client"
import  { useState } from 'react'
import Header from '../../components/dashboard/Header'
import Sidebar from '@/components/dashboard/Sidebar'
import { useSession } from 'next-auth/react'
import Login from '../login/page'

export default function Layout({children}) {
  const [showSidebar,setShowSidebar] = useState(false)
  const {data:session,status} = useSession()
  if(status==='loading'){
    return (
      <div className="flex items-center justify-center w-full max-h-full border border-gray-100 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-1 mt-10 mb-10 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">loading user please wait...</div>
      </div>

    )
  }
  if(status==='unauthenticated'){
    return <Login/>;
  }
  return (
    <div className='flex'>
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar}/>
       <main className='lg:ml-60 ml-0 w-full bg-slate-100 min-h-screen'>
        <Header setShowSidebar={setShowSidebar}/>
        {children}
       </main>
    </div>
  )
}
