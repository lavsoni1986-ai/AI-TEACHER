"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "@/context/DemoContext";
import HexagonTreeLogo from "@/components/ui/HexagonTreeLogo";

export default function ProfilePage() {
  const router = useRouter();
  const { name, setName, classCategory, setClassCategory } = useDemo();
  const [localName, setLocalName] = useState(name);
  const [localClass, setLocalClass] = useState(classCategory);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localName.trim()) {
      setError("कृपया अपना नाम दर्ज करें (Please enter your name)");
      return;
    }
    if (!localClass) {
      setError("कृपया अपनी क्लास चुनें (Please select your class)");
      return;
    }
    setError("");
    setName(localName.trim());
    setClassCategory(localClass);
    router.push("/career");
  };

  const classes = [
    { key: "Class 6-8", label: "कक्षा 6 - 8", sub: "(Junior Coding)" },
    { key: "Class 9-12", label: "कक्षा 9 - 12", sub: "(Senior Coding & Tech)" },
    { key: "College", label: "कॉलेज / अन्य", sub: "(Job Ready & Careers)" }
  ];

  return (
    <main className="relative min-h-screen flex flex-col justify-center items-center px-4 py-8 overflow-hidden cyber-grid bg-dark-bg">
      {/* Background glow elements */}
      <div className="absolute top-1/3 left-10 w-80 h-80 bg-bharat-orange/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/3 right-10 w-80 h-80 bg-cyber-cyan/5 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-xl p-8 rounded-3xl border border-slate-800/80 bg-dark-card/50 backdrop-blur-xl shadow-2xl space-y-6">
        
        {/* Hexagon Tree Logo */}
        <div className="flex justify-center">
          <HexagonTreeLogo size={60} />
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="text-xs font-bold text-bharat-orange tracking-widest uppercase">कदम 1/2 (Step 1/2)</div>
          <h2 className="text-3xl font-extrabold text-white">आपकी जानकारी</h2>
          <p className="text-slate-400 text-sm">शुरुआत करने के लिए अपना नाम और क्लास चुनें</p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-3 text-sm rounded-xl border border-rose-500/30 bg-rose-950/20 text-rose-300 text-center font-medium">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-300">
              आपका नाम (Student Name)
            </label>
            <input
              type="text"
              placeholder="यहाँ अपना नाम लिखें..."
              value={localName}
              onChange={(e) => {
                setLocalName(e.target.value);
                if (error) setError("");
              }}
              className="w-full px-5 py-4 bg-slate-900/60 border border-slate-800 rounded-2xl text-white text-lg placeholder-slate-600 focus:outline-none focus:border-[#00f2fe] focus:ring-1 focus:ring-[#00f2fe] transition-all font-semibold"
            />
          </div>

          {/* Class Category */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-300">
              आपकी क्लास / लेवल (Select Class)
            </label>
            <div className="grid grid-cols-1 gap-3">
              {classes.map((cls) => {
                const isSelected = localClass === cls.key;
                return (
                  <button
                    key={cls.key}
                    type="button"
                    onClick={() => {
                      setLocalClass(cls.key);
                      if (error) setError("");
                    }}
                    className={`flex items-center justify-between px-6 py-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "border-[#00f2fe] bg-[#00f2fe]/5 text-white shadow-[0_0_15px_rgba(0,242,254,0.05)]"
                        : "border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-lg">{cls.label}</div>
                      <div className="text-xs text-slate-400">{cls.sub}</div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? "border-[#00f2fe] bg-[#00f2fe]" : "border-slate-600"
                    }`}>
                      {isSelected && <span className="text-xs text-slate-950 font-bold">✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            className="w-full py-4 text-lg font-bold text-slate-950 bg-gradient-to-r from-bharat-orange to-bharat-amber rounded-2xl cursor-pointer shadow-lg shadow-bharat-orange/10 transition-all duration-300 transform hover:scale-[1.01] active:scale-98"
          >
            आगे बढ़ें (Select Dream Career) →
          </button>
        </form>

      </div>
    </main>
  );
}
