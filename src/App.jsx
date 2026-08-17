import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight, Layers } from 'lucide-react';
import { useUser, useClerk } from '@clerk/clerk-react';
import Hero from './components/Hero';
import IndustrySpotlight from './components/IndustrySpotlight';
import CommunityOfTheDay from './components/CommunityOfTheDay';
import FilterBar from './components/FilterBar';
import CommunityCard from './components/CommunityCard';
import CommunityModal from './components/CommunityModal';
import SubmitModal from './components/SubmitModal';
import CategoriesModal from './components/CategoriesModal';
import BookmarksDrawer from './components/BookmarksDrawer';
import HowItWorks from './components/HowItWorks';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import AnalyticsDashboard from './components/AnalyticsDashboard';

import { COMMUNITIES } from './data/communities';
import { fetchCommunities, insertCommunityToSupabase } from './lib/supabase';
import { trackPageView, trackJoinClick, trackSearch, trackCategoryView } from './lib/analytics';

export default function App() {
  const { isSignedIn, isLoaded, user } = useUser();
  const { openSignIn } = useClerk();

  const [communities, setCommunities] = useState(COMMUNITIES);
  
  // User-scoped Bookmarks State
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  // Persistent Upvotes via localStorage
  const [upvotedIds, setUpvotedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('tgradar_upvotes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [loadingDb, setLoadingDb] = useState(true);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [showNsfwOnly, setShowNsfwOnly] = useState(false);

  // Modal States
  const [previewCommunity, setPreviewCommunity] = useState(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [isBookmarksDrawerOpen, setIsBookmarksDrawerOpen] = useState(false);

  // Hidden Analytics Dashboard State (Controlled via Footer or #/analytics URL)
  const [showAnalytics, setShowAnalytics] = useState(() => {
    return window.location.hash === '#/analytics' || window.location.search.includes('analytics');
  });

  useEffect(() => {
    const handleHashChange = () => {
      setShowAnalytics(window.location.hash === '#/analytics' || window.location.search.includes('analytics'));
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Track initial page view telemetry
  useEffect(() => {
    trackPageView();
  }, []);

  // Load Bookmarks for the active logged-in user (from Clerk cloud metadata & localStorage)
  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn && user?.id) {
      const cloudBookmarks = user?.unsafeMetadata?.bookmarks;
      if (Array.isArray(cloudBookmarks) && cloudBookmarks.length > 0) {
        setBookmarkedIds(cloudBookmarks);
        try {
          localStorage.setItem(`tgradar_bookmarks_${user.id}`, JSON.stringify(cloudBookmarks));
        } catch (_) {}
      } else {
        try {
          const saved = localStorage.getItem(`tgradar_bookmarks_${user.id}`);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setBookmarkedIds(parsed);
              user.update({
                unsafeMetadata: {
                  ...user.unsafeMetadata,
                  bookmarks: parsed
                }
              }).catch(() => {});
            }
          }
        } catch {
          setBookmarkedIds([]);
        }
      }
    } else {
      setBookmarkedIds([]);
    }
  }, [isLoaded, isSignedIn, user?.id]);

  useEffect(() => {
    try {
      localStorage.setItem('tgradar_upvotes', JSON.stringify(upvotedIds));
    } catch (e) {
      console.error('Failed to save upvotes:', e);
    }
  }, [upvotedIds]);



  // Auth-gated Community Modal Opener
  const handleOpenPreview = (community) => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      openSignIn();
      return;
    }
    trackJoinClick(community);
    setPreviewCommunity(community);
  };

  // Auth-gated Submit Community Modal Opener
  const handleOpenSubmit = () => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      openSignIn();
      return;
    }
    setIsSubmitModalOpen(true);
  };

  // Auth-gated Bookmarks Drawer Opener
  const handleOpenBookmarks = () => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      openSignIn();
      return;
    }
    setIsBookmarksDrawerOpen(true);
  };








  // Load Communities from Supabase on Mount
  useEffect(() => {
    async function loadData() {
      setLoadingDb(true);
      const data = await fetchCommunities();
      if (data && data.length > 0) {
        setCommunities(data);
      }
      setLoadingDb(false);
    }
    loadData();
  }, []);

  // Community of the Day & Trending Top 3
  const communityOfDay = useMemo(() => {
    return communities.find(c => c.isCommunityOfDay || c.is_community_of_day) || communities[0];
  }, [communities]);

  const trendingList = useMemo(() => {
    // Use DB-assigned trend_rank if rotation script has run
    const dbTrending = communities
      .filter(c => c.trend_rank > 0)
      .sort((a, b) => a.trend_rank - b.trend_rank)
      .slice(0, 3);

    // Fallback: client-side gem score if rotation hasn't run yet
    if (dbTrending.length >= 3) return dbTrending;
    return [...communities]
      .sort((a, b) => (b.upvotes + b.subscribers / 1000) - (a.upvotes + a.subscribers / 1000))
      .slice(0, 3);
  }, [communities]);


  // Bookmarks Toggle (Auth-gated + Direct Cloud Save to Clerk User Account)
  const handleToggleBookmark = async (id) => {
    if (!isLoaded) return;
    if (!isSignedIn || !user) {
      openSignIn();
      return;
    }

    const nextBookmarks = bookmarkedIds.includes(id)
      ? bookmarkedIds.filter(item => item !== id)
      : [...bookmarkedIds, id];

    // 1. Optimistic UI update
    setBookmarkedIds(nextBookmarks);

    // 2. Save to localStorage cache
    try {
      localStorage.setItem(`tgradar_bookmarks_${user.id}`, JSON.stringify(nextBookmarks));
    } catch (e) {
      console.error('LocalStorage save error:', e);
    }

    // 3. Persist directly to Clerk User Cloud Account
    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          bookmarks: nextBookmarks
        }
      });
    } catch (err) {
      console.warn('Clerk user metadata cloud sync:', err);
    }
  };



  // Upvote Handler (Auth-gated)
  const handleUpvote = (id) => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      openSignIn();
      return;
    }
    if (upvotedIds.includes(id)) return;
    setUpvotedIds(prev => [...prev, id]);
    setCommunities(prev => prev.map(item => 
      item.id === id ? { ...item, upvotes: item.upvotes + 1 } : item
    ));
  };

  // Handle New Community Submission
  const handleAddCommunity = (newCommunity) => {
    setCommunities(prev => [newCommunity, ...prev]);
    insertCommunityToSupabase(newCommunity);
  };

  // Clear Filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setSelectedTag(null);
    setSelectedType(null);
    setShowNsfwOnly(false);
  };

  // Filter Logic
  const filteredCommunities = useMemo(() => {
    return communities.filter(item => {
      const isNsfw = item.category?.includes("NSFW") || item.tags?.some(t => t.toLowerCase().includes("18+") || t.toLowerCase().includes("nsfw"));

      // NSFW Filter Logic
      if (showNsfwOnly) {
        if (!isNsfw) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesUsername = item.username.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesTags = item.tags.some(tag => tag.toLowerCase().includes(q));
        if (!matchesTitle && !matchesUsername && !matchesDesc && !matchesTags) return false;
      }

      // Category Domain Filter
      if (selectedCategory && item.category !== selectedCategory) {
        if (!item.category.toLowerCase().includes(selectedCategory.toLowerCase().split(' ')[0])) {
          return false;
        }
      }

      // Type Filter
      if (selectedType && item.type !== selectedType) {
        return false;
      }

      // Micro-Tag Filter
      if (selectedTag) {
        const hasTag = item.tags.some(t => t.toLowerCase().includes(selectedTag.toLowerCase()));
        if (!hasTag) return false;
      }

      return true;
    });
  }, [communities, searchQuery, selectedCategory, selectedType, selectedTag, showNsfwOnly]);

  // 50% New Discovered / 50% Old Established Discovery Grid Rotation (20 Items Total)
  const displayedCommunities = useMemo(() => {
    if (!filteredCommunities || filteredCommunities.length === 0) return [];

    // If explicit search, sub-category, or tag filter is active, return matching direct results
    if (searchQuery.trim() || selectedSubCategory || selectedTag || selectedType || showNsfwOnly) {
      return filteredCommunities.slice(0, 20);
    }

    // Split into Newly Discovered (dynamically ingested) & Established pools
    const newPool = filteredCommunities.filter(c => c.id?.startsWith('discovered-') || c.id?.includes('c-') || c.created_at);
    const oldPool = filteredCommunities.filter(c => !newPool.includes(c));

    const topNew = newPool.slice(0, 10);
    const topOld = oldPool.slice(0, 10);

    // Interleave 50% New and 50% Old (New 1, Old 1, New 2, Old 2...)
    const hybrid = [];
    const maxLen = Math.max(topNew.length, topOld.length);

    for (let i = 0; i < maxLen; i++) {
      if (topNew[i]) hybrid.push(topNew[i]);
      if (topOld[i]) hybrid.push(topOld[i]);
    }

    // Fill remaining up to 20 if either pool has < 10
    if (hybrid.length < 20) {
      for (const item of filteredCommunities) {
        if (!hybrid.some(h => h.id === item.id)) {
          hybrid.push(item);
        }
        if (hybrid.length >= 20) break;
      }
    }

    return hybrid.slice(0, 20);
  }, [filteredCommunities, searchQuery, selectedSubCategory, selectedTag, selectedType, showNsfwOnly]);


  // If Hidden Analytics Dashboard is active, render dedicated telemetry view
  if (showAnalytics) {
    return (
      <AnalyticsDashboard 
        onBackToApp={() => {
          setShowAnalytics(false);
          window.location.hash = '';
        }} 
      />
    );
  }

  // Check if active search or category/type/tag filter is engaged
  const isFiltering = Boolean(
    searchQuery.trim() || 
    selectedCategory || 
    selectedSubCategory || 
    selectedTag || 
    selectedType || 
    showNsfwOnly
  );

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#1b2045] flex flex-col font-sans antialiased selection:bg-[#005bf8] selection:text-white">
      
      {/* Hero Section with Floating Navbar */}
      <Hero 
        searchVal={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={communities.length}
        communities={communities}
        bookmarksCount={isSignedIn ? bookmarkedIds.length : 0}
        onOpenBookmarks={handleOpenBookmarks}
        onOpenSubmit={handleOpenSubmit}
        onOpenPreview={handleOpenPreview}
      />

      {/* Render Home Page Featured & Spotlight Sections ONLY when no active search/category filter is active */}
      {!isFiltering && (
        <>
          {/* Industry Categories Spotlight */}
          <section id="categories">
            <IndustrySpotlight 
              selectedIndustry={selectedCategory}
              onSelectIndustry={(cat) => {
                setSelectedCategory(cat);
                setSelectedSubCategory(null);
                setSelectedTag(null);
              }}
              onOpenCategoriesModal={() => setIsCategoriesModalOpen(true)}
            />
          </section>

          {/* Featured Community of the Day & Trending Section */}
          <section id="trending">
            <CommunityOfTheDay 
              communityOfDay={communityOfDay}
              trendingList={trendingList}
              onOpenPreview={handleOpenPreview}
            />
          </section>
        </>
      )}

      {/* Main Filter & Communities Discovery Grid (Max 20 Items) */}
      <main id="explore" className="w-full max-w-[1200px] mx-auto px-4 py-8 flex flex-col gap-6">
        
        {/* Section Title */}
        <div className="flex items-center justify-between text-left">
          <div className="flex flex-col">
            <h2 className="text-2xl font-black tracking-tight text-[#1b2045]">Top Communities</h2>
            <p className="text-xs text-[#787878] mt-0.5">
              Showing top 20 of {filteredCommunities.length} verified communities
            </p>
          </div>

          {(selectedCategory || selectedSubCategory || selectedTag || showNsfwOnly) && (
            <button
              onClick={handleClearFilters}
              className="text-xs font-bold text-[#005bf8] hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Filter Bar */}
        <FilterBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          selectedSubCategory={selectedSubCategory}
          selectedTag={selectedTag}
          selectedType={selectedType}
          showNsfwOnly={showNsfwOnly}
          onToggleNsfw={() => setShowNsfwOnly(prev => !prev)}
          onSelectType={setSelectedType}
          onClearFilters={handleClearFilters}
          onClearSubCategory={() => setSelectedSubCategory(null)}
          onClearTag={() => setSelectedTag(null)}
          totalResults={filteredCommunities.length}
        />

        {/* Community Cards Grid (20 max) */}
        {displayedCommunities.length > 0 ? (
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
              {displayedCommunities.map(community => (
                <CommunityCard 
                  key={community.id}
                  community={community}
                  isBookmarked={bookmarkedIds.includes(community.id)}
                  isUpvoted={upvotedIds.includes(community.id)}
                  onToggleBookmark={handleToggleBookmark}
                  onUpvote={handleUpvote}
                  onOpenPreview={handleOpenPreview}
                />
              ))}
            </div>

            {/* View More Communities CTA Button */}
            <div className="w-full flex flex-col items-center justify-center pt-4 pb-2">
              <button
                onClick={() => setIsCategoriesModalOpen(true)}
                className="group bg-gradient-to-r from-[#005bf8] to-[#0047c9] hover:from-[#0047c9] hover:to-[#0038a8] text-white font-extrabold text-sm px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 active:scale-95 cursor-pointer"
              >
                <Layers className="size-4 text-blue-200 group-hover:rotate-12 transition-transform" />
                <span>View All Categories & Communities ({communities.length}+)</span>
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <span className="text-xs text-[#787878] mt-2 font-medium">
                Explore hundreds of groups across 10+ parent domains
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[32px] p-12 border border-[#e9e9e9] text-center flex flex-col items-center justify-center my-8 shadow-sm">
            <div className="size-16 rounded-full bg-[#f0f4ff] text-[#005bf8] flex items-center justify-center mb-3">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-lg font-extrabold text-[#1b2045]">No communities found</h3>
            <p className="text-xs text-[#787878] mt-1 max-w-sm">
              We couldn't find any communities matching your active filters. Try searching for another topic or reset filters.
            </p>
            <button 
              onClick={handleClearFilters}
              className="mt-4 bg-[#005bf8] text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-md hover:bg-[#0047c9] transition-all"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </main>

      {/* How TGRadar Works Section */}
      <HowItWorks />

      {/* Newsletter Signup Callout Box */}
      <Newsletter />

      {/* Footer */}
      <Footer 
        onOpenSubmit={handleOpenSubmit} 
        onOpenAnalytics={() => {
          setShowAnalytics(true);
          window.location.hash = '/analytics';
        }} 
      />

      {/* Detail Preview Modal */}
      <CommunityModal 
        community={previewCommunity}
        isOpen={Boolean(previewCommunity)}
        onClose={() => setPreviewCommunity(null)}
        isBookmarked={previewCommunity ? bookmarkedIds.includes(previewCommunity.id) : false}
        isUpvoted={previewCommunity ? upvotedIds.includes(previewCommunity.id) : false}
        onToggleBookmark={handleToggleBookmark}
        onUpvote={handleUpvote}
      />

      {/* Submit Community Modal */}
      <SubmitModal 
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmitCommunity={handleAddCommunity}
      />

      {/* Deep Category Directory Explorer Modal */}
      <CategoriesModal 
        isOpen={isCategoriesModalOpen}
        onClose={() => setIsCategoriesModalOpen(false)}
        communities={communities}
        bookmarkedIds={bookmarkedIds}
        upvotedIds={upvotedIds}
        onToggleBookmark={handleToggleBookmark}
        onUpvote={handleUpvote}
        onOpenPreview={handleOpenPreview}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSelectedSubCategory(null);
          setSelectedTag(null);
        }}
        onSelectSubCategory={(sub) => setSelectedSubCategory(sub)}
        onSelectTag={(tag) => setSelectedTag(tag)}
      />

      {/* Saved Bookmarks Drawer */}
      <BookmarksDrawer 
        isOpen={isBookmarksDrawerOpen}
        onClose={() => setIsBookmarksDrawerOpen(false)}
        bookmarkedCommunities={communities.filter(c => bookmarkedIds.includes(c.id))}
        onToggleBookmark={handleToggleBookmark}
        onOpenPreview={handleOpenPreview}
      />


    </div>
  );
}
