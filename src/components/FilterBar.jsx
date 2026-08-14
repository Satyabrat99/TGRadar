import React from 'react';
import { ChevronRight, X, Sparkles, Hash, Flame, Layers, Radio, Users, Bot, RotateCcw } from 'lucide-react';

export default function FilterBar({ 
  searchQuery, 
  onSearchChange,
  selectedCategory,
  selectedSubCategory,
  selectedTag,
  selectedType,
  showNsfwOnly,
  onToggleNsfw,
  onSelectType,
  onClearFilters,
  onClearSubCategory,
  onClearTag,
  totalResults
}) {
  const hasActiveFilters = searchQuery || selectedCategory || selectedSubCategory || selectedTag || selectedType || showNsfwOnly;

  const typeTabs = [
    { id: 'all', label: 'All', icon: Layers },
    { id: 'channel', label: 'Channels', icon: Radio },
    { id: 'group', label: 'Groups', icon: Users },
    { id: 'mini-app', label: 'Mini Apps', icon: Bot },
  ];

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-2 sm:py-4">
      <div className="relative overflow-hidden bg-white/95 backdrop-blur-xl rounded-[28px] p-4 sm:p-5 border border-[#e9eef8] shadow-[0_10px_35px_rgba(0,91,248,0.05)] flex flex-col gap-3.5 transition-all">
        
        {/* Subtle Decorative Background Gradient Glow */}
        <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-bl from-[#005bf8]/5 via-transparent to-transparent pointer-events-none rounded-tr-[28px]" />

        {/* Top Row: Breadcrumb Filters & Segmented Control */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3.5 relative z-10">
          
          {/* Left: Active Breadcrumb Trail Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto py-0.5 max-w-full text-left scrollbar-none w-full lg:w-auto">
            
            {/* All Reset Pill */}
            <button
              onClick={onClearFilters}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                !selectedCategory && !selectedSubCategory && !selectedTag && !showNsfwOnly && !selectedType
                  ? 'bg-[#005bf8] text-white shadow-md shadow-[#005bf8]/20'
                  : 'bg-[#f0f4ff] hover:bg-[#e2edff] text-[#005bf8] border border-[#dbe6fe]'
              }`}
            >
              <Layers className="size-3.5" />
              <span>All Communities</span>
            </button>

            {/* Parent Category Breadcrumb */}
            {selectedCategory && (
              <>
                <ChevronRight className="size-3.5 text-gray-300 flex-shrink-0" />
                <span className="bg-[#005bf8]/10 text-[#005bf8] text-xs font-extrabold px-3 py-1.5 rounded-xl whitespace-nowrap flex items-center gap-1 border border-[#005bf8]/20">
                  <span>{selectedCategory}</span>
                </span>
              </>
            )}

            {/* Sub-Category Breadcrumb */}
            {selectedSubCategory && (
              <>
                <ChevronRight className="size-3.5 text-gray-300 flex-shrink-0" />
                <div className="bg-[#005bf8] text-white text-xs font-extrabold px-3 py-1.5 rounded-xl whitespace-nowrap flex items-center gap-1.5 shadow-sm">
                  <span>{selectedSubCategory}</span>
                  <button 
                    onClick={onClearSubCategory}
                    className="hover:bg-white/20 rounded-full p-0.5 transition-colors cursor-pointer"
                    title="Clear Sub-category"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              </>
            )}

            {/* Micro-Tag Breadcrumb */}
            {selectedTag && (
              <>
                <ChevronRight className="size-3.5 text-gray-300 flex-shrink-0" />
                <div className="bg-[#7c3aed] text-white text-xs font-extrabold px-3 py-1.5 rounded-xl whitespace-nowrap flex items-center gap-1.5 shadow-sm">
                  <Hash className="size-3" />
                  <span>{selectedTag}</span>
                  <button 
                    onClick={onClearTag}
                    className="hover:bg-white/20 rounded-full p-0.5 transition-colors cursor-pointer"
                    title="Clear Tag"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              </>
            )}

            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="text-[11px] font-extrabold text-[#787878] hover:text-red-600 bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition-all ml-1 cursor-pointer whitespace-nowrap"
                title="Reset all filters"
              >
                <RotateCcw className="size-3" />
                <span>Reset</span>
              </button>
            )}

          </div>

          {/* Right: NSFW Pill & Apple-Style Segmented Type Tabs */}
          <div className="flex items-center gap-2.5 self-stretch sm:self-auto flex-wrap sm:flex-nowrap justify-between sm:justify-end flex-shrink-0 w-full lg:w-auto">
            
            {/* 18+ NSFW Toggle Button */}
            <button
              onClick={onToggleNsfw}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                showNsfwOnly
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-500/25 border border-red-400'
                  : 'bg-red-50/80 hover:bg-red-100 text-red-600 border border-red-200/80'
              }`}
              title="Toggle 18+ NSFW Communities"
            >
              <Flame className={`size-3.5 ${showNsfwOnly ? 'animate-pulse text-amber-300' : 'text-red-500'}`} />
              <span>18+ NSFW</span>
            </button>

            {/* Segmented Type Controller */}
            <div className="bg-[#f0f4ff]/90 p-1 rounded-full border border-[#dbe6fe] flex items-center gap-1 shadow-inner overflow-x-auto max-w-full no-scrollbar">
              {typeTabs.map(({ id, label, icon: Icon }) => {
                const isActive = (id === 'all' && !selectedType) || selectedType === id;
                return (
                  <button
                    key={id}
                    onClick={() => onSelectType(id === 'all' ? null : id)}
                    className={`px-2.5 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-extrabold flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                      isActive
                        ? 'bg-[#1b2045] text-white shadow-sm scale-100'
                        : 'text-[#4f4f4f] hover:text-[#1b2045] hover:bg-white/60'
                    }`}
                  >
                    <Icon className={`size-3 sm:size-3.5 ${isActive ? 'text-[#005bf8]' : 'text-gray-400'}`} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>

          </div>

        </div>

        {/* Bottom Row: Live Data Metrics & Real-time Indicator */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-semibold text-[#787878] pt-2.5 border-t border-[#f0f3fa] relative z-10">
          <div className="flex items-center gap-2 text-[#1b2045]">
            <div className="size-5 rounded-full bg-[#f0f4ff] flex items-center justify-center text-[#005bf8] flex-shrink-0">
              <Sparkles className="size-3" />
            </div>
            <span className="text-[11px] sm:text-xs">
              Showing <strong className="text-[#005bf8] font-black">{totalResults}</strong> verified communities
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium text-[#787878]">
            <span className="relative flex size-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full size-2 bg-emerald-500"></span>
            </span>
            <span>Live Sync · Updated in real-time</span>
          </div>
        </div>

      </div>
    </div>
  );
}

