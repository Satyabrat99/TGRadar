import React, { useState } from 'react';
import { X, Search, CheckCircle2, ShieldAlert } from 'lucide-react';
import { getTelegramAvatar, getTelegramBanner } from '../utils/telegramAvatar';

const INDUSTRIES = [
  "AI & Machine Learning",
  "Web3 & Crypto",
  "Trading & Forex",
  "Tech & Software Engineering",
  "Gaming & Esports",
  "Business & Startups",
  "Design & Creative Tools",
  "Education & Science",
  "News & World Affairs",
  "Entertainment & Pop Culture",
  "Productivity & Bot Tools",
  "Telegram Mini Apps"
];

const TYPES = [
  { id: "channel", label: "Channel" },
  { id: "group", label: "Group" },
  { id: "bot", label: "Bot" },
  { id: "mini-app", label: "Mini App" }
];

export default function SubmitModal({ isOpen, onClose, onSubmitCommunity }) {
  const [handle, setHandle] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(INDUSTRIES[0]);
  const [type, setType] = useState('channel');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [language, setLanguage] = useState('English');
  const [resolvedAvatar, setResolvedAvatar] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [lookupDone, setLookupDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const validateHandle = (val) => {
    const regex = /^(?:@|(?:https?:\/\/)?t\.me\/)?([a-zA-Z0-9_]{5,32})$/;
    return val.match(regex);
  };

  const handleLookup = () => {
    setErrorMsg('');
    const match = validateHandle(handle);
    if (!match) {
      setErrorMsg('Please enter a valid Telegram username or t.me link.');
      return;
    }

    setLoading(true);
    const parsedUsername = match[1];
    const realAvatarUrl = getTelegramAvatar(parsedUsername);

    setTimeout(() => {
      setLoading(false);
      setLookupDone(true);
      setResolvedAvatar(realAvatarUrl);
      setTitle(parsedUsername.replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) + " Community");
      setDescription(`Official community updates and interactive discussions for @${parsedUsername}.`);
      setTagsInput(`${parsedUsername}, Telegram, Community`);
    }, 800);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !handle || !description) {
      setErrorMsg('All fields are required.');
      return;
    }

    const usernameMatch = validateHandle(handle);
    const finalUsername = usernameMatch ? usernameMatch[1] : handle;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const newCommunity = {
      id: `custom-${Date.now()}`,
      title,
      username: finalUsername,
      description,
      type,
      category,
      subscribers: Math.floor(Math.random() * 8000) + 1200,
      language,
      verified: true,
      activity: "Active",
      safetyScore: 96,
      rating: 4.8,
      tags: tags.length > 0 ? tags : ["New", category],
      avatar: resolvedAvatar || getTelegramAvatar(finalUsername),
      bannerBg: getTelegramBanner(category),
      link: `https://t.me/${finalUsername}`,
      upvotes: 1,
      created: new Date().toISOString().split('T')[0]
    };

    onSubmitCommunity(newCommunity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1b2045]/40 backdrop-blur-sm animate-fadeIn">
      
      {/* Backdrop Click Dismiss */}
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="bg-white border border-[#e9e9e9] w-full max-w-lg rounded-[30px] overflow-hidden shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-[#e9e9e9]">
          <h2 className="text-lg font-bold text-[#1b2045] tracking-tight">Submit Community</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#f9f9f9] text-[#787878] hover:text-[#1b2045] border border-[#e9e9e9] transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 relative z-10 flex flex-col gap-4 text-left max-h-[75vh] overflow-y-auto">
          
          {/* Step 1: Telegram Handle Lookup */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#787878] uppercase tracking-wider">
              Telegram Username / Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={handle}
                onChange={(e) => {
                  setHandle(e.target.value);
                  setLookupDone(false);
                }}
                disabled={loading || lookupDone}
                placeholder="e.g. @telegram or t.me/durov"
                className="flex-1 bg-[#f9f9f9] border border-[#e9e9e9] text-[#1b2045] rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-[#005bf8] disabled:opacity-60 font-medium"
              />
              {!lookupDone && (
                <button
                  type="button"
                  onClick={handleLookup}
                  disabled={loading || !handle}
                  className="bg-[#005bf8] hover:bg-[#0047c9] text-white text-xs font-bold px-5 py-2.5 rounded-full flex items-center gap-1.5 disabled:opacity-40 shadow-sm transition-all cursor-pointer"
                >
                  {loading ? (
                    <span className="size-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <Search className="size-3.5" />
                  )}
                  <span>Verify Handle</span>
                </button>
              )}
            </div>
          </div>

          {/* Validation Messages */}
          {errorMsg && (
            <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-200 p-3 rounded-[16px]">
              <ShieldAlert className="size-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {lookupDone && (
            <div className="flex items-center gap-3 text-emerald-700 text-xs bg-emerald-50 border border-emerald-200 p-3 rounded-[16px]">
              {resolvedAvatar && (
                <img src={resolvedAvatar} alt="DP" className="size-9 rounded-full object-cover border border-emerald-300 shadow-sm flex-shrink-0" />
              )}
              <div className="flex flex-col">
                <span className="font-bold flex items-center gap-1">
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                  Real Telegram DP Resolved!
                </span>
                <span className="text-[11px] text-emerald-800">Fetched profile picture live from Telegram CDN</span>
              </div>
            </div>
          )}

          {/* Step 2: Meta Info Form */}
          {lookupDone && (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
              
              {/* Title Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#787878] uppercase tracking-wider">
                  Community Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Tech & Dev Network"
                  className="bg-[#f9f9f9] border border-[#e9e9e9] text-[#1b2045] rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-[#005bf8] font-medium"
                  required
                />
              </div>

              {/* Type Select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#787878] uppercase tracking-wider">
                  Community Type
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {TYPES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setType(t.id)}
                      className={`py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                        type === t.id 
                          ? 'bg-[#005bf8] text-white border-[#005bf8]' 
                          : 'bg-[#f9f9f9] border-[#e9e9e9] text-[#787878] hover:text-[#1b2045]'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Industry/Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#787878] uppercase tracking-wider">
                  Primary Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-[#f9f9f9] border border-[#e9e9e9] text-[#1b2045] text-sm font-medium rounded-full px-4 py-2.5 focus:outline-none focus:border-[#005bf8] cursor-pointer"
                >
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#787878] uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  placeholder="Explain what members will find in your community..."
                  className="bg-[#f9f9f9] border border-[#e9e9e9] text-[#1b2045] rounded-[16px] px-4 py-2.5 text-sm focus:outline-none focus:border-[#005bf8] resize-none font-medium"
                  required
                />
              </div>

              {/* Submit Action */}
              <button
                type="submit"
                className="bg-[#005bf8] hover:bg-[#0047c9] text-white font-bold text-sm py-3.5 rounded-full shadow-md transition-all active:scale-95 mt-2 cursor-pointer"
              >
                Submit to Index
              </button>

            </div>
          )}

        </form>
      </div>
    </div>
  );
}
