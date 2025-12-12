"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function Select({
  children,
  value,
  onValueChange,
  ...props
}: {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
} & React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onValueChange?.(e.target.value)}
        className={cn(
          "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none pr-8",
          props.className
        )}
        {...props}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
}

function SelectTrigger({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}

function SelectValue({
  placeholder,
  ...props
}: { placeholder?: string } & React.ComponentProps<"span">) {
  return <span {...props}>{placeholder}</span>;
}

function SelectContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function SelectItem({
  value,
  children,
  ...props
}: {
  value: string;
  children: React.ReactNode;
} & React.ComponentProps<"option">) {
  return (
    <option value={value} {...props}>
      {children}
    </option>
  );
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
