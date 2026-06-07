interface ParentFAQCardProps {
  className?: string;
}

const faqs = [
  {
    q: "AI mere bachche ki padhai me kaise madad karega?",
    a: "AI Teacher हर सवाल को आसान भाषा में step-by-step हल करता है और 24x7 डाउट क्लियर करता है।"
  },
  {
    q: "Maths aur Science me kaise support karega?",
    a: "कठिन कॉन्सेप्ट्स को आसान उदाहरणों और लॉजिक के साथ समझाकर पढ़ाई को रोचक बनाता है।"
  },
  {
    q: "Kya Coding sabko seekhna zaruri hai?",
    a: "बिल्कुल नहीं! हमारा 'Smart Study Assistant' सिर्फ School की पढ़ाई और बोर्ड परीक्षा के लिए है।"
  },
  {
    q: "Kya AI teacher school teacher ko replace karega?",
    a: "नहीं, AI टीचर एक 'Study Assistant' है जो स्कूल और टीचर्स की पढ़ाई को घर पर और मजबूत बनाता है।"
  },
  {
    q: "Degree aur skill me kya difference hai?",
    a: "डिग्री आपको कॉलेज से मिलती है, लेकिन प्रैक्टिकल 'Skills' और 'Confidence' से भविष्य बनता है।"
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
