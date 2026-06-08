"use client";

interface RegistrationCardProps {
  className?: string;
}

export default function RegistrationCard({ className = "" }: RegistrationCardProps) {
  const registered = parseInt(process.env.NEXT_PUBLIC_REGISTERED_COUNT || "1", 10);
  const total = parseInt(process.env.NEXT_PUBLIC_TOTAL_SEATS || "100", 10);
  const remaining = Math.max(0, total - registered);
  const fillPercent = Math.min(100, Math.round((registered / total) * 100));

  return (
    <div className={`rounded-2xl bg-gradient-to-br from-orange-950/30 to-slate-900/60 border border-orange-500/30 p-5 space-y-4 shadow-[0_0_20px_rgba(251,146,60,0.08)] ${className}`}>
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em]">
          🔥 Mega AI Workshop
        </div>
        <div className="text-base font-black text-white tracking-wide">
          14 June 2026 (Sunday)
        </div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Shahdol, M.P.
        </div>
      </div>

      {/* Seat Counter */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-3">
          <div className="text-xl font-black text-white">{total}</div>
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Total Seats</div>
        </div>
        <div className="rounded-xl bg-emerald-950/40 border border-emerald-800/40 p-3">
          <div className="text-xl font-black text-emerald-400">{registered}</div>
          <div className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider mt-0.5">Registered</div>
        </div>
        <div className="rounded-xl bg-orange-950/40 border border-orange-800/40 p-3">
          <div className="text-xl font-black text-orange-400">{remaining}</div>
          <div className="text-[9px] font-bold text-orange-600 uppercase tracking-wider mt-0.5">Remaining</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-[10px] font-bold">
          <span className="text-slate-500">Seats Filled</span>
          <span className="text-orange-400">{fillPercent}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-700"
            style={{ width: `${fillPercent}%` }}
          />
        </div>
        <div className="text-center text-[10px] text-slate-500 font-semibold">
          {remaining <= 20 && remaining > 0 ? (
            <span className="text-red-400 font-black animate-pulse">⚠️ केवल {remaining} सीटें शेष!</span>
          ) : remaining === 0 ? (
            <span className="text-red-500 font-black">सभी सीटें भर गई हैं!</span>
          ) : (
            <span>Book your seat before it's full</span>
          )}
        </div>
      </div>

      {/* Registration Fee */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
        <span className="text-xs text-slate-400 font-semibold">Registration Fee</span>
        <span className="text-lg font-black text-white">₹200</span>
      </div>
    </div>
  );
}
