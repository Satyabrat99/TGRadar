import React from 'react';
import { Radar, Bookmark, PlusCircle } from 'lucide-react';

export default function Navbar({ bookmarksCount, onOpenBookmarks, onOpenSubmit }) {
  return (
    <header className="w-full max-w-[1200px] mx-auto px-4 pt-6 pb-2 relative z-30">
      <div className="bg-white/95 backdrop-blur-md rounded-full px-6 py-3 flex items-center justify-between shadow-lg border border-white/20">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2 cursor-pointer flex-shrink-0">
          <div className="size-8 rounded-full bg-[#005bf8] text-white flex items-center justify-center shadow-md">
            <Radar className="size-4" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-[#1b2045]">
            TG<span className="text-[#005bf8]">Radar</span>
          </span>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-[#4f4f4f]">
          <a href="#explore" className="hover:text-[#005bf8] transition-colors">Explore</a>
          <a href="#categories" className="hover:text-[#005bf8] transition-colors">Categories</a>
          <a href="#trending" className="hover:text-[#005bf8] transition-colors">Trending</a>
          <a href="#creators" className="hover:text-[#005bf8] transition-colors">For Creators</a>
          <a href="#blog" className="hover:text-[#005bf8] transition-colors">Blog</a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Saved Bookmarks Button */}
          <div className="relative inline-flex items-center justify-center">
            <button
              onClick={onOpenBookmarks}
              className="size-10 rounded-full bg-[#f0f4ff] hover:bg-[#e0ebff] text-[#005bf8] transition-all flex items-center justify-center flex-shrink-0 cursor-pointer shadow-sm active:scale-95"
              title="Saved Communities"
            >
              <Bookmark className="size-4" />
            </button>
            {bookmarksCount > 0 && (
              <span className="absolute -top-1 -right-1 size-5 bg-[#005bf8] text-white font-extrabold text-[10px] rounded-full flex items-center justify-center border-2 border-white shadow-md z-10 pointer-events-none">
                {bookmarksCount}
              </span>
            )}
          </div>

          {/* Submit Community CTA Button */}
          <button
            onClick={onOpenSubmit}
            className="bg-[#005bf8] hover:bg-[#004cd4] text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-md transition-all flex items-center gap-2 active:scale-95 whitespace-nowrap flex-shrink-0 cursor-pointer"
          >
            <PlusCircle className="size-4 flex-shrink-0" />
            <span>Submit Community</span>
          </button>
        </div>

      </div>
    </header>
  );
}
