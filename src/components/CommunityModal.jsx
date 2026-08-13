import React from 'react';
import { 
  X, 
  ExternalLink, 
  Bookmark, 
  ArrowUp, 
  ShieldCheck, 
  Users, 
  Star, 
  Globe, 
  Calendar,
  Share2
} from 'lucide-react';
import Badge from './ui/Badge';
import VerifiedBadge from './ui/VerifiedBadge';

export default function CommunityModal({ 
  community, 
  isOpen, 
  onClose, 
  isBookmarked, 
  isUpvoted, 
  onToggleBookmark, 
  onUpvote 
}) {
  if (!isOpen || !community) return null;

  const formatMembers = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: community.title,
        text: `Check out ${community.title} on TGRadar!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      
      {/* Backdrop Dismiss */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Modal Surface Container */}
      <div className="bg-white rounded-[32px] w-full max-w-2xl border border-[#e9e9e9] shadow-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200 text-left">
        
        {/* Cover Header Banner */}
        <div 
          className="h-36 w-full relative flex items-start justify-between p-4"
          style={{ background: community.bannerBg || 'linear-gradient(135deg, #005bf8 0%, #3b82f6 50%, #1d4ed8 100%)' }}
        >
          <div className="absolute inset-0 bg-black/15"></div>

          <div className="relative z-10 flex items-center gap-2">
            <span className="bg-white/90 backdrop-blur-md text-[#1b2045] font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              {community.type}
            </span>
          </div>

          <div className="relative z-10 flex items-center gap-2">
            <button
              onClick={handleShare}
              className="size-9 rounded-full bg-white/85 backdrop-blur-md hover:bg-white text-[#1b2045] flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer"
              title="Share Community"
            >
              <Share2 className="size-4" />
            </button>

            <button
              onClick={onClose}
              className="size-9 rounded-full bg-white/85 backdrop-blur-md hover:bg-white text-[#1b2045] flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer"
              title="Close Modal"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 pt-0 relative flex flex-col gap-5">
          
          {/* Avatar Overlaid Header */}
          <div className="-mt-10 flex items-end justify-between">
            <div className="size-20 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white flex-shrink-0">
              <img 
                src={community.avatar} 
                alt={community.title} 
                className="size-full object-cover"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleBookmark(community.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  isBookmarked 
                    ? 'bg-[#005bf8] text-white border-[#005bf8] shadow-md' 
                    : 'bg-white text-[#1b2045] border-[#e9e9e9] hover:border-[#005bf8]'
                }`}
              >
                <Bookmark className="size-3.5 fill-current" style={{ fillOpacity: isBookmarked ? 1 : 0 }} />
                <span>{isBookmarked ? 'Saved' : 'Save'}</span>
              </button>

              <button
                onClick={() => onUpvote(community.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  isUpvoted 
                    ? 'bg-[#005bf8] text-white border-[#005bf8] shadow-md' 
                    : 'bg-[#f0f4ff] text-[#005bf8] border-[#dbe6fe] hover:bg-[#005bf8] hover:text-white'
                }`}
              >
                <ArrowUp className="size-3.5 stroke-[2.5]" />
                <span>{community.upvotes + (isUpvoted ? 1 : 0)}</span>
              </button>
            </div>
          </div>

          {/* Title & Verified Star Rosette */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-[#1b2045] tracking-tight">
                {community.title}
              </h2>
              {community.verified && (
                <VerifiedBadge size={20} />
              )}
            </div>
            <span className="text-sm font-semibold text-[#005bf8]">
              @{community.username}
            </span>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 bg-[#f8fafc] border border-[#e2e8f5] p-3.5 rounded-[20px]">
            <div className="flex flex-col items-center justify-center p-2 text-center border-r border-[#e2e8f5]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#787878] flex items-center gap-1">
                <Users className="size-3 text-[#005bf8]" />
                Subscribers
              </span>
              <span className="text-sm font-black text-[#1b2045] mt-0.5">
                {formatMembers(community.subscribers)}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-2 text-center border-r border-[#e2e8f5]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#787878] flex items-center gap-1">
                <Star className="size-3 text-amber-500 fill-current" />
                Rating
              </span>
              <span className="text-sm font-black text-[#1b2045] mt-0.5">
                {community.rating || 4.9} / 5.0
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-2 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#787878] flex items-center gap-1">
                <ShieldCheck className="size-3 text-emerald-600" />
                Safety Index
              </span>
              <span className="text-sm font-black text-emerald-600 mt-0.5">
                {community.safetyScore || 98}%
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#787878]">
              About Community
            </span>
            <p className="text-xs text-[#4f4f4f] leading-relaxed font-normal">
              {community.description}
            </p>
          </div>

          {/* Tags Row */}
          <div className="flex flex-wrap gap-1.5">
            {community.tags.map((tag) => (
              <Badge key={tag} variant="glacial" size="sm">
                #{tag}
              </Badge>
            ))}
          </div>

          {/* Meta Attributes */}
          <div className="flex items-center justify-between text-xs text-[#787878] pt-2 border-t border-[#f0f0f0]">
            <span className="flex items-center gap-1.5 font-medium">
              <Globe className="size-3.5" />
              Language: <strong className="text-[#1b2045]">{community.language || 'Global'}</strong>
            </span>

            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="size-3.5" />
              Indexed: <strong className="text-[#1b2045]">{community.created || '2024'}</strong>
            </span>
          </div>

          {/* Action CTA Button */}
          <a
            href={community.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#005bf8] hover:bg-[#0047c9] text-white font-extrabold text-sm py-3.5 rounded-full shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 mt-2"
          >
            <span>Open in Telegram</span>
            <ExternalLink className="size-4" />
          </a>

        </div>

      </div>
    </div>
  );
}
