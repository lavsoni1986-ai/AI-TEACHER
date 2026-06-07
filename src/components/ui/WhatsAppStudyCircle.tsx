interface WhatsAppStudyCircleProps {
  className?: string;
}

export default function WhatsAppStudyCircle({ className = "" }: WhatsAppStudyCircleProps) {
  const whatsappJoinMsg = encodeURIComponent(
    "Namaste! Main BharatOS Study Circle join karna chahta/chahti hoon.\nMera naam: \nClass: \nSubject jisme help chahiye:"
  );

  return (
    <div className={`rounded-2xl bg-gradient-to-br from-emerald-950/20 to-slate-900/60 border border-emerald-700/30 p-5 space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xl shrink-0">
          💬
        </div>
        <div>
          <div className="text-sm font-black text-white">BharatOS Study Circle</div>
          <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
            Free WhatsApp Study Group
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="space-y-2 text-xs text-slate-300 font-semibold">
        {[
          "📅 रोज सुबह 7 बजे — NCERT का एक Important Topic",
          "📝 हफ्ते में एक Mock Test — Result तुरंत",
          "❓ Doubt पूछो — AI Teacher 24x7 जवाब देगा",
          "👨‍👩‍👧 Parents देख सकते हैं — बच्चा कहाँ है",
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="shrink-0 mt-0.5">{item.split(" ")[0]}</span>
            <span>{item.slice(item.indexOf(" ") + 1)}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-emerald-900/40 pt-3 space-y-2">
        <div className="text-[10px] text-center text-slate-500 font-bold uppercase tracking-widest">
          📚 Class के हिसाब से Group
        </div>
        <div className="grid grid-cols-3 gap-1.5 text-center text-[9px] font-black">
          {["Class 8–9", "Class 10", "Class 11–12"].map((cls) => (
            <div
              key={cls}
              className="rounded-lg bg-emerald-950/40 border border-emerald-800/30 py-1.5 text-emerald-400"
            >
              {cls}
            </div>
          ))}
        </div>
      </div>

      {/* Join Button */}
      <a
        href={`https://wa.me/919753239303?text=${whatsappJoinMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-black transition-colors shadow-[0_4px_15px_rgba(16,185,129,0.3)]"
      >
        <span>📱</span>
        <span>Join करें — बिल्कुल Free</span>
      </a>

      <p className="text-[9px] text-center text-slate-600 font-semibold">
        कोई App नहीं · कोई Login नहीं · सिर्फ WhatsApp
      </p>
    </div>
  );
}
