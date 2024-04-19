"use client"
import React from 'react'

export default function Input({
  label,
  name,
  register,
  errors,
  isRequired=true,
  type="text",
  className="sm:col-span-2",
  value,
  onChange = () =>{}
}) {

  return (
    <div className={className}>
          <label
            htmlFor={name}
            className="block text-xs font-small leading-6 text-gray-900 mb-2 "
          >
            {label}
          </label>
          <div className="mt-2">
            <input
              {...register(`${name}`, { required: isRequired })}
              type={type}
              name={name}
              id={name}
              value={value}
              autoComplete={name}
              className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 hover:ring-blue-500 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              placeholder={" "}
              onChange={(e) => onChange(e.target.value)}
            />
            {errors.title && (
              <span className="text-sm text-red-600 ">
                {label} is required
              </span>
            )}
          </div>
          </div>
  )
}
