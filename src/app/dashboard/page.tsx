"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HexagonTreeLogo from "@/components/ui/HexagonTreeLogo";

interface StudentData {
  name: string;
  school: string;
  classCategory: string;
  selectedCareer: string;
  questionsAsked: number;
  sessionCount: number;
  lastActive: string;
}

function computeBharatOSScore(data: StudentData): number {
  const q = data.questionsAsked;
  const s = data.sessionCount;

  // Questions score (max 50): non-linear, rewards reaching milestones
  const qScore = Math.min(50, Math.round((Math.log1p(q) / Math.log1p(100)) * 50));
  // Sessions score (max 30)
  const sScore = Math.min(30, Math.round((Math.log1p(s) / Math.log1p(30)) * 30));
  // Last active score (max 20): bonus if active today or yesterday
  let activeScore = 0;
  if (data.lastActive) {
    const lastDate = new Date(data.lastActive);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) activeScore = 20;
    else if (diffDays === 1) activeScore = 15;
    else if (diffDays <= 3) activeScore = 10;
    else if (diffDays <= 7) activeScore = 5;
  }

  return Math.min(100, qScore + sScore + activeScore);
}

function getScoreLabel(score: number): { label: string; emoji: string; color: string } {
  if (score >= 91) return { label: "BharatOS Champion", emoji: "🏆", color: "text-amber-400" };
  if (score >= 76) return { label: "Star Learner", emoji: "🌟", color: "text-cyan-400" };
  if (score >= 51) return { label: "Good Progress", emoji: "✅", color: "text-emerald-400" };
  if (score >= 26) return { label: "Getting Started", emoji: "📚", color: "text-blue-400" };
  return { label: "Inactive", emoji: "⚠️", color: "text-rose-400" };
}

function detectTopSubject(messages: Array<{ sender: string; text: string }>): string {
  const studentMessages = messages
    .filter((m) => m.sender === "student")
    .map((m) => m.text.toLowerCase())
    .join(" ");

  const keywords: Record<string, string[]> = {
    "गणित (Math)":      ["math", "ganit", "गणित", "algebra", "formula", "number", "equation", "triangle", "circle"],
    "विज्ञान (Science)": ["science", "vigyan", "विज्ञान", "physics", "chemistry", "biology", "light", "force", "Newton"],
    "अंग्रेजी (English)": ["english", "grammar", "essay", "writing", "vocabulary", "sentence", "paragraph"],
    "AI & Coding":        ["ai", "code", "python", "html", "css", "game", "app", "algorithm", "programming"],
    "सामान्य (General)":  [],
  };

  let best = "सामान्य (General)";
  let bestCount = 0;
  for (const [subject, words] of Object.entries(keywords)) {
    const count = words.filter((w) => studentMessages.includes(w)).length;
    if (count > bestCount) { bestCount = count; best = subject; }
  }
  return best;
}

function formatLastActive(iso: string): string {
  if (!iso) return "अभी तक नहीं";
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 2) return "अभी अभी (Just now)";
  if (diffMin < 60) return `${diffMin} मिनट पहले`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs} घंटे पहले`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays} दिन पहले`;
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<StudentData | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string }>>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const name          = localStorage.getItem("bharatos_name")        || "";
    const school        = localStorage.getItem("bharatos_school")      || "";
    const classCategory = localStorage.getItem("bharatos_class")       || "";
    const selectedCareer = localStorage.getItem("bharatos_career")     || "";
    const questionsAsked = parseInt(localStorage.getItem("bharatos_questions")  || "0", 10);
    const sessionCount   = parseInt(localStorage.getItem("bharatos_sessions")   || "0", 10);
    const lastActive     = localStorage.getItem("bharatos_last_active")         || "";

    if (!name) {
      router.push("/profile");
      return;
    }

    setData({ name, school, classCategory, selectedCareer, questionsAsked, sessionCount, lastActive });

    try {
      const saved = localStorage.getItem("bharatos_chat_history");
      if (saved) setChatMessages(JSON.parse(saved));
    } catch { /* ignore */ }
  }, [router]);

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-lg animate-pulse">Loading...</div>
      </div>
    );
  }

  const score = computeBharatOSScore(data);
  const scoreInfo = getScoreLabel(score);
  const topSubject = detectTopSubject(chatMessages);
  const studentQuestions = chatMessages.filter((m) => m.sender === "student").length;

  // Parent Proof Card text
  const parentProofText =
