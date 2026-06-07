"use client";

import { useState, useEffect, useRef } from "react";
import { ROADMAP_DATA, MonthData } from "@/context/DemoContext";
import HexagonTreeLogo from "@/components/ui/HexagonTreeLogo";
import { getFallbackMessage } from "@/lib/fallbackTeacher";
import RegistrationCard from "@/components/ui/RegistrationCard";
import QRCodeSection from "@/components/ui/QRCodeSection";
import WorkshopInfoCard from "@/components/ui/WorkshopInfoCard";
import ShahdolTrustBanner from "@/components/ui/ShahdolTrustBanner";
import ParentFAQCard from "@/components/ui/ParentFAQCard";

const workshopMode = process.env.NEXT_PUBLIC_WORKSHOP_MODE === "true";

interface ChatMessage {
  sender: "student" | "teacher";
  text: string;
}

export default function DemoPage() {
  // Onboarding & Demo states
  const [step, setStep] = useState<"onboard" | "career" | "generating" | "result">("onboard");
  const [name, setName] = useState("");
  const [classCat, setClassCat] = useState("");
  const [career, setCareer] = useState("");
  
  // Demo Scenario State (Day 1 fresh vs Day 7 returning student)
  const [demoScenario, setDemoScenario] = useState<"day1" | "day7">("day1");
  
  // Roadmap states
  const [visibleMonths, setVisibleMonths] = useState<MonthData[]>([]);
  const [isDoneGenerating, setIsDoneGenerating] = useState(false);

  // Streaming Chat states
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Voice States
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceRate, setVoiceRate] = useState<number>(0.95); // Default warm speed
  const [voicePitch, setVoicePitch] = useState<number>(1.0); // Default natural pitch

  // Network Online/Offline Status
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof window !== 'undefined' ? window.navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, streamedText, isStreaming]);

  // Clean speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Hinglish Pronunciation Map to ensure natural voice outputs
  const pronunciationMap: Record<string, string> = {
    "Game Developer": "गेम डेवलपर",
    "AI Expert": "एआई एक्सपर्ट",
    "Website Developer": "वेबसाइट डेवलपर",
    "App Developer": "ऐप डेवलपर",
    "Graphic Designer": "ग्राफिक डिजाइनर",
    "Computer Expert": "कंप्यूटर एक्सपर्ट",
    "HTML": "एचटीएमएल",
    "CSS": "सीएसएस",
    "JavaScript": "जावास्क्रिप्ट",
    "Python": "पायथन",
    "Scratch": "स्क्रैच",
    "Month 1": "महीना एक",
    "Month 2": "महीना दो",
    "Month 3": "महीना तीन",
    "Month 4": "महीना चार",
    "BharatOS Academy": "भारतओएस एकेडमी",
    "AI Teacher": "एआई टीचर",
    "AI": "एआई",
    "admission": "एडमिशन",
    "admissions": "एडमिशन",
    "Admission Open": "एडमिशन ओपन",
    "practical": "प्रैक्टिकल",
    "computer": "कंप्यूटर",
    "coding": "कोडिंग",
    "lab": "लैब",
    "Internet": "इंटरनेट",
    "Office Tools": "ऑफिस टूल्स",
    "parent": "पेरेंट",
    "parents": "पेरेंट्स",
    "developer": "डेवलपर",
    "expert": "एक्सपर्ट",
    "project": "प्रोजेक्ट",
    "hello": "नमस्ते",
    "hi": "नमस्ते",
    "software": "सॉफ्टवेयर",
    "design": "डिजाइन"
  };

  const mapPronunciation = (text: string) => {
    let result = text;
    Object.entries(pronunciationMap).forEach(([english, hindi]) => {
      const regex = new RegExp(english, "gi");
      result = result.replace(regex, hindi);
    });
    return result;
  };

  // Speak Text Function
  const speakText = (text: string) => {
    if (!isVoiceEnabled) return;
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    // Cancel active speech
    window.speechSynthesis.cancel();

    // 1. Map Hinglish tech words to Devanagari equivalents
    let mappedText = mapPronunciation(text);

    // 2. Clean formatting for pronunciation
    const cleanText = mappedText
      .replace(/[\*\_]/g, "") // Remove markdown
      .replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "") // Remove emojis
      .replace(/\n+/g, " ");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "hi-IN";

    // Attempt to locate a Hindi voice
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(
      (v) => v.lang === "hi-IN" || v.lang.startsWith("hi")
    );

    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }
    
    // Connect to dynamic state values
    utterance.rate = voiceRate;
    utterance.pitch = voicePitch;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeaking = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleOnboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !classCat) return;
    if (classCat === "Class 6-8" || classCat === "Class 9-12") {
      setCareer("Smart Study Assistant");
    } else {
      setCareer("");
    }
    setStep("career");
  };

  const handleCareerSelect = (key: string, overrideName?: string, overrideClass?: string) => {
    setCareer(key);
    setStep("generating");
    setVisibleMonths([]);
    setIsDoneGenerating(false);
    
    const finalName = overrideName || name;
    const finalClass = overrideClass || classCat;
    
    // Simulate live AI roadmap generation month-by-month on the right panel
    const roadmap = ROADMAP_DATA[key];
    if (roadmap) {
      // Month 1
      setTimeout(() => {
        setVisibleMonths([roadmap.months[0]]);
      }, 700);
      // Month 2
      setTimeout(() => {
        setVisibleMonths((prev) => [...prev, roadmap.months[1]]);
      }, 1400);
      // Month 3
      setTimeout(() => {
        setVisibleMonths((prev) => [...prev, roadmap.months[2]]);
      }, 2100);
      // Month 4
      setTimeout(() => {
        setVisibleMonths((prev) => [...prev, roadmap.months[3]]);
        setIsDoneGenerating(true);
        setStep("result");
        // Trigger live Gemini Greeting in Chat
        triggerLiveGeminiGreeting(finalName, finalClass, key);
      }, 2800);
    }
  };

  // Mock returning student loader for Day 7 demonstration
  const handleLoadReturningStudent = () => {
    handleStopSpeaking();
    setName("Aryan");
    setClassCat("Class 9-12");
    setCareer("Game Developer");
    
    const roadmap = ROADMAP_DATA["Game Developer"];
    if (roadmap) {
      setVisibleMonths(roadmap.months);
      setIsDoneGenerating(true);
    }
    
    setStep("result");
    setIsStreaming(true);
    setStreamedText("");
    setChatHistory([]);
    triggerLiveGeminiGreeting("Aryan", "Class 9-12", "Game Developer", true, 7, 2);
  };

  // Presenter Hotkey Mock Fill for automated demonstration (forces Day 1 style)
  useEffect(() => {
    const handleHotKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setDemoScenario("day1");
        setName("Aryan");
        setClassCat("Class 9-12");
        handleCareerSelect("Game Developer", "Aryan", "Class 9-12");
      }
    };
    window.addEventListener("keydown", handleHotKey);
    return () => window.removeEventListener("keydown", handleHotKey);
  }, [handleCareerSelect]);

  // Trigger live initial greeting from Gemini API
  const triggerLiveGeminiGreeting = async (
    studentName: string, 
    studentClass: string, 
    careerKey: string,
    isReturningOverride?: boolean,
    visitDayOverride?: number,
    completedTasksCountOverride?: number
  ) => {
    handleStopSpeaking();
    
    setIsStreaming(true);
    setStreamedText("");
    setChatHistory([]);
    
    const classLabel = studentClass === "Class 6-8" ? "कक्षा 6-8" : studentClass === "Class 9-12" ? "कक्षा 9-12" : "कॉलेज / अन्य";
    const careerTitle = ROADMAP_DATA[careerKey]?.title || careerKey;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: studentName,
          classCategory: classLabel,
          career: careerTitle,
          message: "Hello! Please welcome me to the classroom.",
          history: [],
          isReturning: isReturningOverride || false,
          visitDay: visitDayOverride || 1,
          completedTasksCount: completedTasksCountOverride || 0
        })
      });

      const contentType = response.headers.get("content-type") || "";
      if (response.status !== 200 || contentType.includes("application/json")) {
        const fallbackText = getFallbackMessage({
          name: studentName,
          classCategory: studentClass,
          career: careerKey,
          isReturning: isReturningOverride,
          visitDay: visitDayOverride,
          completedTasksCount: completedTasksCountOverride
        });
        setChatHistory([
          { sender: "teacher", text: fallbackText }
        ]);
        speakText(fallbackText);
        setIsStreaming(false);
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let textAccumulator = "";

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        textAccumulator += chunk;
        setStreamedText(textAccumulator);
      }

      setChatHistory([
        { sender: "teacher", text: textAccumulator }
      ]);
      setStreamedText("");
      speakText(textAccumulator);
    } catch (err) {
      console.error("Fetch greeting error:", err);
      
      const fallbackText = getFallbackMessage({
        name: studentName,
        classCategory: studentClass,
        career: careerKey,
        isReturning: isReturningOverride,
        visitDay: visitDayOverride,
        completedTasksCount: completedTasksCountOverride
      });

      setChatHistory([
        { sender: "teacher", text: fallbackText }
      ]);
      speakText(fallbackText);
    } finally {
      setIsStreaming(false);
    }
  };

  // Send follow-up question to Gemini
  const handleQuestionClick = async (questionText: string) => {
    if (isStreaming) return;

    // Cancel active speaking when query starts
    handleStopSpeaking();
    
    const updatedHistory = [...chatHistory, { sender: "student" as const, text: questionText }];
    setChatHistory(updatedHistory);
    setIsStreaming(true);
    setStreamedText("");

    const classLabel = classCat === "Class 6-8" ? "कक्षा 6-8" : classCat === "Class 9-12" ? "कक्षा 9-12" : "कॉलेज / अन्य";
    const careerTitle = ROADMAP_DATA[career]?.title || career;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          classCategory: classLabel,
          career: careerTitle,
          message: questionText,
          history: chatHistory
        })
      });

      const contentType = response.headers.get("content-type") || "";
      if (response.status !== 200 || contentType.includes("application/json")) {
        const errorText = "AI Teacher Learning Mode Active";
        setChatHistory((prev) => [...prev, { sender: "teacher", text: errorText }]);
        speakText(errorText);
        setIsStreaming(false);
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let textAccumulator = "";

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        textAccumulator += chunk;
        setStreamedText(textAccumulator);
      }

      setChatHistory((prev) => [...prev, { sender: "teacher", text: textAccumulator }]);
      setStreamedText("");
      // Speak follow-up
      speakText(textAccumulator);
    } catch (err) {
      console.error("Fetch question error:", err);
      const errorText = "AI Teacher Learning Mode Active";
      setChatHistory((prev) => [
        ...prev,
        { sender: "teacher", text: errorText }
      ]);
      speakText(errorText);
    } finally {
      setIsStreaming(false);
    }
  };

  const resetAll = () => {
    handleStopSpeaking();
    setStep("onboard");
    setName("");
    setClassCat("");
    setCareer("");
    setVisibleMonths([]);
    setIsDoneGenerating(false);
    setChatHistory([]);
    setStreamedText("");
  };

  const activeQuestions = career === "Smart Study Assistant"
    ? [
        "AI से गणित कैसे सीख सकते हैं?",
        "क्या AI मेरी Science में मदद करेगा?",
        "Board Exam की तैयारी कैसे करूँ?",
        "English Grammar कैसे सुधारूँ?",
        "क्या AI मेरा होमवर्क समझा सकता है?"
      ]
    : [
        "AI Expert banne ke liye mujhe kya seekhna hoga?",
        "Kya main bina coding ke AI seekh sakta hoon?",
        "Computer Expert banne me kitna samay lagega?",
        "Main ghar se practice kaise kar sakta hoon?"
      ];

  return (
    <main className="min-h-screen bg-[#03050a] text-slate-100 flex flex-col font-sans overflow-hidden">
      
      {/* Rebranded Projector Demo Header */}
      <header className="h-20 border-b border-slate-900 bg-slate-950 flex items-center justify-between px-6 shrink-0 shadow-xl gap-4">
        {/* Left: Brand info */}
        <div className="flex items-center gap-4">
          <HexagonTreeLogo size={45} className="shrink-0" />
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-white leading-tight uppercase tracking-wider">
              BHARATOS AI TEACHER
            </h1>
            <p className="text-xs md:text-sm font-bold text-[#ff8008] tracking-wide italic leading-none glow-text-orange">
              "जहाँ Teacher खुद AI है"
            </p>
          </div>
        </div>

        {/* Center: Network status indicator */}
        <div className="hidden lg:flex items-center space-x-3 bg-slate-900/60 px-4 py-1.5 rounded-full border border-slate-800 backdrop-blur-sm selection:bg-transparent select-none">
          {/* Dynamic Network Dot */}
          <span className="relative flex h-2.5 w-2.5">
            {isOnline && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isOnline ? 'bg-cyan-500' : 'bg-amber-500'}`}></span>
          </span>

          {/* Network & Badge Text */}
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
              {isOnline ? 'Live AI Server' : 'AI Teacher Learning Mode Active'}
            </span>
            <span className="text-[9px] text-slate-500 font-medium tracking-normal leading-tight">
              100% Sovereign Tech • Made for Shahdol
            </span>
          </div>
        </div>

        {/* Right: Controls (Voice toggles, sliders, reset) */}
        <div className="flex items-center gap-4">
          {/* Voice Customizer sliders */}
          <div className="hidden xl:flex items-center space-x-4 bg-slate-900/40 px-4 py-1.5 rounded-xl border border-slate-800/80">
            {/* Speed (Rate) Slider */}
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] font-bold text-slate-400">गति:</span>
              <input 
                type="range" 
                min="0.8" 
                max="1.2" 
                step="0.05" 
                value={voiceRate}
                onChange={(e) => setVoiceRate(parseFloat(e.target.value))}
                className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
              />
              <span className="text-[10px] font-mono text-cyan-400 w-8 text-right">{voiceRate}x</span>
            </div>

            {/* Pitch Slider */}
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] font-bold text-slate-400">पिच:</span>
              <input 
                type="range" 
                min="0.9" 
                max="1.1" 
                step="0.05" 
                value={voicePitch}
                onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
                className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
              />
              <span className="text-[10px] font-mono text-cyan-400 w-6 text-right">{voicePitch}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Scenario Selector (Day 1 vs Day 7) */}
            <div className="flex items-center bg-slate-900/80 p-0.5 rounded-xl border border-slate-800 select-none">
              <button
                type="button"
                onClick={() => {
                  setDemoScenario("day1");
                  resetAll();
                }}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wider uppercase transition-all cursor-pointer ${
                  demoScenario === "day1"
                    ? "bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Day 1 (Fresh)
              </button>
              <button
                type="button"
                onClick={() => {
                  setDemoScenario("day7");
                  handleLoadReturningStudent();
                }}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wider uppercase transition-all cursor-pointer ${
                  demoScenario === "day7"
                    ? "bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Day 7 (Return)
              </button>
            </div>

            <button
              onClick={() => {
                const nextVal = !isVoiceEnabled;
                setIsVoiceEnabled(nextVal);
                if (!nextVal) handleStopSpeaking();
              }}
              className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                isVoiceEnabled
                  ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-400"
                  : "border-slate-800 bg-slate-900/40 text-slate-500"
              }`}
            >
              {isVoiceEnabled ? "🔊 Voice ON" : "🔇 Voice OFF"}
            </button>
            
            {isSpeaking && (
              <button
                onClick={handleStopSpeaking}
                className="px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-950/20 text-rose-300 text-[11px] font-bold transition-all cursor-pointer hover:bg-rose-900/30"
              >
                🛑 Stop
              </button>
            )}

            <button
              onClick={resetAll}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 hover:bg-rose-950/20 text-[11px] font-bold text-slate-300 hover:text-rose-300 transition-all cursor-pointer shadow-md"
            >
              🔄 रीसेट (Reset)
            </button>
          </div>
        </div>
      </header>

      {/* Split Widescreen Layout */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        
        {/* Left Column: Input Form, Selection, or Large Live Chat Panel (50%) */}
        <section className="w-full lg:w-1/2 border-r border-slate-900/60 flex flex-col justify-center p-8 bg-slate-950/20">
          
          {step === "onboard" && (
            <form onSubmit={handleOnboardSubmit} className="max-w-md w-full mx-auto space-y-6">
              <div className="space-y-2 text-center">
                <span className="text-xs font-black text-[#00f2fe] uppercase tracking-wider">Classroom Live Entry</span>
                <h2 className="text-3xl font-extrabold text-white">स्टूडेंट का प्रोफाइल</h2>
              </div>
              
              <div className="space-y-2">
                <label className="text-lg font-bold text-slate-300">स्टूडेंट का नाम (Student Name):</label>
                <input
                  type="text"
                  placeholder="यहाँ नाम दर्ज करें..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-900/60 border border-slate-800 rounded-2xl text-white text-2xl placeholder-slate-600 focus:outline-none focus:border-[#00f2fe] font-bold"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-lg font-bold text-slate-300">क्लास कैटेगरी (Class):</label>
                <div className="grid grid-cols-3 gap-3">
                  {["Class 6-8", "Class 9-12", "College"].map((cls) => {
                    const isSel = classCat === cls;
                    return (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => setClassCat(cls)}
                        className={`py-4 rounded-xl border-2 text-sm font-black cursor-pointer transition-all ${
                          isSel ? "border-[#00f2fe] bg-[#00f2fe]/5 text-white" : "border-slate-800 bg-slate-900/40 text-slate-400"
                        }`}
                      >
                        {cls === "Class 6-8" ? "कक्षा 6-8" : cls === "Class 9-12" ? "कक्षा 9-12" : "कॉलेज / अन्य"}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 text-xl font-bold text-slate-950 bg-gradient-to-r from-bharat-orange to-bharat-amber rounded-2xl cursor-pointer hover:shadow-lg transition-all"
              >
                आगे बढ़ें (Enter)
              </button>
            </form>
          )}

          {step === "career" && (
            <div className="max-w-lg w-full mx-auto space-y-6">
              <div className="text-center space-y-2">
                <span className="text-xs font-black text-[#00f2fe] uppercase tracking-wider">Aap kya banna chahte ho?</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white">आप भविष्य में क्या बनना चाहते हैं?</h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {Object.keys(ROADMAP_DATA).map((key) => {
                  const data = ROADMAP_DATA[key];
                  const isStudyAssistant = key === "Smart Study Assistant";
                  return (
                    <button
                      key={key}
                      onClick={() => handleCareerSelect(key)}
                      className={`p-5 rounded-2xl border transition-all text-left flex items-center gap-4 cursor-pointer group ${
                        isStudyAssistant
                          ? "col-span-2 border-cyan-500 bg-cyan-950/20 shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:bg-cyan-950/30 hover:border-[#00f2fe]"
                          : "border-slate-800/80 bg-slate-900/40 hover:border-[#00f2fe] hover:bg-[#00f2fe]/5"
                      }`}
                    >
                      <span className={`${isStudyAssistant ? "text-4xl" : "text-3xl"} group-hover:scale-105 transition-transform`}>
                        {data.emoji}
                      </span>
                      <div className="flex flex-col">
                        <span className={`font-bold text-white group-hover:text-[#00f2fe] transition-colors ${
                          isStudyAssistant ? "text-lg md:text-xl text-cyan-400" : "text-base"
                        }`}>
                          {data.title.split(" (")[0]}
                        </span>
                        {isStudyAssistant ? (
                          <span className="text-xs text-slate-400 font-medium leading-relaxed">
                            Math, Science & English - स्कूल की पढ़ाई और परीक्षा सहायक
                            {(classCat === "Class 6-8" || classCat === "Class 9-12") && (
                              <span className="block text-emerald-400 font-bold mt-1 text-[11px]">
                                ⭐ Recommended ({classCat === "Class 6-8" ? "कक्षा 6-8" : "कक्षा 9-12"} के लिए विशेष रूप से अनुशंसित)
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500 font-medium">
                            {data.title.includes("(") ? data.title.split(" (")[1].replace(")", "") : ""}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {(step === "generating" || step === "result") && (
            <div className="flex-1 flex flex-col min-h-0 w-full max-w-2xl mx-auto py-4">
              {/* Chat Title */}
              <div className="border border-slate-800 bg-slate-950 p-4 rounded-t-2xl flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xl">👩‍🏫</span>
                  <div>
                    <div className="text-sm font-bold text-white">BharatOS AI Teacher</div>
                    <div className="text-[10px] text-slate-400">"जहाँ Teacher खुद AI है"</div>
                  </div>
                </div>
                {isStreaming && (
                  <span className="text-xs text-[#00f2fe] font-bold animate-pulse">
                    ● Streaming Live
                  </span>
                )}
              </div>

              {/* Streaming Chat Box (Huge Fonts for Projector) */}
              <div className="flex-1 border-x border-slate-800 bg-slate-900/10 p-5 overflow-y-auto space-y-4 min-h-[300px]">
                
                {/* Custom Loading State */}
                {isStreaming && !streamedText && chatHistory.length === 0 && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] p-5 bg-slate-900 border border-slate-800 text-cyber-cyan rounded-2xl rounded-bl-none text-xl md:text-2xl font-bold animate-pulse leading-relaxed">
                      AI Teacher aapke liye learning roadmap taiyar kar raha hai...
                    </div>
                  </div>
                )}

                {chatHistory.map((msg, idx) => {
                  const isTeacher = msg.sender === "teacher";
                  return (
                    <div
                      key={idx}
                      className={`flex ${isTeacher ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[85%] p-5 rounded-2xl text-xl md:text-2xl font-bold leading-relaxed shadow-lg whitespace-pre-line ${
                          isTeacher
                            ? "bg-slate-900/80 border border-slate-800 text-slate-100 rounded-bl-none"
                            : "bg-[#00f2fe]/10 border border-[#00f2fe]/20 text-white rounded-br-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}

                {/* Simulated live typing during streaming */}
                {isStreaming && streamedText && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] p-5 bg-slate-900/80 border border-slate-800 text-slate-100 rounded-2xl rounded-bl-none text-xl md:text-2xl font-bold leading-relaxed whitespace-pre-line">
                      {streamedText}
                      <span className="inline-block w-2 h-5 bg-[#00f2fe] ml-1 animate-pulse"></span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Quick interactive questions */}
              <div className="border border-slate-800 bg-slate-950 p-4 rounded-b-2xl shrink-0">
                <div className="text-xs font-bold text-slate-500 mb-2">पूछने के लिए किसी एक प्रश्न पर क्लिक करें (Click to ask):</div>
                <div className="flex flex-col gap-2">
                  {activeQuestions.map((qText, idx) => (
                    <button
                      key={idx}
                      disabled={isStreaming}
                      onClick={() => handleQuestionClick(qText)}
                      className="px-4 py-3 bg-slate-900/50 hover:bg-slate-800/80 disabled:opacity-50 text-left border border-slate-800 text-sm md:text-base font-bold text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer"
                    >
                      💬 {qText}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

        </section>

        {/* Right Column: AI Brain, Month timeline generation (50%) */}
        <section className="w-full lg:w-1/2 p-8 flex flex-col justify-center bg-black">
          
          {step === "onboard" && (
            <div className="text-center space-y-6 max-w-md mx-auto">
              <div className="flex justify-center">
                <HexagonTreeLogo size={140} className="opacity-20 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-700">BharatOS Academy Screen</h3>
                <p className="text-slate-600 text-sm">
                  जैसे ही स्टूडेंट का प्रोफाइल भरा जाएगा, यहाँ उसका लाइव रोडमैप जनरेट होगा।
                </p>
              </div>
            </div>
          )}

          {step === "career" && (
            <div className="text-center space-y-6 max-w-md mx-auto">
              <div className="flex justify-center">
                <HexagonTreeLogo size={140} className="opacity-40 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-500">कैरियर का चयन करें</h3>
                <p className="text-slate-600 text-sm">
                  बाएं पैनल (left panel) से किसी एक विकल्प पर क्लिक करें और लाइव जेनरेटर का कमाल देखें!
                </p>
              </div>
            </div>
          )}

          {step === "generating" && (
            <div className="space-y-8 max-w-lg w-full mx-auto">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-t-[#00f2fe] border-slate-800 rounded-full animate-spin mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-white">रोडमैप तैयार हो रहा है...</h3>
                  <p className="text-[#00f2fe] text-xs font-mono">
                    [AI Brain is creating roadmap for {name}...]
                  </p>
                </div>
              </div>

              {/* Live drawing months */}
              <div className="space-y-3 pl-4 border-l border-slate-800">
                {visibleMonths.map((m, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-900 bg-slate-950/40 text-sm animate-bounce">
                    <span className="text-xs font-bold text-[#00f2fe]">{m.num}: {m.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === "result" && (
            <div className="max-w-xl w-full mx-auto space-y-6">
              
              {/* Profile card summary */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">ACTIVE ROADMAP FOR</span>
                  <div className="text-2xl font-black text-white">{name}</div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-bharat-orange bg-bharat-orange/10 px-3 py-1 rounded-md">
                    {ROADMAP_DATA[career]?.title.split(" (")[0]}
                  </span>
                </div>
              </div>

              {/* Dynamic 4-Month Roadmaps list */}
              <div className="space-y-3">
                {ROADMAP_DATA[career]?.months.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-slate-900 bg-slate-950/50 flex gap-4 hover:border-[#00f2fe] transition-colors"
                  >
                    <div className="text-[#00f2fe] text-sm font-black tracking-tighter shrink-0 pt-0.5">
                      {m.num}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-white leading-none">{m.title}</h4>
                      <p className="text-xs text-slate-400 leading-snug">{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Parent Trust Note */}
              <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/10 text-center text-xs text-emerald-400 font-bold tracking-wide shadow-[0_0_10px_rgba(16,185,129,0.05)] select-none">
                🔒 AI Teacher 24x7 Study Partner: Maths, Science, English aur Exam Preparation ke liye।
              </div>

              {/* Recommended Course Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 glow-orange flex flex-col gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex justify-center sm:justify-start">
                    <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/30 border border-emerald-900 px-2 py-0.5 rounded uppercase tracking-wider">
                      ADMISSION OPEN (प्रवेश चालू हैं)
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white pt-1">BHARATOS ACADEMY</h4>
                  <p className="text-xs text-cyan-400 font-black tracking-wide uppercase">
                    AI + School Studies + Future Skills
                  </p>
                  <p className="text-[10px] text-emerald-400 font-bold tracking-wide uppercase">
                    Classes 8th–12th Students
                  </p>
                  <p className="text-[10px] text-amber-400 font-bold tracking-wide uppercase">
                    Parents & Guardians Welcome
                  </p>
                  
                  {/* Workshop Details Banner */}
                  <div className="p-2.5 rounded-xl bg-orange-950/20 border border-orange-500/30 text-center text-xs space-y-0.5 my-2">
                    <div className="font-black text-orange-400 uppercase tracking-wider">🔥 Mega AI Workshop</div>
                    <div className="text-white font-black">14 June 2026 (Sunday)</div>
                    <div className="text-slate-400 text-[10px] font-bold">Shahdol, M.P.</div>
                  </div>

                  <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                    Shahdol ke students ke liye practical AI aur modern school padhai:
                  </p>
                </div>

                {/* Features List */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 font-semibold border-t border-slate-800/80 pt-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">✔</span> Mathematics Support
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">✔</span> Science Support
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">✔</span> English Support
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">✔</span> AI Skills
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2">
                    <span className="text-emerald-400 font-bold">✔</span> Practical Computer Education
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-2 border-t border-slate-800/80 pt-3 text-center sm:text-left">
                  <div>
                    <div className="text-[10px] text-slate-500 font-bold">Admission Inquiry</div>
                    <div className="text-base font-black text-white tracking-wide">📞 +91 97532 39303</div>
                  </div>
                  <div className="text-[10px] text-slate-500 italic">
                    BharatOS Academy, Shahdol, M.P.
                  </div>
                </div>
              </div>

              {/* New Components: Registration, Trust, Workshop, QR, FAQ */}
              <RegistrationCard />
              <ShahdolTrustBanner />
              <WorkshopInfoCard />
              <QRCodeSection />
              <ParentFAQCard />

            </div>
          )}

        </section>

      </div>
    </main>
  );
}
