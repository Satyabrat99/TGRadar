import React from 'react';
import { Search, ShieldCheck, Bookmark, Users } from 'lucide-react';

const STEPS = [
  {
    icon: Search,
    title: "Search",
    desc: "Find communities by keywords or categories"
  },
  {
    icon: ShieldCheck,
    title: "Verify",
    desc: "We verify safety, activity & quality"
  },
  {
    icon: Bookmark,
    title: "Explore",
    desc: "Browse top communities with confidence"
  },
  {
    icon: Users,
    title: "Join & Engage",
    desc: "Connect, learn & grow together"
  }
];

export default function HowItWorks() {
  return (
    <section className="w-full max-w-[1200px] mx-auto px-4 py-10">
      <div className="bg-[#f4f7fc] border border-[#e2e8f5] rounded-[30px] p-8 text-center">
        
        <h3 className="text-xl font-extrabold text-[#1b2045] tracking-tight mb-8">
          How TGRadar Works
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="flex items-center gap-3.5 text-left bg-white p-4 rounded-[20px] border border-[#e9e9e9] shadow-sm">
                <div className="size-11 rounded-full bg-[#005bf8]/10 text-[#005bf8] flex items-center justify-center flex-shrink-0">
                  <Icon className="size-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#1b2045] leading-tight">
                    {step.title}
                  </span>
                  <span className="text-xs text-[#787878] mt-0.5 leading-snug">
                    {step.desc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