`📚 BHARATOS STUDENT REPORT

👤 Name      : ${data.name}
🏫 School    : ${data.school || "N/A"}
📖 Class     : ${data.classCategory || "N/A"}

📊 Questions Asked   : ${data.questionsAsked}
🗓️ Total Sessions    : ${data.sessionCount}
⏰ Last Active       : ${formatLastActive(data.lastActive)}
📌 Top Subject       : ${topSubject}

⭐ BharatOS Score    : ${score}/100 ${scoreInfo.emoji}
🏅 Level             : ${scoreInfo.label}

🎓 BharatOS Academy — Shahdol, M.P.
"जहाँ Teacher खुद AI है"
https://bharatos-ai-teacher.vercel.app`;

  const handleShareWhatsApp = () => {
    const encoded = encodeURIComponent(parentProofText);
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(parentProofText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-8 max-w-2xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <HexagonTreeLogo size={44} className="shrink-0" />
        <div>
          <h1 className="text-xl font-extrabold text-white uppercase tracking-wider">BharatOS Dashboard</h1>
          <p className="text-xs text-slate-500 font-semibold">Student Progress Report</p>
        </div>
        <button
          onClick={() => router.push("/roadmap")}
          className="ml-auto text-xs font-bold text-cyan-400 border border-cyan-800/50 rounded-xl px-3 py-1.5 hover:bg-cyan-900/20 transition-colors"
        >
          ← Back to AI Teacher
        </button>
      </div>

      {/* ── SECTION 1: Student Identity Card ───────────────────────────────── */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
        <div className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Student Identity</div>
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00f2fe]/20 to-slate-800 border border-cyan-800/40 flex items-center justify-center text-2xl shrink-0">
            🎓
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-black text-white">{data.name}</div>
            <div className="text-sm font-bold text-slate-400">{data.classCategory || "—"}</div>
            <div className="text-xs font-semibold text-slate-500">🏫 {data.school || "School not set"}</div>
          </div>
        </div>
        {data.selectedCareer && (
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Learning Path:</span>
            <span className="text-xs font-black text-cyan-300">{data.selectedCareer}</span>
          </div>
        )}
      </div>

      {/* ── SECTION 2: BharatOS Score ──────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-center space-y-2">
        <div className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">BharatOS Score</div>
        <div className="text-7xl font-black text-white">{score}</div>
        <div className="text-slate-500 text-xs font-bold">out of 100</div>
        {/* Score Bar */}
        <div className="h-3 bg-slate-800 rounded-full overflow-hidden mt-2">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#00f2fe] to-cyan-300 transition-all duration-700"
            style={{ width: `${score}%` }}
          />
        </div>
        <div className={`text-base font-black mt-1 ${scoreInfo.color}`}>
          {scoreInfo.emoji} {scoreInfo.label}
        </div>
      </div>

      {/* ── SECTION 3: Learning Activity ──────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
        <div className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Learning Activity</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/60 rounded-xl p-4 text-center">
            <div className="text-3xl font-black text-white">{data.questionsAsked}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Total Questions</div>
          </div>
          <div className="bg-slate-800/60 rounded-xl p-4 text-center">
            <div className="text-3xl font-black text-white">{data.sessionCount}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Total Sessions</div>
          </div>
        </div>
        <div className="bg-slate-800/60 rounded-xl p-4 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400">⏰ Last Active</span>
          <span className="text-sm font-black text-white">{formatLastActive(data.lastActive)}</span>
        </div>
      </div>

      {/* ── SECTION 4: Most Used Subject ──────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
        <div className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Most Used Subject</div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-900/30 border border-cyan-800/40 flex items-center justify-center text-xl shrink-0">📖</div>
          <div>
            <div className="text-lg font-black text-white">{topSubject}</div>
            <div className="text-xs text-slate-500 font-semibold">Based on {studentQuestions} student messages</div>
          </div>
        </div>
      </div>

      {/* ── SECTION 5: Parent Proof Card ──────────────────────────────────── */}
      <div className="rounded-2xl border border-orange-900/40 bg-gradient-to-br from-orange-950/30 to-slate-900/60 p-5 space-y-4">
        <div className="text-[10px] font-black text-orange-400 uppercase tracking-widest">📋 Parent Proof Card</div>
        <p className="text-xs text-slate-400 font-semibold">
          इसे Screenshot लें या WhatsApp पर Share करें — पैरेंट्स को दिखाएँ।
        </p>

        {/* Proof Card Preview */}
        <div className="bg-slate-950 border border-slate-700 rounded-xl p-4 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
          {parentProofText}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleShareWhatsApp}
            className="flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
          >
            📱 Share on WhatsApp
          </button>
          <button
            onClick={handleCopy}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm transition-colors ${
              copied
                ? "bg-cyan-700 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {copied ? "✅ Copied!" : "📋 Copy Text"}
          </button>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="text-center space-y-3 pb-4">
        <button
          onClick={() => router.push("/roadmap")}
          className="w-full py-4 font-black text-base text-slate-950 bg-gradient-to-r from-[#ff8008] to-[#ffc837] rounded-2xl hover:opacity-90 transition-opacity"
        >
          🎓 AI Teacher से पढ़ाई जारी रखें →
        </button>
        <p className="text-[10px] text-slate-600 font-semibold">
          BharatOS Academy · Shahdol, Madhya Pradesh · जहाँ Teacher खुद AI है
        </p>
      </div>

    </main>
  );
}
