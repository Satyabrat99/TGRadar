import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <section className="w-full max-w-[1200px] mx-auto px-4 pb-14">
      <div className="bg-gradient-to-r from-[#005bf8] to-[#0047c9] rounded-[30px] p-8 md:p-10 text-white flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
        
        {/* Left Info */}
        <div className="flex items-center gap-4 text-left">
          <div className="size-14 rounded-full bg-white/15 backdrop-blur-md text-white flex items-center justify-center flex-shrink-0 border border-white/20">
            <Mail className="size-6" />
          </div>
          
          <div className="flex flex-col">
            <h3 className="text-xl md:text-2xl font-extrabold tracking-tight !text-white text-white drop-shadow-sm">
              Stay in the Loop
            </h3>
            <p className="text-xs md:text-sm !text-white/90 text-white/90 mt-1 max-w-md font-normal leading-relaxed">
              Get weekly updates on new communities, trending topics, and exclusive insights.
            </p>
          </div>
        </div>

        {/* Right Input Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          {subscribed ? (
            <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-6 py-3.5 rounded-full text-xs font-bold flex items-center justify-center gap-2 animate-in fade-in">
              <CheckCircle2 className="size-4 text-emerald-300" />
              <span>Thanks for subscribing to TGRadar updates!</span>
            </div>
          ) : (
            <div className="bg-white rounded-full p-1.5 flex items-center gap-2 shadow-lg">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-transparent text-[#1b2045] placeholder-[#888888] text-xs font-medium px-4 py-2 focus:outline-none"
                required
              />
              <button
                type="submit"
                className="bg-[#005bf8] hover:bg-[#0047c9] text-white font-bold text-xs px-6 py-2.5 rounded-full shadow-md transition-all active:scale-95 whitespace-nowrap flex-shrink-0"
              >
                Subscribe
              </button>
            </div>
          )}
        </form>

      </div>
    </section>
  );
}
