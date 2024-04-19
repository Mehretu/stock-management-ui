import React from 'react'

export default function Radio({label,value,id,name,checked,onChange}) {
  return (
    
<div className="flex">
    <div className="flex items-center me-4">
        <input 
            id={id} 
            type="radio" 
            value={value} 
            name={name} 
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
            checked={checked}
            onChange={onChange}
            />
        <label 
            htmlFor={name}
            className="ms-2 text-sm font-medium text-gray-900">{label}</label>
    </div>
    
    
</div>

  )
}
