"use client";

import { useRouter } from "next/navigation";
import { useDemo } from "@/context/DemoContext";
import HexagonTreeLogo from "@/components/ui/HexagonTreeLogo";
import ShahdolTrustBanner from "@/components/ui/ShahdolTrustBanner";
import BringAFriendBanner from "@/components/ui/BringAFriendBanner";
import WhatsAppStudyCircle from "@/components/ui/WhatsAppStudyCircle";
import FounderVisionCard from "@/components/ui/FounderVisionCard";
import SkillPositioningBanner from "@/components/ui/SkillPositioningBanner";

const workshopMode = process.env.NEXT_PUBLIC_WORKSHOP_MODE === "true";

export default function WelcomePage() {
  const router = useRouter();
  const { resetDemo } = useDemo();

  const handleStart = () => {
    resetDemo();
    router.push("/profile");
  };

  const whyPoints = [
    { icon: "🌙", text: "रात 2 बजे भी जवाब देता है" },
    { icon: "❤️", text: "कभी झिड़कता नहीं" },
    { icon: "🎯", text: "हर बच्चे की अपनी speed" },
    { icon: "📚", text: "NCERT + Board Exam Ready" },
    { icon: "💰", text: "Coaching से सस्ता, नतीजा बेहतर" },
    { icon: "🇮🇳", text: "Shahdol के लिए बना" },
  ];

  return (
    <main className="relative min-h-screen flex flex-col justify-center items-center px-4 py-12 overflow-hidden cyber-grid bg-dark-bg">
      {/* Ambient Light */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyber-blue/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-bharat-orange/5 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-2xl space-y-4">

        {/* Main Card */}
        <div className="text-center space-y-6 p-8 md:p-10 rounded-3xl border border-slate-800/80 bg-dark-card/50 backdrop-blur-xl shadow-2xl">

          {/* Logo */}
          <div className="flex justify-center">
            <HexagonTreeLogo size={80} className="hover:scale-105 transition-transform duration-300" />
          </div>

          {/* Branding */}
          <div className="space-y-2">
            <h1 className="text-xs font-black tracking-[0.25em] text-[#ff8008] uppercase">
              BharatOS Academy · Shahdol
            </h1>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              BHARATOS AI TEACHER
            </h2>
            <p className="text-base md:text-lg font-bold text-[#00f2fe] tracking-wide italic glow-text-cyan">
              "जहाँ Teacher खुद AI है"
            </p>
          </div>

          {/* Hero Message — Parent First */}
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 text-left space-y-2">
            <p className="text-base font-black text-white">
              क्या आपका बच्चा Maths या Science में पिछड़ रहा है?
            </p>
            <p className="text-sm text-slate-300 font-semibold leading-relaxed">
              BharatOS AI Teacher — एक ऐसा Teacher जो{" "}
              <strong className="text-white">रात 2 बजे भी</strong> पढ़ाता है,{" "}
              <strong className="text-white">कभी झिड़कता नहीं</strong>, और{" "}
              <strong className="text-white">हर बच्चे की अपनी speed</strong> से चलता है।
            </p>
          </div>

          {/* Why Points */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-left">
            {whyPoints.map((pt) => (
              <div
                key={pt.text}
                className="flex items-center gap-2 text-xs text-slate-300 font-semibold bg-slate-900/30 rounded-xl px-3 py-2 border border-slate-800/40"
              >
                <span>{pt.icon}</span>
                <span>{pt.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center gap-3 pt-2">
            <button
              onClick={handleStart}
              className="w-full px-10 py-4 text-lg font-black text-slate-950 bg-gradient-to-r from-[#00f2fe] to-[#4facfe] rounded-2xl cursor-pointer shadow-lg shadow-[#00f2fe]/10 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[#00f2fe]/30 active:scale-95"
            >
              🚀 सीखना शुरू करें →
            </button>

            {!workshopMode && (
              <button
                onClick={() => router.push("/demo")}
                className="text-xs text-[#00f2fe]/60 hover:text-[#00f2fe] underline transition-colors cursor-pointer"
              >
                Classroom Projector Mode
              </button>
            )}
            {workshopMode && (
              <button
                onClick={() => router.push("/demo")}
                className="text-xs text-orange-400/70 hover:text-orange-400 underline transition-colors cursor-pointer"
              >
                🔥 Workshop Demo Mode खोलें
              </button>
            )}
          </div>
        </div>

        {/* Workshop Teaser — Workshop Mode Only */}
        {workshopMode && (
          <div className="w-full p-4 rounded-2xl bg-orange-950/20 border border-orange-500/30 text-center space-y-1">
            <div className="text-xs font-black text-orange-400 uppercase tracking-widest">🔥 Mega AI Workshop</div>
            <div className="text-sm font-black text-white">14 June 2026 (Sunday) · Shahdol, M.P.</div>
            <div className="text-xs text-slate-400 font-semibold">Classes 8–12 · Parents Welcome · ₹200</div>
            <a
              href="https://wa.me/919753239303"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-1 text-xs font-black text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              📱 Register via WhatsApp → 9753239303
            </a>
          </div>
        )}

        {/* Founder Vision */}
        <FounderVisionCard />

        {/* Skill Positioning */}
        <SkillPositioningBanner />

        {/* WhatsApp Study Circle */}
        <WhatsAppStudyCircle />

        {/* Bring a Friend */}
        {workshopMode && <BringAFriendBanner />}

        {/* Shahdol Trust Banner */}
        <ShahdolTrustBanner />

        {/* Footer */}
        <div className="text-center text-[10px] text-slate-600 tracking-wider py-2">
          BHARATOS ACADEMY, SHAHDOL, INDIA · Built with ❤️ for Shahdol Students
        </div>

      </div>
    </main>
  );
}
