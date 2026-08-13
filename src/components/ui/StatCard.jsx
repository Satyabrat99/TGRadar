import React from 'react';

export default function StatCard({ 
  icon: Icon, 
  title, 
  value, 
  variant = 'hero' 
}) {
  if (variant === 'hero') {
    return (
      <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-[16px] p-4 flex items-center justify-center gap-3 text-white transition-transform hover:scale-[1.02]">
        <div className="p-2 rounded-[10px] bg-white/15 text-white">
          <Icon className="size-4" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-lg font-bold leading-none">{value}</span>
          <span className="text-[11px] font-medium text-white/70 uppercase tracking-wider mt-1">{title}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f9f9f9] border border-[#e9e9e9] rounded-[16px] p-4 flex flex-col justify-center transition-all hover:border-[#bbbbbb]">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#787878] flex items-center gap-1 mb-1">
        <Icon className="size-3 text-[#006cff]" /> {title}
      </span>
      <span className="text-base font-bold text-[#1b2045] tracking-tight">
        {value}
      </span>
    </div>
  );
}
