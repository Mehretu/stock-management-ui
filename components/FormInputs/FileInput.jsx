import React from 'react'

export default function FileInput({label,type="file",className="col-span-full",register,accept}) {
  return (
    <div className={className}>
      <label
        htmlFor="large_size"
        className="block mb-2 text-sm font-medium text-gray-800"
      >
        {label}
      </label>
      <input 
      className="block p-1 w-100 text-md text-gray-800 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none" 
       id="large_size" 
       type={type}
       {...register("file", { required: true })}
       accept={accept}
       />

  
  
  </div>
  )
}


