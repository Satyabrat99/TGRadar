import React from 'react';

export default function ActionButton({ 
  children, 
  variant = 'cobalt', 
  size = 'md', 
  className = '', 
  icon: Icon,
  disabled = false,
  onClick,
  type = 'button',
  title,
  active = false
}) {
  const baseStyles = "inline-flex items-center justify-center gap-1.5 font-semibold text-xs rounded-[16px] transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-[11px]",
    md: "px-4.5 py-2.5 text-xs",
    lg: "px-6 py-3.5 text-sm font-bold",
    icon: "p-2.5 text-xs"
  };

  const variantStyles = {
    cobalt: "bg-[#006cff] hover:bg-[#4672ff] text-white shadow-sm hover:shadow-md hover:-translate-y-0.5",
    outline: "bg-white border border-[#e9e9e9] hover:border-[#1b2045] text-[#1b2045] hover:bg-[#f9f9f9]",
    ghost: "bg-transparent text-[#1b2045] hover:bg-[#f9f9f9]",
    active: "bg-[#006cff] text-white border border-[#006cff] shadow-sm",
    glacial: "bg-[#cce2ff] text-[#006cff] border border-[#006cff]/20 font-bold",
    danger: "bg-red-50 border border-red-200 text-red-600 hover:bg-red-100"
  };

  const currentVariant = active ? 'active' : variant;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      title={title}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[currentVariant]} ${className}`}
    >
      {Icon && <Icon className="size-4" />}
      {children && <span>{children}</span>}
    </button>
  );
}
