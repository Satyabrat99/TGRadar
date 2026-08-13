import React from 'react';
import { Filter, ChevronRight, X, Sparkles, Hash, Flame } from 'lucide-react';

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

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 py-4">
      <div className="bg-white rounded-[24px] p-4 border border-[#e9e9e9] shadow-sm flex flex-col gap-3">
        
        {/* Top Row: Search & Type Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Active Breadcrumb Trail Navigation */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full text-left">
            
            {/* All Reset Pill */}
            <button
              onClick={onClearFilters}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                !selectedCategory && !selectedSubCategory && !selectedTag && !showNsfwOnly
                  ? 'bg-[#005bf8] text-white shadow-sm'
                  : 'bg-[#f0f4ff] hover:bg-[#e0ebff] text-[#005bf8]'
              }`}
            >
              All Communities
            </button>

            {/* Parent Category Breadcrumb */}
            {selectedCategory && (
              <>
                <ChevronRight className="size-3.5 text-gray-400 flex-shrink-0" />
                <span className="bg-[#005bf8]/10 text-[#005bf8] text-xs font-extrabold px-3 py-1.5 rounded-full whitespace-nowrap flex items-center gap-1">
                  <span>{selectedCategory}</span>
                </span>
              </>
            )}

            {/* Sub-Category Breadcrumb */}
            {selectedSubCategory && (
              <>
                <ChevronRight className="size-3.5 text-gray-400 flex-shrink-0" />
                <div className="bg-[#005bf8] text-white text-xs font-extrabold px-3 py-1.5 rounded-full whitespace-nowrap flex items-center gap-1.5 shadow-sm">
                  <span>{selectedSubCategory}</span>
                  <button 
                    onClick={onClearSubCategory}
                    className="hover:bg-white/20 rounded-full p-0.5"
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
                <ChevronRight className="size-3.5 text-gray-400 flex-shrink-0" />
                <div className="bg-purple-600 text-white text-xs font-extrabold px-3 py-1.5 rounded-full whitespace-nowrap flex items-center gap-1.5 shadow-sm">
                  <Hash className="size-3" />
                  <span>{selectedTag}</span>
                  <button 
                    onClick={onClearTag}
                    className="hover:bg-white/20 rounded-full p-0.5"
                    title="Clear Tag"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              </>
            )}

          </div>

          {/* Type & NSFW Filter Buttons */}
          <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
            
            {/* 18+ NSFW Toggle Button */}
            <button
              onClick={onToggleNsfw}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer ${
                showNsfwOnly
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md border border-red-400'
                  : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'
              }`}
              title="Toggle 18+ NSFW Communities"
            >
              <Flame className="size-3.5 fill-current" />
              <span>18+ NSFW</span>
            </button>

            {['all', 'channel', 'group', 'mini-app'].map((type) => (
              <button
                key={type}
                onClick={() => onSelectType(type === 'all' ? null : type)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold capitalize transition-all cursor-pointer ${
                  (type === 'all' && !selectedType) || selectedType === type
                    ? 'bg-[#1b2045] text-white shadow-sm'
                    : 'bg-gray-100 hover:bg-gray-200 text-[#4f4f4f]'
                }`}
              >
                {type === 'mini-app' ? 'Mini Apps' : type}
              </button>
            ))}

            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="text-xs font-bold text-red-500 hover:text-red-600 hover:underline px-2 flex items-center gap-1"
              >
                <X className="size-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

        </div>

        {/* Results Counter Footer */}
        <div className="flex items-center justify-between text-xs font-semibold text-[#787878] pt-2 border-t border-[#f0f0f0]">
          <span className="flex items-center gap-1 text-[#1b2045]">
            <Sparkles className="size-3.5 text-[#005bf8]" />
            Showing <strong className="text-[#005bf8]">{totalResults}</strong> verified communities
          </span>

          <span className="text-[11px]">
            Updated in real-time
          </span>
        </div>

      </div>
    </div>
  );
}
