import React, { useState, useEffect } from 'react';
import { 
  ArrowUp, 
  Bookmark, 
  Eye, 
  Users, 
  Star 
} from 'lucide-react';
import Badge from './ui/Badge';
import VerifiedBadge from './ui/VerifiedBadge';
import { getRotatedGradient } from '../utils/telegramAvatar';

export default function CommunityCard({ 
  community, 
  isBookmarked, 
  isUpvoted, 
  onToggleBookmark, 
  onUpvote, 
  onOpenPreview 
}) {
  const [upvoteAnimating, setUpvoteAnimating] = useState(false);
  const cleanUsername = (community.username || '').replace('@', '').trim().toLowerCase();

  // Helper to determine if we have a valid custom/Supabase avatar URL
  const hasValidAvatar = community.avatar && 
                         !community.avatar.includes('unavatar.io') && 
                         community.avatar.trim() !== '';

  const [imgUrl, setImgUrl] = useState(hasValidAvatar ? community.avatar : '');
  const [useFallbackBadge, setUseFallbackBadge] = useState(!hasValidAvatar);

  useEffect(() => {
    const valid = community.avatar && 
                  !community.avatar.includes('unavatar.io') && 
                  community.avatar.trim() !== '';
    
    if (valid) {
      setImgUrl(community.avatar);
      setUseFallbackBadge(false);
    } else {
      setImgUrl('');
      setUseFallbackBadge(true);
    }
  }, [cleanUsername, community.avatar]);

  const handleImageError = () => {
    // If the hosted avatar image fails to load, trigger fallback initials badge immediately
    setUseFallbackBadge(true);
  };

  const handleUpvote = (e) => {
    e.stopPropagation();
    setUpvoteAnimating(true);
    onUpvote(community.id);
    setTimeout(() => setUpvoteAnimating(false), 300);
  };

  const formatMembers = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num;
  };

  const cardGradient = community.bannerBg && !community.bannerBg.includes('#005bf8') 
    ? community.bannerBg 
    : getRotatedGradient(community.username);

  const initials = community.title
    ? community.title.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
    : 'TG';

  return (
    <div 
      onClick={() => onOpenPreview(community)}
      className="bg-white rounded-[24px] border border-[#e9e9e9] overflow-hidden flex flex-col justify-between text-left shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
    >
      
      {/* Dynamic Rotating Premium 3D Mesh Gradient Cover Header */}
      <div 
        className="h-24 w-full relative overflow-hidden flex items-center justify-end p-3 transition-all duration-500"
        style={{ background: cardGradient }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Bookmark Action Button on Top Right */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleBookmark(community.id); }}
          className="relative z-10 size-8 rounded-full bg-white/85 backdrop-blur-md hover:bg-white text-[#1b2045] flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer"
          title="Bookmark Community"
        >
          <Bookmark className="size-3.5 fill-current" style={{ fillOpacity: isBookmarked ? 1 : 0 }} />
        </button>
      </div>

      {/* Main Body with Avatar Overlay */}
      <div className="p-5 pt-0 flex flex-col gap-3 relative flex-1">
        
        {/* Circular Avatar Overlaid on Cover Boundary */}
        <div className="-mt-7 mb-1 flex items-end justify-between">
          <div className="size-14 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-white flex-shrink-0 relative flex items-center justify-center">
            {!useFallbackBadge ? (
              <img 
                src={imgUrl} 
                alt={community.title} 
                className="size-full object-cover"
                onError={handleImageError}
              />
            ) : (
              <div 
                className="size-full flex items-center justify-center text-white font-black text-sm tracking-wider"
                style={{ background: '#005bf8' }}
              >
                {initials}
              </div>
            )}
          </div>

          <Badge variant="glacial" size="sm">
            {community.category ? community.category.split(' ')[0] : 'General'}
          </Badge>
        </div>

        {/* Title & Official Telegram Verified Blue Tick Rosette */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <h3 className="text-base font-extrabold text-[#1b2045] tracking-tight leading-snug group-hover:text-[#005bf8] transition-colors">
              {community.title}
            </h3>
            {community.verified && (
              <VerifiedBadge size={16} />
            )}
          </div>
          <span className="text-xs text-[#787878] font-medium mt-0.5">
            @{community.username}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-[#555555] leading-relaxed line-clamp-2">
          {community.description}
        </p>

      </div>

      {/* Footer Stats Row */}
      <div className="px-5 py-3.5 bg-[#fafafa] border-t border-[#e9e9e9] flex items-center justify-between text-xs font-semibold text-[#1b2045]">
        
        {/* Left Metrics */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[#787878]">
            <Users className="size-3.5 text-[#005bf8]" />
            {formatMembers(community.subscribers)}
          </span>
          
          <span className="flex items-center gap-1 text-[#005bf8]">
            <Star className="size-3.5 fill-current text-amber-500" />
            {community.rating || 4.8}
          </span>
        </div>

        {/* Right Upvote & Preview Controls */}
        <div className="flex items-center gap-2">
          
          {/* Horizontal Upvote Pill Button */}
          <button
            onClick={handleUpvote}
            className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 transition-all shadow-sm active:scale-95 cursor-pointer ${
              upvoteAnimating ? 'scale-105' : ''
            } ${
              isUpvoted 
                ? 'bg-[#005bf8] text-white border border-[#005bf8] shadow-md' 
                : 'bg-[#f0f4ff] hover:bg-[#005bf8] hover:text-white text-[#005bf8] border border-[#dbe6fe]'
            }`}
            title="Upvote Community"
          >
            <ArrowUp className="size-3.5 stroke-[2.5] flex-shrink-0" />
            <span>{community.upvotes + (isUpvoted ? 1 : 0)}</span>
          </button>

          {/* Quick View Icon */}
          <button
            onClick={(e) => { e.stopPropagation(); onOpenPreview(community); }}
            className="p-1.5 rounded-full hover:bg-gray-200 text-[#787878] transition-colors cursor-pointer"
            title="Quick View Details"
          >
            <Eye className="size-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
