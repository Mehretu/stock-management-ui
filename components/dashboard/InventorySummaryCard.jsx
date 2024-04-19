import React from 'react'

export default function InventorySummaryCard({item}) {
  return (
    <div className={`${item.color} mb-4 shadow border border-slate-200 hover:border-blue-400 
    rounded-lg bg-white px-4 py-2 cursor-pointer flex justify-between items-center gap-3 
    transition-all duration-300`}>
        <h2 className={`${item.text} uppercase  text-sm`}>{item.title}</h2>
        <h4 className={`text-2xl ${item.numberColor} `}>{item.number}</h4>
    </div>
  )
}
