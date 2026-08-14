import React, { useState } from 'react';
import { X, Trash2, ExternalLink, Bookmark, Users } from 'lucide-react';
import VerifiedBadge from './ui/VerifiedBadge';
import Badge from './ui/Badge';

function BookmarkItem({ item, onOpenPreview, onToggleBookmark, onClose }) {
  const cleanUsername = (item.username || '').replace('@', '').trim().toLowerCase();
  
  const hasValidAvatar = item.avatar && 
                         !item.avatar.includes('unavatar.io') && 
                         item.avatar.trim() !== '';

  const [imgUrl, setImgUrl] = useState(hasValidAvatar ? item.avatar : '');
  const [useFallbackBadge, setUseFallbackBadge] = useState(!hasValidAvatar);

  const initials = item.title
    ? item.title.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
    : 'TG';

  const formatMembers = (num) => {
    if (!num) return '1K';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num;
  };

  return (
    <div 
      onClick={() => { onOpenPreview(item); onClose(); }}
      className="bg-white border border-[#e9e9e9] rounded-[22px] p-3.5 flex items-center justify-between gap-3 shadow-sm hover:border-[#005bf8] hover:shadow-md transition-all cursor-pointer group"
    >
      {/* Info block */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Avatar identical to CommunityCard */}
        <div className="size-12 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-white flex-shrink-0 relative flex items-center justify-center">
          {!useFallbackBadge && imgUrl ? (
            <img 
              src={imgUrl} 
              alt={item.title} 
              onError={() => setUseFallbackBadge(true)}
              className="size-full object-cover"
            />
          ) : (
            <div 
              className="size-full flex items-center justify-center text-white font-black text-xs tracking-wider"
              style={{ background: '#005bf8' }}
            >
              {initials}
            </div>
          )}
        </div>
        
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs font-extrabold text-[#1b2045] tracking-tight truncate leading-tight group-hover:text-[#005bf8] transition-colors">
              {item.title}
            </span>
            {item.verified && <VerifiedBadge size={13} />}
          </div>
          
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-semibold text-[#787878]">
              @{item.username}
            </span>
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#005bf8] bg-[#f0f4ff] px-1.5 py-0.5 rounded-md">
              <Users className="size-2.5" />
              {formatMembers(item.subscribers)}
            </span>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <a
          href={item.link || `https://t.me/${cleanUsername}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-xl bg-[#f0f4ff] border border-[#dbe6fe] hover:bg-[#005bf8] hover:text-white text-[#005bf8] transition-all"
          title="Join Channel"
        >
          <ExternalLink className="size-3.5" />
        </a>

        <button
          onClick={() => onToggleBookmark(item.id)}
          className="p-2 rounded-xl bg-gray-50 border border-[#e9e9e9] hover:border-red-300 text-[#787878] hover:text-red-600 transition-all cursor-pointer"
          title="Remove Bookmark"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </div>
  );
}


export default function BookmarksDrawer({ 
  isOpen, 
  onClose, 
  bookmarkedCommunities, 
  onToggleBookmark,
  onOpenPreview 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      
      {/* Background Overlay */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-[#1b2045]/40 backdrop-blur-sm transition-opacity"
      ></div>

      {/* Slide-out Drawer Panel */}
      <div className="relative w-full max-w-md bg-white border-l border-[#e9e9e9] h-full flex flex-col justify-between shadow-2xl relative z-10 animate-in slide-in-from-right duration-300 text-left">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e9e9e9]">
          <div className="flex items-center gap-2">
            <Bookmark className="size-4.5 text-[#005bf8] fill-[#005bf8]/10" />
            <h2 className="text-base font-extrabold text-[#1b2045] tracking-tight">Saved Communities ({bookmarkedCommunities.length})</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-[#787878] hover:text-[#1b2045] border border-[#e9e9e9] transition-all cursor-pointer"
            aria-label="Close Drawer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Drawer Body List */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3">
          {bookmarkedCommunities.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
              <div className="p-4 rounded-2xl bg-[#f0f4ff] text-[#005bf8] mb-3">
                <Bookmark className="size-6" />
              </div>
              <h4 className="text-sm font-extrabold text-[#1b2045] tracking-tight">No Saved Communities</h4>
              <p className="text-xs text-[#787878] mt-1.5 max-w-[200px] leading-relaxed font-medium">
                Click the bookmark icon on any community card to save it here for quick access.
              </p>
            </div>
          ) : (
            bookmarkedCommunities.map((item) => (
              <BookmarkItem 
                key={item.id}
                item={item}
                onOpenPreview={onOpenPreview}
                onToggleBookmark={onToggleBookmark}
                onClose={onClose}
              />
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-6 border-t border-[#e9e9e9]">
          <button
            onClick={onClose}
            className="w-full py-3 border border-[#e9e9e9] hover:border-[#1b2045] bg-[#f9f9f9] text-[#1b2045] rounded-full text-xs font-bold transition-all cursor-pointer"
          >
            Close Saved List
          </button>
        </div>

      </div>

    </div>
  );
}

