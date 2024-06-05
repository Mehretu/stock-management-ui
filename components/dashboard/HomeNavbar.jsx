"use client"
import Login from '@/app/login/page'
import { Building2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { redirect, usePathname } from 'next/navigation'
import React from 'react'

export default function HomeNavbar() {
  const {data:session,status} = useSession()
  const username = session?.user?.name.toUpperCase();

  if(status==='loading'){
    return (
      <div className="flex items-center justify-center w-full max-h-full border border-gray-100 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-1 mt-10 mb-10 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200"
        >loading user please wait...</div>
      </div>

    )
  }
  
  const pathname = usePathname()
  console.log(pathname)
  const navlinks = [
    {
      title:"Dashboard",
      href:"/inventory-dashboard/home/overview"
    },
    {
      title:"Recent Updates",
      href:"/inventory-dashboard/home/updates"
    }
  ]
  return (
    <div className='h-32 p-5 header-bg bg-slate-50 hidden md:block'>
        <div className="flex space-x-3">
            <div className="flex w-12 h-12 rounded-lg bg-white items-center justify-center">
              <Building2/>  
            </div>
            <div className="flex flex-col">
                <p className='text-slate-700 font-semibold'>Hello, {username}</p>
                {/* <span className='text-sm'>Mehretu</span> */}
            </div>
        </div>
        <nav className='mt-6 flex space-x-4'>
          <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
              <ul className="flex flex-wrap -mb-px">
                 {
              navlinks.map((item, i) =>{
                return(
                <li className='me-2 ' key={i}>
                    <Link  href={item.href} className={`${pathname === item.href? "inline-block px-4 py-2 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500":"inline-block px-4 py-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"}`}>
                      {item.title}
                    </Link>

                </li>
                )
              })
            }  
              </ul>
          </div>

        </nav>
    </div>
  )
}
