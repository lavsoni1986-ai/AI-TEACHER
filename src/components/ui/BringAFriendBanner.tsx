interface BringAFriendBannerProps {
  className?: string;
}

export default function BringAFriendBanner({ className = "" }: BringAFriendBannerProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/30 via-slate-900/60 to-slate-950 p-5 space-y-4 ${className}`}>
      {/* Glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0">🎁</span>
        <div>
          <div className="text-sm font-black text-white">Bring a Friend — Fee Waived!</div>
          <div className="text-xs text-amber-400 font-bold mt-0.5">
            दो दोस्तों को लाओ → आपकी ₹200 Registration Fee माफ़
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {[
          { step: "1", text: "Workshop में 2 दोस्तों / classmates को साथ लाएं" },
          { step: "2", text: "Entry पर हमें उनका नाम बताएं" },
          { step: "3", text: "आपकी ₹200 Registration Fee तुरंत माफ़" },
        ].map((item) => (
          <div key={item.step} className="flex items-center gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-[10px] font-black text-amber-400">
              {item.step}
            </span>
            <span className="text-xs text-slate-300 font-semibold">{item.text}</span>
          </div>
        ))}
      </div>

      {/* Share CTA */}
      <a
        href={`https://wa.me/?text=${encodeURIComponent("🔥 Yaar, 14 June ko BharatOS Academy ka FREE AI Workshop hai Shahdol mein!\n\nAI se Maths, Science, English — sab easy ho jaayega!\n\nChalo saath chalte hain:\nhttps://bharatos-ai-teacher.vercel.app\n\n📞 9753239303")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-black hover:bg-emerald-500/30 transition-colors"
      >
        <span>📱</span>
        <span>WhatsApp पर दोस्तों को Share करें</span>
      </a>

      <p className="text-[9px] text-center text-slate-600 font-semibold">
        * Offer valid on entry at workshop venue · 14 June 2026 · BharatOS Academy, Shahdol
      </p>
    </div>
  );
}
