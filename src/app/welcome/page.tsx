"use client";

import { useRouter } from "next/navigation";
import { useDemo } from "@/context/DemoContext";
import HexagonTreeLogo from "@/components/ui/HexagonTreeLogo";

export default function WelcomePage() {
  const router = useRouter();
  const { resetDemo } = useDemo();

  const handleStart = () => {
    resetDemo(); // Clear session for a clean demo
    router.push("/profile");
  };

  const prestigePoints = [
    "Personalized Learning",
    "AI Guided Roadmaps",
    "Coding & AI Skills",
    "Project Based Learning",
    "Shahdol's First AI Teacher"
  ];

  return (
    <main className="relative min-h-screen flex flex-col justify-center items-center px-4 py-12 overflow-hidden cyber-grid bg-dark-bg">
      {/* Soft Ambient Light (Trustworthy Dark Blue & Warm Amber) */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyber-blue/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-bharat-orange/5 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-3xl text-center space-y-8 p-8 md:p-12 rounded-3xl border border-slate-800/80 bg-dark-card/50 backdrop-blur-xl shadow-2xl">
        
        {/* Hexagon Tree Logo */}
        <div className="flex justify-center">
          <HexagonTreeLogo size={90} className="hover:scale-105 transition-transform duration-300" />
        </div>

        {/* Master Branding Headers */}
        <div className="space-y-3">
          <h1 className="text-sm font-black tracking-[0.25em] text-[#ff8008] uppercase">
            BharatOS Academy
          </h1>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
            BHARATOS AI TEACHER
          </h2>
          <p className="text-lg md:text-xl font-bold text-[#00f2fe] tracking-wide italic glow-text-cyan">
            "जहाँ Teacher खुद AI है"
          </p>
        </div>

        {/* Rebranded Welcome Slogan */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 max-w-xl mx-auto space-y-4">
          <p className="text-lg md:text-xl font-medium text-slate-100 leading-relaxed">
            नमस्ते!
          </p>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            मैं <strong>BharatOS AI Teacher</strong> हूँ।<br />
            मैं आपके सपनों, रुचियों और लक्ष्यों के आधार पर आपका व्यक्तिगत सीखने का मार्ग (Roadmap) तैयार करूँगा।
          </p>
        </div>

        {/* Prestige Section */}
        <div className="pt-2 max-w-lg mx-auto">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">
            Why BharatOS AI Teacher?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {prestigePoints.map((point, index) => (
              <div key={index} className="flex items-center gap-3 text-sm text-slate-300">
                <span className="text-[#00f2fe] font-bold">✓</span>
                <span className="font-semibold">{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 flex flex-col items-center gap-3">
          <button
            onClick={handleStart}
            className="w-full sm:w-auto px-12 py-4.5 text-lg font-bold text-slate-950 bg-gradient-to-r from-[#00f2fe] to-[#4facfe] rounded-2xl cursor-pointer shadow-lg shadow-[#00f2fe]/10 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[#00f2fe]/30 active:scale-98"
          >
            सीखना शुरू करें (Start Learning) →
          </button>
          
          <button
            onClick={() => router.push("/demo")}
            className="text-xs text-[#00f2fe]/70 hover:text-[#00f2fe] underline transition-colors cursor-pointer"
          >
            क्लासरूम प्रोजेक्टर मोड (Classroom Demo Mode)
          </button>
        </div>

      </div>

      {/* Footer Branding */}
      <div className="mt-8 text-center text-[10px] text-slate-600 tracking-wider">
        BHARATOS ACADEMY, SHAHDOL, INDIA | jahan teacher khud ai hai
      </div>
    </main>
  );
}
