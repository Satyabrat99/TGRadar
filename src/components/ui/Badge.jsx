import React from 'react';

export default function Badge({ 
  children, 
  variant = 'glacial', 
  size = 'sm', 
  className = '', 
  icon: Icon 
}) {
  const baseStyles = "inline-flex items-center gap-1 font-semibold tracking-tight transition-colors select-none";
  
  const sizeStyles = {
    sm: "text-[11px] px-2.5 py-0.5 rounded-[3px]",
    md: "text-xs px-3 py-1 rounded-[12px]",
    lg: "text-xs px-3.5 py-1.5 rounded-[16px]"
  };

  const variantStyles = {
    glacial: "bg-[#cce2ff] text-[#1b2045]",
    cobalt: "bg-[#006cff] text-white",
    outline: "bg-[#f9f9f9] text-[#787878] border border-[#e9e9e9]",
    emerald: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    indigo: "bg-[#1b2045] text-white"
  };

  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {Icon && <Icon className="size-3" />}
      <span>{children}</span>
    </span>
  );
}
