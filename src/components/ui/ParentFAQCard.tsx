interface ParentFAQCardProps {
  className?: string;
}

const faqs = [
  {
    q: "AI se Maths kaise sudhrega?",
    a: "AI Teacher हर सवाल को step-by-step हल करता है और बार-बार समझाता है।"
  },
  {
    q: "Board Exam ki taiyari me kaise madad milegi?",
    a: "NCERT के सभी अध्याय, mock tests और revision notes AI से मिलते हैं।"
  },
  {
    q: "Roz kitna samay dena hoga?",
    a: "केवल 30 मिनट रोज — Mobile या Computer पर, घर से।"
  },
  {
    q: "Kya Coding zaruri hai?",
    a: "बिल्कुल नहीं! Smart Study Assistant सिर्फ School पढ़ाई के लिए है।"
  }
];

export default function ParentFAQCard({ className = "" }: ParentFAQCardProps) {
  return (
    <div className={`rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900/60 border border-slate-800/60 p-5 space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800/60">
        <span className="text-lg">🙋</span>
        <div>
          <div className="text-sm font-black text-white">Parents Frequently Ask</div>
          <div className="text-[10px] text-slate-500 font-semibold">अभिभावकों के सामान्य प्रश्न</div>
        </div>
      </div>

      {/* FAQ Items */}
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="flex gap-3 group">
            <span className="shrink-0 w-5 h-5 mt-0.5 rounded-full bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center text-[10px] font-black text-cyan-400">
              ✓
            </span>
            <div className="space-y-0.5">
              <div className="text-xs font-black text-slate-200">{faq.q}</div>
              <div className="text-[11px] text-slate-500 font-semibold leading-relaxed">{faq.a}</div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="pt-2 border-t border-slate-800/60 text-center">
        <a
          href="https://wa.me/919753239303"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-black text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <span>📱</span>
          <span>और प्रश्नों के लिए WhatsApp करें</span>
        </a>
      </div>
    </div>
  );
}
