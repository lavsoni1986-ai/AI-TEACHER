interface FounderVisionCardProps {
  className?: string;
}

export default function FounderVisionCard({ className = "" }: FounderVisionCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-cyan-900/40 bg-gradient-to-br from-[#010d14] via-slate-900/80 to-slate-950 p-6 space-y-5 ${className}`}>
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Vision Statement */}
      <div className="text-center space-y-3 relative">
        <div className="text-[10px] font-black text-cyan-500/80 uppercase tracking-[0.25em]">
          हमारा सपना
        </div>
        <blockquote className="text-lg md:text-xl font-black text-white leading-snug">
          "Shahdol का पहला student
          <br />
          जिसने AI से Board में{" "}
          <span className="text-cyan-400">90% लाया।"</span>
        </blockquote>
        <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-sm mx-auto">
          Technology दिखाना हमारा काम नहीं।<br />
          <strong className="text-slate-200">बच्चों का भविष्य बनाना</strong> हमारा काम है।
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-800/60" />

      {/* The Why */}
      <div className="space-y-3">
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
          AI Teacher क्यों अलग है?
        </div>
        <div className="grid grid-cols-1 gap-2.5">
          {[
            {
              icon: "🌙",
              title: "रात 2 बजे भी जवाब देता है",
              desc: "Exam की रात doubt आए — AI Teacher हमेशा available है",
            },
            {
              icon: "❤️",
              title: "कभी झिड़कता नहीं",
              desc: "एक ही सवाल 10 बार पूछो — हर बार प्यार से समझाएगा",
            },
            {
              icon: "🎯",
              title: "हर बच्चे की अपनी speed",
              desc: "Fast learner हो या slow — हर किसी के लिए अलग approach",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/40"
            >
              <span className="text-xl shrink-0">{item.icon}</span>
              <div>
                <div className="text-xs font-black text-white">{item.title}</div>
                <div className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-0.5">
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-800/60" />

      {/* Founder Note */}
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-white font-black text-sm shrink-0">
          L
        </div>
        <div className="space-y-0.5">
          <div className="text-xs font-black text-white">Lav Soni</div>
          <div className="text-[10px] text-cyan-500 font-bold">Founder, BharatOS Academy · Shahdol</div>
          <p className="text-[10px] text-slate-500 font-semibold leading-relaxed pt-1">
            "हम Shahdol के बच्चों के लिए वो AI Teacher बना रहे हैं
            जो हर माँ-बाप चाहते हैं — patient, available, और सिर्फ आपके बच्चे पर focused।"
          </p>
        </div>
      </div>
    </div>
  );
}
