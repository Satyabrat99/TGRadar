import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, TrendingUp } from 'lucide-react';

export default function SearchWithSuggestions({ searchVal, onSearchChange, communities = [], onOpenPreview }) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Reposition dropdown relative to input on open / resize
  useEffect(() => {
    function reposition() {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'fixed',
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
        zIndex: 99999,
      });
    }
    reposition();
    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);
    return () => {
      window.removeEventListener('resize', reposition);
      window.removeEventListener('scroll', reposition, true);
    };
  }, [open, focused]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const suggestions = useMemo(() => {
    if (!searchVal.trim() || searchVal.trim().length < 2) return [];
    const q = searchVal.toLowerCase().trim();
    return communities
      .filter(c =>
        c.title?.toLowerCase().includes(q) ||
        c.username?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q) ||
        c.tags?.some(t => t.toLowerCase().includes(q))
      )
      .slice(0, 6);
  }, [searchVal, communities]);

  const trendingSuggestions = useMemo(() => {
    if (searchVal.trim().length > 0) return [];
    return [...communities]
      .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
      .slice(0, 5);
  }, [searchVal, communities]);

  const visibleSuggestions = suggestions.length > 0 ? suggestions : trendingSuggestions;
  const showDropdown = open && focused && visibleSuggestions.length > 0;

  function handleSelect(community) {
    onSearchChange(community.title);
    setOpen(false);
    inputRef.current?.blur();
    if (onOpenPreview) {
      onOpenPreview(community);
    }
  }


  function handleClear() {
    onSearchChange('');
    inputRef.current?.focus();
  }

  const highlight = (text, query) => {
    if (!query.trim()) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-[#005bf8]/15 text-[#005bf8] rounded font-black not-italic">
          {text.slice(idx, idx + query.length)}
        </mark>
        {text.slice(idx + query.length)}
      </>
    );
  };

  const dropdown = showDropdown && createPortal(
    <div
      style={dropdownStyle}
      className="bg-white rounded-[20px] shadow-2xl border border-[#e9e9e9] overflow-hidden"
    >
      {/* Header label */}
      <div className="px-4 pt-3 pb-1 flex items-center gap-1.5">
        {suggestions.length > 0 ? (
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#787878]">Suggestions</span>
        ) : (
          <>
            <TrendingUp className="size-3 text-[#005bf8]" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#787878]">Trending Now</span>
          </>
        )}
      </div>

      {visibleSuggestions.map((c, i) => {
        const hasAvatar = c.avatar && !c.avatar.includes('unavatar.io');
        const initials = c.title?.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || 'TG';
        return (
          <button
            key={c.id || i}
            onMouseDown={() => handleSelect(c)}
            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#f0f4ff] transition-colors text-left group"
          >
            {/* Mini Avatar */}
            <div className="size-8 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center bg-[#005bf8] text-white text-[10px] font-black">
              {hasAvatar ? (
                <img
                  src={c.avatar}
                  alt={c.title}
                  className="size-full object-cover"
                  onError={e => { e.target.style.display = 'none'; e.target.parentNode.textContent = initials; }}
                />
              ) : initials}
            </div>

            {/* Info */}
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-xs font-extrabold text-[#1b2045] truncate group-hover:text-[#005bf8] transition-colors">
                {highlight(c.title || '', searchVal)}
              </span>
              <span className="text-[10px] text-[#787878] font-medium truncate">
                @{c.username} · {c.category?.split(' ')[0]}
              </span>
            </div>

            {/* Member count */}
            <span className="text-[10px] font-bold text-[#005bf8] bg-[#f0f4ff] px-2 py-0.5 rounded-full flex-shrink-0">
              {c.subscribers >= 1000000
                ? (c.subscribers / 1000000).toFixed(1) + 'M'
                : c.subscribers >= 1000
                  ? Math.floor(c.subscribers / 1000) + 'K'
                  : c.subscribers}
            </span>
          </button>
        );
      })}

      {/* Footer hint */}
      <div className="px-4 py-2 border-t border-[#f0f0f0] text-[10px] text-[#aaa] font-medium">
        Press Enter or click Search to see all results
      </div>
    </div>,
    document.body
  );

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search Input Pill */}
      <div className={`bg-white rounded-full p-2 flex items-center gap-3 shadow-2xl border transition-all duration-200 ${focused ? 'border-[#005bf8]/50 shadow-[0_0_0_3px_rgba(0,91,248,0.15)]' : 'border-white/30'}`}>
        <div className="pl-3 sm:pl-4 text-[#787878] flex-shrink-0">
          <Search className="size-4 sm:size-5" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchVal}
          onChange={(e) => { onSearchChange(e.target.value); setOpen(true); }}
          onFocus={() => { setFocused(true); setOpen(true); }}
          onBlur={() => setFocused(false)}
          placeholder="Search channels, groups, bots..."
          className="flex-1 bg-transparent text-[#1b2045] placeholder-[#888888] text-xs sm:text-sm focus:outline-none py-2 font-medium min-w-0"
          autoComplete="off"
        />
        {searchVal && (
          <button onClick={handleClear} className="text-[#aaa] hover:text-[#1b2045] transition-colors p-1 flex-shrink-0">
            <X className="size-4" />
          </button>
        )}
        <button
          onClick={() => { setOpen(false); inputRef.current?.blur(); }}
          className="bg-[#005bf8] hover:bg-[#0047c9] text-white font-bold text-xs px-3 sm:px-6 py-2 sm:py-3 rounded-full transition-all shadow-md active:scale-95 whitespace-nowrap flex-shrink-0 cursor-pointer"
        >
          Search
        </button>


      </div>

      {/* Portal dropdown — renders outside all overflow:hidden parents */}
      {dropdown}
    </div>
  );
}
