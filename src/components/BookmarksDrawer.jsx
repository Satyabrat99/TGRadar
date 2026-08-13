import React from 'react';
import { X, Trash2, ExternalLink, Bookmark } from 'lucide-react';

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
              <div 
                key={item.id}
                onClick={() => { onOpenPreview(item); onClose(); }}
                className="bg-white border border-[#e9e9e9] rounded-[20px] p-3.5 flex items-center justify-between gap-3 shadow-sm hover:border-[#005bf8] hover:shadow-md transition-all cursor-pointer group"
              >
                {/* Info block */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-10 rounded-xl overflow-hidden border border-[#e9e9e9] flex-shrink-0 bg-gray-50">
                    <img 
                      src={item.avatar} 
                      alt={item.title} 
                      className="size-full object-cover"
                    />
                  </div>
                  
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-extrabold text-[#1b2045] tracking-tight truncate leading-tight group-hover:text-[#005bf8] transition-colors">
                      {item.title}
                    </span>
                    <span className="text-[10px] font-semibold text-[#787878] mt-0.5">
                      @{item.username}
                    </span>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  <a
                    href={item.link}
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
