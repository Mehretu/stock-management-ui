import { HelpCircle, LayoutGrid, List, MoreHorizontal, Plus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function FixedHeader({newLink,title}) {
  return (
    <div className='flex justify-between items-center bg-white py-5 px-4'>
        <button className='text-2xl'>{title}</button>
        <div className="flex gap-4">
            {/* {New} */}
              <Link href={newLink} className='p-1 bg-blue-600 rounded-sm flex items-center space-x-2 px-3 text-white'>
                <Plus className='w-4 h-4'/>
              <span className='hidden md:block'>New</span>
              </Link> 
          
            
            
        </div>
    </div>
  )
}
