"use-client"
import { AlignJustify, Bell, ChevronDown, History, LogOut, Plus, Settings, Users, } from 'lucide-react'
import React, { useState } from 'react'
import SearchInput from './SearchInput'
import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'
import { generateInitials } from '@/lib/generateInitials'
import Login from '@/app/login/page'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link'


export default function Header({setShowSidebar}) {
  const {data:session,status} =useSession()
  const username = session?.user?.name.split(' ')[0]?? "";
  const name = session?.user?.name;
  const initials = name ? generateInitials(name) : " ";

  const [isNotificationsDropdownOpen, setIsNotificationsDropdownOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);


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
    <div className='bg-gray-100 h-12 flex items-center 
    justify-between px-8 border border-b border-slate-200'>
        <button className='lg:hidden' onClick={()=>setShowSidebar(true)}>
          <AlignJustify className='w-6 h-6'/>
        </button>
        <div className='flex gap-3 '>
          {/* {Recent Actiivities} */}

            <button className='hidden lg:block'>
              <History className='w-6 h-6 '/>
            </button>
          {/* {Search} */}
            <SearchInput/> 

        </div>
        <div className='items-center gap-3 hidden lg:flex'>
         <div className='flex border-r border-gray-300 space-x-2'>
            <button className='p-1 hover:bg-slate-200 rounded-lg'>
                <Users className='text-slate-900 w-4 h-4'/>
            </button>
            {/* {Dropdown for notifications} */}
            <DropdownMenu>
        <DropdownMenuTrigger onClick={() => setIsNotificationsDropdownOpen(true)}>
        <div 
            className="relative inline-flex items-center p-3 text-sm font-medium text-center text-white bg-transparent rounded-lg hover:bg-slate-200 focus:ring-4 focus:outline-none"
            >
            <Bell className='text-slate-900 w-4 h-4'/>

            <span className="sr-only">Notifications</span>
              <div className="absolute inline-flex items-center 
              justify-center w-5 h-5 text-xs font-bold text-white 
              bg-red-500 rounded-full -top-0 -end-1 dark:border-gray-900">20</div>
            </div>
        </DropdownMenuTrigger>
        {isNotificationsDropdownOpen && (
          <DropdownMenuContent >
          <DropdownMenuLabel className="bg-slate-100">Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="hover:bg-blue-300" onClick={() => setIsNotificationsDropdownOpen(false)}>
            <button onClick={()=> signOut()}>Logout</button>
          </DropdownMenuItem>

        </DropdownMenuContent>
        )

        }
        </DropdownMenu>

            {/* <button className='p-1 hover:bg-slate-200 rounded-lg'>
                <Settings className='text-slate-900 w-4 h-4'/>
            </button> */}

        </div>
        <div className='flex gap-3 '>
        <DropdownMenu>
        <DropdownMenuTrigger onClick={() => setIsAccountDropdownOpen(true)}>
            <div className='flex items-center'>
              <span>{username}</span>
            <ChevronDown className='w-4 h-4'/>
            </div>
        </DropdownMenuTrigger>
        {isAccountDropdownOpen && (
          <DropdownMenuContent className="py-2 px-4 pr-8" >
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="hover:bg-blue-300" onClick={() => setIsAccountDropdownOpen(false)}>
            <Link href="/inventory-dashboard/config/userManagement" className='flex items-center'>
            <Settings className='mr-2 w-4 h-4' />
             <span>Edit Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-blue-300">
            <button className='flex items-center' onClick={()=> signOut()}>
            <LogOut className='mr-2 w-4 h-4'/>
              Logout
            </button>
          </DropdownMenuItem>
          

        </DropdownMenuContent>
        )

        }
        </DropdownMenu>
            <button>
            {session.user?.image?(
                <Image 
                src={session.user?.image} 
                alt='user image' 
                width={600} 
                height={600}
                className='rounded-full w-8 h-8 border
                 border-slate-800 '
                />
              ):(
                <div className='rounded-full w-8 h-8 border
                border-slate-800 bg-white text-center'>
                  {initials}
                </div>
              )}
            </button>
            
        </div>
          {/* {} */}
          {/* {} */}

        </div>
        <div className='lg:hidden'>
        <DropdownMenu>
        <DropdownMenuTrigger onClick={() => setIsAccountDropdownOpen(true)}>
        <div>
              {session.user?.image?(
                <Image 
                src={session.user?.image} 
                alt='user image' 
                width={600} 
                height={600}
                className='rounded-full w-8 h-8 border
                 border-slate-800'
                />
              ):(
                <div className='rounded-full w-8 h-8 border
                border-slate-800 bg-white'>
                  {initials}
                </div>
              )}
        </div>
        </DropdownMenuTrigger>
        {isAccountDropdownOpen && (
          <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-blue-300" onClick={() => setIsAccountDropdownOpen(false)}>
              <Link href="/inventory-dashboard/config/userManagement" className='flex items-center'>
              <Settings className='mr-2 w-4 h-4'/>
                <span>Edit Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-blue-300">
              <button className='flex items-center' onClick={()=> signOut()}>
              <LogOut className='mr-2 w-4 h-4'/>
                Logout
              </button>
            </DropdownMenuItem>
  
          </DropdownMenuContent>
        )

        }
        </DropdownMenu>
        

        </div>
        
            
    </div>
  )
}
