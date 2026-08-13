import React from 'react';
import CommunityCard from './CommunityCard';
import { SearchX, PlusCircle, ArrowRight } from 'lucide-react';

export default function CommunityGrid({ 
  communities, 
  bookmarks, 
  upvotes, 
  onToggleBookmark, 
  onUpvote, 
  onOpenPreview,
  onOpenSubmit
}) {
  if (communities.length === 0) {
    return (
      <div className="w-full max-w-[1200px] mx-auto px-4 py-16">
        <div className="bg-white rounded-[30px] border border-[#e9e9e9] max-w-xl mx-auto p-10 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="p-4 rounded-full bg-[#005bf8]/10 text-[#005bf8] mb-4">
            <SearchX className="size-8" />
          </div>
          <h3 className="text-xl font-extrabold text-[#1b2045] tracking-tight">No Communities Found</h3>
          <p className="text-xs text-[#666666] mt-2 max-w-sm font-normal leading-relaxed">
            We couldn't find any Telegram communities matching your search or filters. Try adjusting your query or submit a new hub!
          </p>
          <button
            onClick={onOpenSubmit}
            className="bg-[#005bf8] hover:bg-[#0047c9] text-white text-xs font-bold px-5 py-3 rounded-full flex items-center gap-2 mt-6 shadow-md transition-all active:scale-95"
          >
            <PlusCircle className="size-4" />
            <span>Submit a Community</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full max-w-[1200px] mx-auto px-4 pt-6 pb-12">
      
      {/* Header Row */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col text-left">
          <h2 className="text-xl font-extrabold text-[#1b2045] tracking-tight">Top Communities</h2>
          <p className="text-xs text-[#787878] mt-0.5">Handpicked communities with great content and active members</p>
        </div>
        
        <a href="#explore" className="text-xs font-semibold text-[#005bf8] hover:underline flex items-center gap-1">
          <span>View all communities</span>
          <ArrowRight className="size-3.5" />
        </a>
      </div>

      {/* 4-Column Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {communities.map((community) => (
          <CommunityCard
            key={community.id}
            community={community}
            isBookmarked={bookmarks.includes(community.id)}
            isUpvoted={upvotes.includes(community.id)}
            onToggleBookmark={onToggleBookmark}
            onUpvote={onUpvote}
            onOpenPreview={onOpenPreview}
          />
        ))}
      </div>

    </section>
  );
}
