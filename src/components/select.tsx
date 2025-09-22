"use client";

import React, { useId, ForwardedRef } from "react";

// ✅ Type for the component props
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: string[];
  label?: string;
  className?: string;
}

const Select = (
  { options, label, className = "", ...props }: SelectProps,
  ref: ForwardedRef<HTMLSelectElement>
) => {
  const id = useId();

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="">
          {label}
        </label>
      )}
      <select
        {...props}
        id={id}
        ref={ref}
        className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}
      >
        {options?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

// ✅ Export with forwardRef
export default React.forwardRef<HTMLSelectElement, SelectProps>(Select);
