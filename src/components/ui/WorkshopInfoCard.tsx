interface WorkshopInfoCardProps {
  className?: string;
}

export default function WorkshopInfoCard({ className = "" }: WorkshopInfoCardProps) {
  return (
    <div className={`rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900/80 border border-slate-700/60 p-5 space-y-4 shadow-[0_0_20px_rgba(255,128,8,0.05)] ${className}`}>
      {/* Title */}
      <div className="text-center space-y-1 pb-3 border-b border-slate-800/60">
        <div className="text-base font-black text-orange-400 tracking-wide">🔥 Mega AI Workshop</div>
        <div className="text-lg font-black text-white">14 June 2026 (Sunday)</div>
      </div>

      {/* Audience */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">For Whom:</div>
        {[
          "Classes 8th–12th Students",
          "Parents & Guardians",
          "AI & Computer Career Aspirants"
        ].map((item) => (
          <div key={item} className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
            <span className="text-emerald-400 font-black text-sm">✓</span>
            {item}
          </div>
        ))}
      </div>

      {/* Venue */}
      <div className="space-y-1 pt-1 border-t border-slate-800/60">
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Venue:</div>
        <div className="text-xs text-slate-300 font-semibold leading-relaxed">
          BharatOS Academy<br />
          SS Motors Complex, 2nd Floor<br />
          Banganga Road, Shahdol
        </div>
      </div>

      {/* Fee + Helpline */}
      <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-800/60">
        <div className="space-y-0.5">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Reg. Fee</div>
          <div className="text-xl font-black text-white">₹200</div>
        </div>
        <div className="space-y-0.5 text-right">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Helpline</div>
          <a
            href="tel:9753239303"
            className="text-base font-black text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            9753239303
          </a>
        </div>
      </div>
    </div>
  );
}
