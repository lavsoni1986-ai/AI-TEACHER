"use client";

import { useRouter } from "next/navigation";
import { useDemo, ROADMAP_DATA } from "@/context/DemoContext";
import HexagonTreeLogo from "@/components/ui/HexagonTreeLogo";

export default function CareerPage() {
  const router = useRouter();
  const { name, setSelectedCareer, classCategory } = useDemo();

  const handleSelect = (careerKey: string) => {
    setSelectedCareer(careerKey);
    router.push("/roadmap");
  };

  const careers = Object.entries(ROADMAP_DATA).map(([key, data]) => ({
    key,
    title: data.title,
    emoji: data.emoji,
    course: data.recommendedCourse,
    firstMonth: data.months[0]?.title || ""
  }));

  return (
    <main className="relative min-h-screen flex flex-col justify-center items-center px-4 py-10 overflow-hidden cyber-grid bg-dark-bg">
      {/* Background glow elements */}
      <div className="absolute top-10 left-1/3 w-96 h-96 bg-cyber-blue/5 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-10 right-1/3 w-96 h-96 bg-bharat-orange/5 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="w-full max-w-4xl p-6 md:p-10 rounded-3xl border border-slate-800/80 bg-dark-card/50 backdrop-blur-xl shadow-2xl space-y-8">
        
        {/* Hexagon Tree Logo */}
        <div className="flex justify-center">
          <HexagonTreeLogo size={65} />
        </div>

        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="text-xs font-bold text-cyber-cyan tracking-widest uppercase">कदम 2/2 (Step 2/2)</div>
          <h1 className="text-3xl font-extrabold text-white leading-tight">
            नमस्ते, <span className="text-[#ff8008] glow-text-orange">{name || "Student"}</span>!
          </h1>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#00f2fe] glow-text-cyan">
            आप भविष्य में क्या बनना चाहते हैं?
          </h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            (Aap kya banna chahte ho?) नीचे दिए गए विकल्पों में से अपना पसंदीदा कैरियर चुनें
          </p>
        </div>

        {/* 6 Career Option Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {careers.map((career) => {
            const isStudyAssistant = career.key === "Smart Study Assistant";
            const showRecommended = isStudyAssistant && (classCategory === "Class 6-8" || classCategory === "Class 9-12");
            return (
              <button
                key={career.key}
                onClick={() => handleSelect(career.key)}
                className={`group relative p-6 rounded-2xl border cursor-pointer transition-all duration-300 transform hover:-translate-y-0.5 flex flex-col justify-between min-h-[160px] ${
                  isStudyAssistant
                    ? "border-cyan-500 bg-cyan-950/20 shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:border-[#00f2fe] hover:bg-cyan-950/35 hover:shadow-[0_0_25px_rgba(6,182,212,0.25)]"
                    : "border-slate-800/80 bg-slate-900/40 hover:border-[#00f2fe] hover:bg-[#00f2fe]/5 hover:shadow-[0_0_20px_rgba(0,242,254,0.05)]"
                }`}
              >
                <div className="space-y-3">
                  <div className={`text-4xl p-3 rounded-2xl w-fit group-hover:scale-105 transition-all duration-300 ${
                    isStudyAssistant ? "bg-cyan-950/60 group-hover:bg-[#00f2fe]/10" : "bg-slate-900/80 group-hover:bg-[#00f2fe]/10"
                  }`}>
                    {career.emoji}
                  </div>
                  <div className="space-y-1">
                    <h3 className={`text-lg font-bold text-white group-hover:text-[#00f2fe] transition-colors leading-snug ${
                      isStudyAssistant ? "text-cyan-400" : ""
                    }`}>
                      {career.title}
                    </h3>
                    {showRecommended && (
                      <span className="block text-emerald-400 font-bold text-[10px] pb-1">
                        ⭐ Recommended
                      </span>
                    )}
                    <p className="text-xs text-slate-500">
                      पहला कदम: {career.firstMonth}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-white transition-colors">
                  <span>रोडमैप देखें</span>
                  <span className="group-hover:translate-x-1 transition-transform">➔</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom controls */}
        <div className="flex justify-center pt-2">
          <button
            onClick={() => router.push("/profile")}
            className="text-sm text-slate-500 hover:text-slate-300 cursor-pointer flex items-center gap-1 transition-colors"
          >
            ← नाम / क्लास बदलें (Back to Profile)
          </button>
        </div>

      </div>
    </main>
  );
}
