import React, { useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  type?: string;
  id?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, type = 'text', className = '', id, ...props }, ref) => {
    const autoId = useId();
    const inputId = id || autoId;

    return (
      <div className="w-full">
        {label && (
          <label
            className="inline-block mb-1 pl-1"
            htmlFor={inputId}
          >
            {label}
          </label>
        )}
        <input
          type={type}
          className={`px-3 py-2 rounded-lg bg-gray-300 text-black font-bold outline-none duration-200 border border-gray-200 w-full ${className}`}
          ref={ref}
          id={inputId}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input'; 

export default Input;
