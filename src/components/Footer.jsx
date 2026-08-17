import React from 'react';
import { Radar, Github, Send } from 'lucide-react';

export default function Footer({ onOpenSubmit, onOpenAnalytics }) {
  return (
    <footer className="w-full bg-[#202020] text-white relative z-10 pt-16 pb-20 border-t border-[#303030]">
      
      {/* Dark Band CTA & Newsletter Capture Unit */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 mb-16 text-center">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          <h3 className="text-2xl md:text-4xl font-bold !text-white text-white tracking-tight mb-4 leading-tight">
            Grow Your Telegram Community Today
          </h3>
          <p className="!text-[#bbbbbb] text-[#bbbbbb] text-sm md:text-base mb-8 max-w-lg leading-relaxed font-normal">
            List your public channels, discussion groups, automation bots, or interactive Mini Apps to reach thousands of active users globally.
          </p>
          
          <button
            onClick={onOpenSubmit}
            className="bg-white text-[#202020] hover:bg-[#cce2ff] hover:text-[#005bf8] px-6 py-3.5 rounded-full text-xs font-bold transition-all shadow-md flex items-center gap-2 active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <span>Submit Your Channel</span>
            <Send className="size-4" />
          </button>
        </div>
      </div>

      {/* Main Footer Links & Copyrights */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 border-t border-[#303030] pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#787878]">
        
        {/* Left Brand */}
        <div className="flex items-center gap-2.5 select-none">
          <div className="p-1.5 rounded-full bg-[#005bf8] text-white">
            <Radar className="size-4" />
          </div>
          <span className="font-bold text-sm tracking-tight !text-white text-white">
            TG<span className="text-[#005bf8]">Radar</span>
          </span>
          <span className="text-[11px] text-[#787878]">© 2026 TGRadar. All rights reserved.</span>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 uppercase tracking-wider text-[11px] text-[#bbbbbb]">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <button 
            onClick={onOpenAnalytics}
            className="hover:text-white transition-colors cursor-pointer uppercase tracking-wider text-[11px] text-[#bbbbbb]"
          >
            Analytics
          </button>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-3">
          <a 
            href="https://github.com/Satyabrat99/TGRadar" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2.5 rounded-full bg-[#303030] text-[#bbbbbb] hover:text-white transition-all"
            aria-label="GitHub Repository"
          >
            <Github className="size-4" />
          </a>
          <a 
            href="https://t.me/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2.5 rounded-full bg-[#303030] text-[#bbbbbb] hover:text-white transition-all"
            aria-label="Telegram"
          >
            <Send className="size-4" />
          </a>
        </div>

      </div>

    </footer>
  );
}
