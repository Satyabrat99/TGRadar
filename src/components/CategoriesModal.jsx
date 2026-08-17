import React, { useState, useMemo } from 'react';
import { X, Search, ChevronRight, Hash, Sparkles, Layers, ArrowLeft, ExternalLink, Filter, Radio, MessageSquare, AppWindow } from 'lucide-react';
import { CATEGORY_HIERARCHY } from '../data/categoryHierarchy';
import CommunityCard from './CommunityCard';

export default function CategoriesModal({ 
  isOpen, 
  onClose, 
  communities = [],
  bookmarkedIds = [],
  upvotedIds = [],
  onToggleBookmark,
  onUpvote,
  onOpenPreview,
  onSelectCategory,
  onSelectSubCategory,
  onSelectTag
}) {
  const [selectedDomainId, setSelectedDomainId] = useState(CATEGORY_HIERARCHY[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  const selectedDomain = useMemo(() => {
    return CATEGORY_HIERARCHY.find(cat => cat.id === selectedDomainId) || CATEGORY_HIERARCHY[0];
  }, [selectedDomainId]);

  // Real Dynamic Community Counts per Domain
  const domainCountsMap = useMemo(() => {
    const map = {};
    CATEGORY_HIERARCHY.forEach(domain => {
      const domainKey = domain.name.toLowerCase().split(' ')[0];
      const count = communities.filter(c => c.category?.toLowerCase().includes(domainKey)).length;
      map[domain.id] = count;
    });
    return map;
  }, [communities]);

  // Real Dynamic Community Counts per Subcategory
  const subCategoryCountsMap = useMemo(() => {
    const map = {};
    CATEGORY_HIERARCHY.forEach(domain => {
      domain.subCategories.forEach(sub => {
        const subKey = sub.name.toLowerCase().split(' ')[0];
        const count = communities.filter(c => {
          const matchesDomain = c.category?.toLowerCase().includes(domain.name.toLowerCase().split(' ')[0]);
          const matchesSub = c.title?.toLowerCase().includes(subKey) || 
                             c.description?.toLowerCase().includes(subKey) ||
                             c.tags?.some(t => t.toLowerCase().includes(subKey));
          return matchesDomain || matchesSub;
        }).length;
        map[sub.id] = count;
      });
    });
    return map;
  }, [communities]);

  // Matching community cards for selected Domain + Subcategory + Type
  const domainCommunities = useMemo(() => {
    const domainKey = selectedDomain.name.toLowerCase().split(' ')[0];
    let list = communities.filter(c => c.category?.toLowerCase().includes(domainKey));

    if (activeSubCategory) {
      const subKey = activeSubCategory.toLowerCase().split(' ')[0];
      list = list.filter(c => 
        c.title?.toLowerCase().includes(subKey) || 
        c.description?.toLowerCase().includes(subKey) ||
        c.tags?.some(t => t.toLowerCase().includes(subKey))
      );
    }

    if (selectedType) {
      list = list.filter(c => c.type === selectedType);
    }

    return list;
  }, [communities, selectedDomain, activeSubCategory, selectedType]);

  // Filter sub-categories based on instant search
  const filteredHierarchy = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();

    return CATEGORY_HIERARCHY.map(domain => {
      const matchingSubs = domain.subCategories.filter(sub => 
        sub.name.toLowerCase().includes(q) || 
        sub.tags.some(tag => tag.toLowerCase().includes(q))
      );

      if (domain.name.toLowerCase().includes(q) || matchingSubs.length > 0) {
        return {
          ...domain,
          subCategories: matchingSubs.length > 0 ? matchingSubs : domain.subCategories
        };
      }
      return null;
    }).filter(Boolean);
  }, [searchQuery]);

  if (!isOpen) return null;

  const handleApplyToMainPage = () => {
    onSelectCategory(selectedDomain.name);
    if (activeSubCategory) onSelectSubCategory(activeSubCategory);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      
      {/* Modal Container */}
      <div className="bg-white rounded-[32px] w-full max-w-[1240px] h-[92vh] max-h-[850px] border border-[#e9e9e9] shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* Header Bar with Search Input */}
        <div className="p-5 sm:p-6 border-b border-[#e9e9e9] bg-[#fdfdfd] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-[#005bf8]/10 text-[#005bf8] flex items-center justify-center shadow-sm">
              <Layers className="size-5" />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-[#1b2045] tracking-tight">Telegram Category Directory</h2>
                <span className="bg-[#005bf8] text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                  Verified Directory
                </span>
              </div>
              <p className="text-xs text-[#787878] mt-0.5">Explore real verified communities across 10 Parent Domains</p>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-[320px]">
              <Search className="size-4 text-[#787878] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setActiveSubCategory(null);
                }}
                placeholder="Search sub-topics (e.g. Airdrop, Python, DeFi)..."
                className="w-full pl-10 pr-8 py-2 bg-[#f0f4ff]/80 border border-[#dbe6fe] focus:border-[#005bf8] text-xs font-semibold rounded-full outline-none transition-all placeholder-[#787878]"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#787878] hover:text-[#1b2045]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Close Modal Button */}
            <button 
              onClick={onClose}
              className="size-9 rounded-full bg-gray-100 hover:bg-gray-200 text-[#1b2045] flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Master-Detail Split Explorer Area */}
        <div className="flex-1 flex overflow-hidden">
          
          {searchQuery.trim() ? (
            /* Search Results Mode */
            <div className="flex-1 p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredHierarchy.length > 0 ? (
                filteredHierarchy.map(domain => (
                  <div key={domain.id} className="bg-[#f8fafc] rounded-[24px] p-5 border border-[#e2e8f5] flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <div className={`size-7 rounded-lg bg-gradient-to-br ${domain.gradient} text-white flex items-center justify-center text-xs font-bold`}>
                        <domain.icon className="size-4" />
                      </div>
                      <span className="text-sm font-extrabold text-[#1b2045]">{domain.name}</span>
                    </div>

                    <div className="flex flex-col gap-2">
                      {domain.subCategories.map(sub => {
                        const count = subCategoryCountsMap[sub.id] || 0;
                        return (
                          <div key={sub.id} className="bg-white rounded-xl p-3 border border-[#e9e9e9] flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <button
                                onClick={() => {
                                  setSelectedDomainId(domain.id);
                                  setActiveSubCategory(sub.name);
                                  setSearchQuery("");
                                }}
                                className="text-xs font-extrabold text-[#005bf8] hover:underline text-left cursor-pointer"
                              >
                                {sub.name}
                              </button>
                              <span className="text-[10px] font-extrabold bg-[#f0f4ff] text-[#005bf8] px-2 py-0.5 rounded-full">
                                {count} Verified
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 py-16 flex flex-col items-center justify-center text-center text-[#787878]">
                  <Sparkles className="size-8 text-[#005bf8] mb-2" />
                  <p className="text-sm font-bold text-[#1b2045]">No matching categories found</p>
                  <p className="text-xs mt-1">Try searching for "DeFi", "Python", "Airdrop", or "Gaming"</p>
                </div>
              )}
            </div>
          ) : (
            /* Master-Detail Split Mode */
            <>
              {/* Left Sidebar: 10 Parent Domains with REAL Dynamic Counts */}
              <div className="w-full sm:w-[320px] bg-[#f8fafc] border-r border-[#e9e9e9] p-4 overflow-y-auto flex flex-col gap-1.5 flex-shrink-0">
                <span className="text-[10px] font-extrabold uppercase text-[#787878] tracking-wider px-3 mb-1 text-left">
                  Parent Domains ({CATEGORY_HIERARCHY.length})
                </span>

                {CATEGORY_HIERARCHY.map((domain) => {
                  const Icon = domain.icon;
                  const isSelected = domain.id === selectedDomainId;
                  const realCount = domainCountsMap[domain.id] || 0;

                  return (
                    <button
                      key={domain.id}
                      onClick={() => {
                        setSelectedDomainId(domain.id);
                        setActiveSubCategory(null);
                        setSelectedType(null);
                      }}
                      className={`w-full p-3 rounded-2xl flex items-center justify-between transition-all cursor-pointer text-left ${
                        isSelected 
                          ? 'bg-white shadow-md border border-[#005bf8]/30 text-[#005bf8]' 
                          : 'hover:bg-white/60 text-[#1b2045]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`size-8 rounded-xl bg-gradient-to-br ${domain.gradient} text-white flex items-center justify-center flex-shrink-0`}>
                          <Icon className="size-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-xs font-black tracking-tight ${isSelected ? 'text-[#005bf8]' : 'text-[#1b2045]'}`}>
                            {domain.name}
                          </span>
                          <span className="text-[10px] font-semibold text-[#787878]">
                            {realCount} Verified {realCount === 1 ? 'Community' : 'Communities'}
                          </span>
                        </div>
                      </div>

                      <ChevronRight className={`size-4 transition-transform ${isSelected ? 'text-[#005bf8] translate-x-1' : 'text-gray-300'}`} />
                    </button>
                  );
                })}
              </div>

              {/* Right Panel: DIRECT COMMUNITY CARDS GRID with Structured Filters */}
              <div className="flex-1 p-6 overflow-y-auto bg-white flex flex-col gap-5 text-left">
                
                {/* Header Bar with Category Details & Main Filter Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#f0f0f0] pb-4 gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`size-10 rounded-2xl bg-gradient-to-br ${selectedDomain.gradient} text-white flex items-center justify-center shadow-md flex-shrink-0`}>
                      <selectedDomain.icon className="size-5" />
                    </div>
                    <div className="flex flex-col text-left">
                      <h3 className="text-lg font-black text-[#1b2045] leading-tight">
                        {selectedDomain.name}
                      </h3>
                      <span className="text-xs font-semibold text-[#787878]">
                        Showing {domainCommunities.length} of {domainCountsMap[selectedDomain.id] || 0} Verified Communities
                      </span>
                    </div>
                  </div>

                  {/* Filter Main Discovery Page Button */}
                  <button
                    onClick={handleApplyToMainPage}
                    className="bg-[#005bf8] hover:bg-[#0047c9] text-white text-xs font-extrabold px-4 py-2.5 rounded-full transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer whitespace-nowrap self-start sm:self-auto"
                  >
                    <Filter className="size-3.5" />
                    <span>Filter Main Discovery Page</span>
                  </button>
                </div>

                {/* Structured Subcategories & Type Filter Pills Bar */}
                <div className="flex flex-col gap-2.5 bg-[#f8fafc] p-3 rounded-2xl border border-[#e9e9e9]">
                  
                  {/* Clean Pill Subcategory Filters without Scrollbars */}
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                    <button
                      onClick={() => setActiveSubCategory(null)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                        !activeSubCategory
                          ? 'bg-[#005bf8]/15 text-[#005bf8] border border-[#005bf8]/30 shadow-xs'
                          : 'bg-white text-[#4f4f4f] hover:bg-[#f0f4ff] hover:text-[#005bf8] border border-[#e2e8f5]'
                      }`}
                    >
                      <span>All Sub-categories</span>
                    </button>

                    {selectedDomain.subCategories.map(sub => {
                      const isActive = activeSubCategory === sub.name;
                      const subRealCount = subCategoryCountsMap[sub.id] || 0;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => setActiveSubCategory(isActive ? null : sub.name)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                            isActive
                              ? 'bg-[#005bf8]/15 text-[#005bf8] border border-[#005bf8]/30 shadow-xs'
                              : 'bg-white text-[#4f4f4f] hover:bg-[#f0f4ff] hover:text-[#005bf8] border border-[#e2e8f5]'
                          }`}
                        >
                          <span>{sub.name}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            isActive ? 'bg-[#005bf8] text-white' : 'bg-[#f0f4ff] text-[#005bf8] border border-[#dbe6fe]'
                          }`}>
                            {subRealCount}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Format Pills Row (Channels / Groups / Mini Apps) */}
                  <div className="flex items-center gap-1.5 border-t border-[#e2e8f5] pt-2 overflow-x-auto no-scrollbar">
                    <span className="text-[10px] font-extrabold uppercase text-[#787878] tracking-wider mr-1">Format:</span>
                    {[
                      { id: null, label: 'All Types' },
                      { id: 'channel', label: 'Channels', icon: Radio },
                      { id: 'group', label: 'Groups', icon: MessageSquare },
                      { id: 'mini-app', label: 'Mini Apps', icon: AppWindow }
                    ].map(({ id, label, icon: Icon }) => {
                      const isActive = selectedType === id;
                      return (
                        <button
                          key={label}
                          onClick={() => setSelectedType(id)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                            isActive
                              ? 'bg-[#005bf8]/15 text-[#005bf8] border border-[#005bf8]/30 font-extrabold'
                              : 'bg-white text-[#787878] hover:text-[#1b2045] border border-[#e2e8f5]'
                          }`}
                        >
                          {Icon && <Icon className="size-3" />}
                          <span>{label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Direct Community Cards Grid */}
                {domainCommunities.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {domainCommunities.map(community => (
                      <CommunityCard
                        key={community.id}
                        community={community}
                        isBookmarked={bookmarkedIds.includes(community.id)}
                        isUpvoted={upvotedIds.includes(community.id)}
                        onToggleBookmark={onToggleBookmark}
                        onUpvote={onUpvote}
                        onOpenPreview={onOpenPreview}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-16 flex flex-col items-center justify-center text-center text-[#787878]">
                    <Sparkles className="size-8 text-[#005bf8] mb-2" />
                    <p className="text-sm font-bold text-[#1b2045]">No verified communities match your active filters</p>
                    <p className="text-xs mt-1">Try resetting the sub-category or format filter to view more communities.</p>
                    <button
                      onClick={() => { setActiveSubCategory(null); setSelectedType(null); }}
                      className="mt-3 text-xs font-extrabold text-[#005bf8] hover:underline"
                    >
                      Reset Filters
                    </button>
                  </div>
                )}

              </div>
            </>
          )}

        </div>

      </div>

    </div>
  );
}
