import React, { useState, useMemo } from 'react';
import { X, Search, ChevronRight, Hash, Sparkles, Layers, ArrowLeft, ExternalLink } from 'lucide-react';
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
  const [activeTag, setActiveTag] = useState(null);

  const selectedDomain = useMemo(() => {
    return CATEGORY_HIERARCHY.find(cat => cat.id === selectedDomainId) || CATEGORY_HIERARCHY[0];
  }, [selectedDomainId]);

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

  // Matching community listings for selected sub-category/tag inside modal
  const inlineMatchingCommunities = useMemo(() => {
    if (!activeSubCategory && !activeTag) return [];

    return communities.filter(item => {
      // Category Domain Match
      const matchesDomain = item.category.toLowerCase().includes(selectedDomain.name.toLowerCase().split(' ')[0]);

      // Tag Match
      if (activeTag) {
        return item.tags.some(t => t.toLowerCase().includes(activeTag.toLowerCase()));
      }

      // Sub-category Match
      if (activeSubCategory) {
        const subNameKey = activeSubCategory.toLowerCase().split(' ')[0];
        const matchesSubName = item.title.toLowerCase().includes(subNameKey) || 
                               item.description.toLowerCase().includes(subNameKey) ||
                               item.tags.some(t => t.toLowerCase().includes(subNameKey));
        return matchesDomain || matchesSubName;
      }

      return matchesDomain;
    });
  }, [communities, selectedDomain, activeSubCategory, activeTag]);

  if (!isOpen) return null;

  const handleSubCategoryClick = (subName) => {
    setActiveSubCategory(subName);
    setActiveTag(null);
  };

  const handleTagClick = (subName, tagName) => {
    setActiveSubCategory(subName);
    setActiveTag(tagName);
  };

  const handleApplyToMainPage = () => {
    onSelectCategory(selectedDomain.name);
    if (activeSubCategory) onSelectSubCategory(activeSubCategory);
    if (activeTag) onSelectTag(activeTag);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      
      {/* Modal Container */}
      <div className="bg-white rounded-[32px] w-full max-w-[1150px] h-[90vh] max-h-[820px] border border-[#e9e9e9] shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* Header Bar with Search Input */}
        <div className="p-6 border-b border-[#e9e9e9] bg-[#fdfdfd] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-[#005bf8]/10 text-[#005bf8] flex items-center justify-center shadow-sm">
              <Layers className="size-5" />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-[#1b2045] tracking-tight">Telegram Category Directory</h2>
                <span className="bg-[#005bf8] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                  Interactive Directory
                </span>
              </div>
              <p className="text-xs text-[#787878] mt-0.5">Explore 10 Domains, 40+ Sub-categories & Micro-topics</p>
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
                  setActiveTag(null);
                }}
                placeholder="Search sub-topics (e.g. Airdrop, Python, DeFi)..."
                className="w-full pl-10 pr-4 py-2 bg-[#f0f4ff]/80 border border-[#dbe6fe] focus:border-[#005bf8] text-xs font-semibold rounded-full outline-none transition-all placeholder-[#787878]"
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
                      {domain.subCategories.map(sub => (
                        <div key={sub.id} className="bg-white rounded-xl p-3 border border-[#e9e9e9] flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => {
                                setSelectedDomainId(domain.id);
                                handleSubCategoryClick(sub.name);
                                setSearchQuery("");
                              }}
                              className="text-xs font-extrabold text-[#005bf8] hover:underline text-left"
                            >
                              {sub.name}
                            </button>
                            <span className="text-[10px] font-bold text-[#787878]">{sub.count} Hubs</span>
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            {sub.tags.map(tag => (
                              <button
                                key={tag}
                                onClick={() => {
                                  setSelectedDomainId(domain.id);
                                  handleTagClick(sub.name, tag);
                                  setSearchQuery("");
                                }}
                                className="bg-[#f0f4ff] hover:bg-[#005bf8] hover:text-white text-[#005bf8] text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors flex items-center gap-0.5 cursor-pointer"
                              >
                                <Hash className="size-2.5" />
                                <span>{tag}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
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
              {/* Left Sidebar: 10 Parent Domains */}
              <div className="w-full sm:w-[320px] bg-[#f8fafc] border-r border-[#e9e9e9] p-4 overflow-y-auto flex flex-col gap-1.5 flex-shrink-0">
                <span className="text-[10px] font-extrabold uppercase text-[#787878] tracking-wider px-3 mb-1 text-left">
                  Parent Domains ({CATEGORY_HIERARCHY.length})
                </span>

                {CATEGORY_HIERARCHY.map((domain) => {
                  const Icon = domain.icon;
                  const isSelected = domain.id === selectedDomainId;

                  return (
                    <button
                      key={domain.id}
                      onClick={() => {
                        setSelectedDomainId(domain.id);
                        setActiveSubCategory(null);
                        setActiveTag(null);
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
                          <span className="text-[10px] font-medium text-[#787878]">
                            {domain.totalCommunities} Communities
                          </span>
                        </div>
                      </div>

                      <ChevronRight className={`size-4 transition-transform ${isSelected ? 'text-[#005bf8] translate-x-1' : 'text-gray-300'}`} />
                    </button>
                  );
                })}
              </div>

              {/* Right Panel: Sub-Categories OR Inline Community Results */}
              <div className="flex-1 p-6 overflow-y-auto bg-white flex flex-col gap-6 text-left">
                
                {activeSubCategory || activeTag ? (
                  /* Mode B: Inline Community Results View Inside Modal */
                  <div className="flex flex-col gap-6">
                    {/* Header Bar with Back Button */}
                    <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setActiveSubCategory(null);
                            setActiveTag(null);
                          }}
                          className="px-3.5 py-1.5 rounded-full bg-[#f0f4ff] hover:bg-[#e0ebff] text-[#005bf8] text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <ArrowLeft className="size-3.5 stroke-[2.5]" />
                          <span>Back to Sub-categories</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <span className="text-base font-black text-[#1b2045]">
                            {activeSubCategory}
                          </span>
                          {activeTag && (
                            <span className="bg-purple-600 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-0.5">
                              <Hash className="size-3" />
                              <span>{activeTag}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={handleApplyToMainPage}
                        className="text-xs font-extrabold text-[#005bf8] hover:underline flex items-center gap-1"
                      >
                        <span>View in Main Discovery</span>
                        <ExternalLink className="size-3.5" />
                      </button>
                    </div>

                    {/* Inline Communities Grid */}
                    {inlineMatchingCommunities.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {inlineMatchingCommunities.map(community => (
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
                        <p className="text-sm font-bold text-[#1b2045]">No communities indexed yet for this sub-topic</p>
                        <p className="text-xs mt-1">Be the first to submit a community under {activeSubCategory}!</p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Mode A: Sub-Categories Cards Grid */
                  <>
                    {/* Domain Title Header */}
                    <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-4">
                      <div className="flex items-center gap-3">
                        <div className={`size-10 rounded-2xl bg-gradient-to-br ${selectedDomain.gradient} text-white flex items-center justify-center shadow-md`}>
                          <selectedDomain.icon className="size-5" />
                        </div>
                        <div className="flex flex-col">
                          <h3 className="text-lg font-black text-[#1b2045]">
                            {selectedDomain.name}
                          </h3>
                          <span className="text-xs font-semibold text-[#787878]">
                            {selectedDomain.subCategories.length} Sub-categories • {selectedDomain.totalCommunities} Hubs
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onSelectCategory(selectedDomain.name);
                          onClose();
                        }}
                        className="bg-[#005bf8] hover:bg-[#0047c9] text-white text-xs font-extrabold px-4 py-2 rounded-full transition-all shadow-sm cursor-pointer"
                      >
                        Filter Main Page
                      </button>
                    </div>

                    {/* Sub-Category Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedDomain.subCategories.map((sub) => (
                        <div 
                          key={sub.id} 
                          onClick={() => handleSubCategoryClick(sub.name)}
                          className="bg-[#f8fafc] rounded-[24px] p-5 border border-[#e2e8f5] flex flex-col justify-between gap-3 hover:border-[#005bf8] hover:shadow-md transition-all group cursor-pointer"
                        >
                          {/* Sub-category Header */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-extrabold text-[#1b2045] group-hover:text-[#005bf8] transition-colors">
                              {sub.name}
                            </span>
                            <span className="text-[10px] font-extrabold bg-[#005bf8]/10 text-[#005bf8] px-2.5 py-0.5 rounded-full">
                              {sub.count} Hubs
                            </span>
                          </div>

                          {/* Micro-Tags Row */}
                          <div className="flex flex-wrap gap-1.5 pt-1" onClick={(e) => e.stopPropagation()}>
                            {sub.tags.map((tag) => (
                              <button
                                key={tag}
                                onClick={() => handleTagClick(sub.name, tag)}
                                className="bg-white hover:bg-[#005bf8] hover:text-white text-[#1b2045] border border-[#e2e8f5] text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                              >
                                <Hash className="size-3 text-[#005bf8] group-hover:text-white" />
                                <span>{tag}</span>
                              </button>
                            ))}
                          </div>

                          {/* Direct Sub-category Browse CTA */}
                          <button
                            onClick={() => handleSubCategoryClick(sub.name)}
                            className="mt-1 text-xs font-bold text-[#005bf8] hover:underline flex items-center gap-1 self-start cursor-pointer"
                          >
                            <span>Browse {sub.name}</span>
                            <ChevronRight className="size-3.5" />
                          </button>

                        </div>
                      ))}
                    </div>
                  </>
                )}

              </div>
            </>
          )}

        </div>

      </div>

    </div>
  );
}
