import React from "react";

export default function SkillPositioningBanner({ className = "" }: { className?: string }) {
  return (
    <div className={`p-5 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/20 to-slate-900/40 shadow-[0_0_15px_rgba(245,158,11,0.05)] ${className}`}>
      <div className="flex gap-4 items-start">
        <span className="text-3xl shrink-0">🎓</span>
        <div className="space-y-1.5">
          <div className="text-[11px] font-black text-amber-500 uppercase tracking-widest">Degree vs Practical Skill</div>
          <p className="text-sm md:text-base font-bold text-white leading-relaxed">
            "डिग्री (Degree) और डिप्लोमा की अपनी जगह है। <span className="text-amber-400">BharatOS Academy</span> का काम स्टूडेंट्स को Practical Skills, AI Skills और Future Skills देना है।"
          </p>
          <p className="text-xs md:text-sm text-amber-200/80 font-semibold mt-1">
            कॉलेज आपको डिग्री देता है। हम आपको उसे इस्तेमाल करने की प्रैक्टिकल स्किल (Practical Skill) सिखाते हैं।
          </p>
        </div>
      </div>
    </div>
  );
}
