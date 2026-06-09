"use client";

import { useState } from "react";
import HexagonTreeLogo from "@/components/ui/HexagonTreeLogo";

const FOUNDER_PHONE = "919753239303"; // WhatsApp number

const CLASS_OPTIONS = [
  "Class 6", "Class 7", "Class 8",
  "Class 9", "Class 10", "Class 11", "Class 12",
  "College / Other"
];

export default function RegisterPage() {
  const [name, setName]     = useState("");
  const [klass, setKlass]   = useState("");
  const [school, setSchool] = useState("");
  const [phone, setPhone]   = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]   = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("कृपया अपना नाम दर्ज करें।"); return; }
    if (!klass)       { setError("कृपया अपनी क्लास चुनें।");   return; }
    if (!school.trim()){ setError("कृपया स्कूल का नाम दर्ज करें।"); return; }
    if (!phone.trim() || phone.length < 10) { setError("कृपया सही मोबाइल नंबर दर्ज करें।"); return; }
    setError("");

    // Save to localStorage for the student's own device
    localStorage.setItem("bharatos_name",   name.trim());
    localStorage.setItem("bharatos_class",  klass);
    localStorage.setItem("bharatos_school", school.trim());

    // Generate WhatsApp message to founder
    const msg = `🎓 *BHARATOS NEW STUDENT REGISTRATION*

👤 Name   : ${name.trim()}
📖 Class  : ${klass}
🏫 School : ${school.trim()}
📱 Phone  : ${phone.trim()}
📅 Date   : ${new Date().toLocaleDateString("hi-IN", { day: "2-digit", month: "short", year: "numeric" })}
🕐 Time   : ${new Date().toLocaleTimeString("hi-IN", { hour: "2-digit", minute: "2-digit" })}

✅ Source: BharatOS Registration Page
🌐 URL: bharatos-ai-teacher.vercel.app`;

    const url = `https://wa.me/${FOUNDER_PHONE}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 py-10 text-white text-center space-y-6">
        <HexagonTreeLogo size={64} />
        <div className="space-y-3">
          <div className="text-5xl">🎉</div>
          <h1 className="text-3xl font-black text-white">Registration Complete!</h1>
          <p className="text-slate-400 font-semibold text-sm max-w-sm mx-auto">
            आपकी जानकारी हमारे पास पहुँच गई है। अब अपना AI Teacher शुरू करें।
          </p>
        </div>
        <a
          href="/profile"
          className="inline-block px-8 py-4 font-black text-base text-slate-950 bg-gradient-to-r from-[#ff8008] to-[#ffc837] rounded-2xl hover:opacity-90 transition-opacity"
        >
          🎓 AI Teacher शुरू करें →
        </a>
        <p className="text-[10px] text-slate-600">BharatOS Academy · Shahdol · जहाँ Teacher खुद AI है</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-10">
      {/* Background glow */}
      <div className="fixed top-1/3 left-10 w-72 h-72 bg-orange-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/3 right-10 w-72 h-72 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg bg-slate-900/70 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl backdrop-blur-xl">

        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <HexagonTreeLogo size={54} />
          <div>
            <div className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em]">🔥 Free Registration</div>
            <h1 className="text-2xl font-black text-white mt-1">BharatOS Academy</h1>
            <p className="text-xs text-slate-400 font-semibold mt-1">Shahdol का अपना AI Teacher — अभी Join करें</p>
          </div>
        </div>

        {/* Workshop Badge */}
        <div className="flex items-center gap-3 bg-orange-950/30 border border-orange-800/40 rounded-2xl px-4 py-3">
          <span className="text-2xl">🎤</span>
          <div>
            <div className="text-xs font-black text-orange-400">Mega AI Workshop</div>
            <div className="text-[10px] text-slate-400 font-semibold">14 June 2026 · Shahdol, M.P. · ₹200</div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 text-sm rounded-xl border border-rose-500/30 bg-rose-950/20 text-rose-300 text-center font-semibold">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">👤 Student का नाम</label>
            <input
              type="text"
              placeholder="जैसे: Rahul Kumar"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              className="w-full px-4 py-3.5 bg-slate-800/60 border border-slate-700 rounded-xl text-white text-base placeholder-slate-600 focus:outline-none focus:border-[#00f2fe] transition-all font-semibold"
            />
          </div>

          {/* Class */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">📚 क्लास</label>
            <div className="grid grid-cols-4 gap-2">
              {CLASS_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => { setKlass(c); setError(""); }}
                  className={`py-2.5 rounded-xl text-xs font-black border transition-all ${
                    klass === c
                      ? "border-[#00f2fe] bg-[#00f2fe]/10 text-white"
                      : "border-slate-700 bg-slate-800/40 text-slate-400 hover:border-slate-600"
                  }`}
                >
                  {c.replace("Class ", "")}
                </button>
              ))}
            </div>
          </div>

          {/* School */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">🏫 School का नाम</label>
            <input
              type="text"
              placeholder="जैसे: Saraswati Vidya Mandir"
              value={school}
              onChange={(e) => { setSchool(e.target.value); setError(""); }}
              className="w-full px-4 py-3.5 bg-slate-800/60 border border-slate-700 rounded-xl text-white text-base placeholder-slate-600 focus:outline-none focus:border-[#00f2fe] transition-all font-semibold"
            />
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">📱 Parent का Mobile Number</label>
            <input
              type="tel"
              placeholder="जैसे: 9876543210"
              value={phone}
              onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setError(""); }}
              className="w-full px-4 py-3.5 bg-slate-800/60 border border-slate-700 rounded-xl text-white text-base placeholder-slate-600 focus:outline-none focus:border-[#00f2fe] transition-all font-semibold tracking-widest"
            />
          </div>

          {/* Privacy Note */}
          <p className="text-[10px] text-slate-600 text-center font-semibold">
            🔒 आपकी जानकारी सुरक्षित है। Spam नहीं आएगा। सिर्फ Progress Updates मिलेंगे।
          </p>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4 font-black text-lg text-slate-950 bg-gradient-to-r from-[#ff8008] to-[#ffc837] rounded-2xl shadow-lg hover:opacity-90 transition-opacity"
          >
            Register करें — Free है! 🎓
          </button>
        </form>

        <p className="text-[10px] text-slate-600 text-center font-semibold">
          BharatOS Academy · Shahdol, Madhya Pradesh · जहाँ Teacher खुद AI है
        </p>
      </div>
    </main>
  );
}
