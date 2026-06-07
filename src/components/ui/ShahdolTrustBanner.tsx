interface ShahdolTrustBannerProps {
  className?: string;
}

export default function ShahdolTrustBanner({ className = "" }: ShahdolTrustBannerProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-cyan-900/40 bg-gradient-to-r from-slate-950 via-[#01101a] to-slate-950 px-6 py-4 flex flex-col sm:flex-row items-center gap-3 shadow-[0_0_30px_rgba(0,242,254,0.04)] ${className}`}>
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,242,254,0.03)_0%,_transparent_70%)] pointer-events-none" />

      {/* Icon */}
      <div className="shrink-0 w-10 h-10 rounded-full bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center text-lg">
        🇮🇳
      </div>

      {/* Text */}
      <div className="text-center sm:text-left space-y-0.5">
        <div className="text-sm font-black text-white tracking-wide">
          Built in Shahdol for Shahdol Students
        </div>
        <div className="text-[10px] font-bold text-cyan-500/80 uppercase tracking-[0.15em]">
          BharatOS Academy · Shahdol, Madhya Pradesh
        </div>
      </div>

      {/* Right badge */}
      <div className="sm:ml-auto shrink-0">
        <span className="text-[9px] font-black text-cyan-400 border border-cyan-800/50 bg-cyan-950/30 px-2 py-0.5 rounded-md uppercase tracking-wider">
          🇮🇳 Sovereign EdTech
        </span>
      </div>
    </div>
  );
}
