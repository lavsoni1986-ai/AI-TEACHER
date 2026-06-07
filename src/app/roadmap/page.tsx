"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "@/context/DemoContext";
import HexagonTreeLogo from "@/components/ui/HexagonTreeLogo";
import { getFallbackMessage } from "@/lib/fallbackTeacher";
import RegistrationCard from "@/components/ui/RegistrationCard";
import QRCodeSection from "@/components/ui/QRCodeSection";
import WorkshopInfoCard from "@/components/ui/WorkshopInfoCard";
import ShahdolTrustBanner from "@/components/ui/ShahdolTrustBanner";
import ParentFAQCard from "@/components/ui/ParentFAQCard";
import FounderVisionCard from "@/components/ui/FounderVisionCard";
import WhatsAppStudyCircle from "@/components/ui/WhatsAppStudyCircle";
import BringAFriendBanner from "@/components/ui/BringAFriendBanner";

const workshopMode = process.env.NEXT_PUBLIC_WORKSHOP_MODE === "true";

interface Message {
  sender: "student" | "teacher";
  text: string;
}

export default function RoadmapPage() {
  const router = useRouter();
  const {
    name,
    classCategory,
    selectedCareer,
    roadmap,
    completedTasks,
    toggleTask,
    resetDemo
  } = useDemo();

  // Chat/Gemini States
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Voice States
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Redirect to welcome if profile name is missing
  useEffect(() => {
    if (!name) {
      router.push("/welcome");
    } else if (selectedCareer && messages.length === 0) {
      // Trigger initial AI Teacher greeting
      triggerInitialGreeting();
    }
  }, [name, selectedCareer, router]);

  // Scroll to bottom of chat logs
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamedText, isStreaming]);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-white text-lg animate-pulse">Loading roadmap...</div>
      </div>
    );
  }

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

    // 2. Clean up formatting for pronunciation
    const cleanText = mappedText
      .replace(/[\*\_]/g, "") // Remove markdown indicators
      .replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "") // Remove emojis
      .replace(/\n+/g, " "); // Replace line breaks with spaces

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
    
    utterance.rate = 0.95; // Slightly slower for better classroom clarity
    
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

  // Trigger Gemini greeting stream
  const triggerInitialGreeting = async () => {
    // Cancel previous speaking if any
    handleStopSpeaking();
    
    setIsStreaming(true);
    setStreamedText("");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          classCategory: classCategory === "Class 6-8" ? "कक्षा 6-8" : classCategory === "Class 9-12" ? "कक्षा 9-12" : "कॉलेज / अन्य",
          career: roadmap.title,
          message: "Hello! Please greet me and show the path.",
          history: []
        })
      });

      const contentType = response.headers.get("content-type") || "";
      if (response.status !== 200 || contentType.includes("application/json")) {
        const fallbackText = getFallbackMessage({
          name,
          classCategory,
          career: selectedCareer
        });
        setMessages([
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

      setMessages([
        { sender: "teacher", text: textAccumulator }
      ]);
      setStreamedText("");
      // Speak the generated response
      speakText(textAccumulator);
    } catch (err) {
      console.error("Fetch greeting error:", err);
      const fallbackText = getFallbackMessage({
        name,
        classCategory,
        career: selectedCareer
      });
      setMessages([
        { sender: "teacher", text: fallbackText }
      ]);
      speakText(fallbackText);
    } finally {
      setIsStreaming(false);
    }
  };

  // Submit custom follow-up message to Gemini
  const handleSendMessage = async (customMessage?: string) => {
    const textToSend = customMessage || inputText;
    if (!textToSend.trim() || isStreaming) return;

    // Cancel active speaking when new query starts
    handleStopSpeaking();

    const updatedMessages = [...messages, { sender: "student" as const, text: textToSend }];
    setMessages(updatedMessages);
    setInputText("");
    setIsStreaming(true);
    setStreamedText("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          classCategory,
          career: selectedCareer,
          message: textToSend,
          history: messages // Pass past turns
        })
      });

      const contentType = response.headers.get("content-type") || "";
      if (response.status !== 200 || contentType.includes("application/json")) {
        const errorText = "AI Teacher Learning Mode Active";
        setMessages((prev) => [...prev, { sender: "teacher", text: errorText }]);
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

      setMessages((prev) => [...prev, { sender: "teacher", text: textAccumulator }]);
      setStreamedText("");
      // Speak response
      speakText(textAccumulator);
    } catch (err) {
      console.error("Fetch question error:", err);
      const errorText = "AI Teacher Learning Mode Active";
      setMessages((prev) => [
        ...prev,
        { sender: "teacher", text: errorText }
      ]);
      speakText(errorText);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleRestart = () => {
    resetDemo();
    router.push("/welcome");
  };

  // Calculate progress percent
  const progressPercent = Math.round(
    (completedTasks.length / (roadmap.checklist.length || 1)) * 100
  );

  // Dynamic suggested quick prompts based on selected career
  const suggestedQuestions = selectedCareer === "Smart Study Assistant"
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
    <main className="min-h-screen bg-dark-bg p-4 md:p-8 cyber-grid flex flex-col items-center">
      {/* Top Header / Profile Info */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-dark-card/50 backdrop-blur-xl border border-slate-800/80 p-5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
          <HexagonTreeLogo size={50} className="shrink-0" />
          <div className="space-y-1">
            <div className="text-[10px] font-black text-[#ff8008] uppercase tracking-widest">
              BharatOS Academy | जहाँ Teacher खुद AI है
            </div>
            <h2 className="text-xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
              <span>👤</span> {name} 
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 font-medium">
                {classCategory === "Class 6-8" ? "कक्षा 6 - 8" : classCategory === "Class 9-12" ? "कक्षा 9 - 12" : "कॉलेज / अन्य"}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              लक्ष्य (Dream Career): <span className="font-bold text-cyber-cyan">{roadmap.title}</span>
            </p>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/career")}
            className="px-4 py-2 text-xs font-bold text-slate-300 border border-slate-800 bg-slate-900/40 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            ← कैरियर बदलें
          </button>
          <button
            onClick={handleRestart}
            className="px-4 py-2 text-xs font-bold text-rose-300 border border-rose-950/30 bg-rose-950/10 rounded-xl hover:bg-rose-900/20 transition-colors cursor-pointer"
          >
            ❌ फिर से शुरू करें
          </button>
        </div>
      </div>

      {/* Main Page Layout Grid */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: AI Teacher Chat & 4-Month Timeline */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* AI Teacher Classroom Dialog panel */}
          <div className="bg-dark-card/50 backdrop-blur-xl border border-slate-800/80 p-6 rounded-3xl shadow-xl flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">👩‍🏫</span>
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">BharatOS AI Teacher</h3>
                  <p className="text-[10px] text-slate-400">"जहाँ Teacher खुद AI है"</p>
                </div>
              </div>
              
              {/* Voice Controls block */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const nextVal = !isVoiceEnabled;
                    setIsVoiceEnabled(nextVal);
                    if (!nextVal) handleStopSpeaking();
                  }}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                    isVoiceEnabled
                      ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                      : "border-slate-855 bg-slate-900/40 text-slate-500"
                  }`}
                >
                  {isVoiceEnabled ? "🔊 Voice ON" : "🔇 Voice OFF"}
                </button>
                {isSpeaking && (
                  <button
                    onClick={handleStopSpeaking}
                    className="px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-950/20 text-rose-300 text-xs font-bold transition-all cursor-pointer hover:bg-rose-900/30 animate-pulse"
                  >
                    🛑 Stop
                  </button>
                )}
                {isStreaming && (
                  <span className="text-[10px] text-cyber-cyan font-bold animate-pulse">
                    ● Streaming...
                  </span>
                )}
              </div>
            </div>

            {/* Chat Bubble History area */}
            <div className="max-h-[320px] overflow-y-auto space-y-4 pr-1 text-sm md:text-base">
              
              {/* Initial Loading Message */}
              {isStreaming && !streamedText && messages.length === 0 && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] p-4 bg-slate-900/80 border border-slate-800/80 text-cyber-cyan rounded-2xl rounded-bl-none font-bold animate-pulse leading-relaxed">
                    AI Teacher aapke liye learning roadmap taiyar kar raha hai...
                  </div>
                </div>
              )}

              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === "student" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl font-semibold leading-relaxed ${
                      msg.sender === "student"
                        ? "bg-[#00f2fe]/10 border border-[#00f2fe]/20 text-white rounded-br-none"
                        : "bg-slate-900/60 border border-slate-800/80 text-slate-200 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Streaming placeholder bubble */}
              {isStreaming && streamedText && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] p-4 bg-slate-900/60 border border-slate-800/80 text-slate-200 rounded-2xl rounded-bl-none font-semibold leading-relaxed">
                    {streamedText}
                    <span className="inline-block w-1.5 h-4 bg-[#00f2fe] ml-1 animate-pulse"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Suggested quick clicks */}
            <div className="space-y-1.5 pt-2">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider">सुझाए गए प्रश्न:</div>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    disabled={isStreaming}
                    onClick={() => handleSendMessage(q)}
                    className="px-3.5 py-1.5 bg-slate-900/60 border border-slate-800 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:border-[#00f2fe] disabled:opacity-50 transition-all cursor-pointer"
                  >
                    💬 {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Input Message Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-2 pt-2 border-t border-slate-800/60"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isStreaming}
                placeholder="AI Teacher से कोई सवाल पूछें (Ask any question)..."
                className="flex-1 px-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:border-[#00f2fe] disabled:opacity-70 font-semibold"
              />
              <button
                type="submit"
                disabled={isStreaming || !inputText.trim()}
                className="px-5 py-3 bg-[#00f2fe] hover:bg-[#4facfe] disabled:bg-slate-800 disabled:text-slate-500 font-bold text-slate-950 rounded-xl cursor-pointer transition-colors"
              >
                भेजें (Send)
              </button>
            </form>
          </div>

          {/* 4 Month Roadmap timeline panel */}
          <div className="bg-dark-card/50 backdrop-blur-xl border border-slate-800/80 p-6 md:p-8 rounded-3xl shadow-xl space-y-6">
            <div className="space-y-2 mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>🗺️</span> {roadmap.emoji} आपका 4-महीने का सीखने का मार्ग
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                यह रोडमैप आपकी रुचियों और लक्ष्यों के हिसाब से डिज़ाइन किया गया है। हर महीने के टॉपिक्स को कवर करके आप अपने लक्ष्य को हासिल कर सकते हैं।
              </p>
            </div>

            {/* Timeline */}
            <div className="relative border-l border-[#00f2fe]/20 ml-4 pl-6 space-y-8">
              {roadmap.months.map((item, idx) => (
                <div key={idx} className="relative">
                  {/* Glowing Node */}
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-[#00f2fe] bg-dark-bg glow-cyan" />
                  
                  {/* Month Details Box */}
                  <div className="p-5 rounded-2xl border border-slate-800/60 bg-slate-900/30 hover:bg-slate-900/50 transition-colors space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-[#00f2fe] bg-[#00f2fe]/10 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                        {item.num}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase">
                        {item.subtopic}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white">
                      {item.title}
                    </h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Parent Trust Note */}
            <div className="mt-6 pt-4 border-t border-slate-800/40 text-center text-xs text-slate-400 font-bold">
              🔒 AI Teacher 24x7 Study Partner: Maths, Science, English aur Exam Preparation ke liye।
            </div>
          </div>

        </div>

        {/* Right Column: Progress tracker & course recommendation cards */}
        <div className="space-y-8">
          
          {/* Progress Tracker Card */}
          <div className="bg-dark-card/50 backdrop-blur-xl border border-slate-800/80 p-6 rounded-3xl shadow-xl space-y-5">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>📈</span> प्रोग्रेस ट्रैकर (Progress)
              </h3>
              <p className="text-xs text-slate-400">सीखे हुए टॉपिक पर टिक (✓) लगाएं</p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[#ff8008] font-bold">कुल प्रोग्रेस</span>
                <span className="text-[#00f2fe]">{progressPercent}% Completed</span>
              </div>
              <div className="w-full bg-slate-900 border border-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#00f2fe] to-[#4facfe] h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2.5 pt-2">
              {roadmap.checklist.map((task, idx) => {
                const isCompleted = completedTasks.includes(task);
                return (
                  <button
                    key={idx}
                    onClick={() => toggleTask(task)}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left cursor-pointer transition-all duration-150 ${
                      isCompleted
                        ? "border-[#00f2fe]/20 bg-[#00f2fe]/5 text-slate-200"
                        : "border-slate-800 bg-slate-900/30 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                      isCompleted ? "border-[#00f2fe] bg-[#00f2fe] text-slate-950" : "border-slate-800"
                    }`}>
                      {isCompleted && <span className="text-xs font-black">✓</span>}
                    </div>
                    <span className="text-xs font-semibold leading-relaxed">{task}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recommended Course Banner */}
          <div className="relative bg-gradient-to-br from-dark-card to-slate-900/60 border border-slate-800/80 p-6 rounded-3xl overflow-hidden space-y-4">
            <div className="space-y-1.5">
              <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/30 border border-emerald-900 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                ADMISSION OPEN (प्रवेश चालू हैं)
              </span>
              <h3 className="text-lg font-bold text-white pt-1">
                BHARATOS ACADEMY
              </h3>
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

              <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                Shahdol ke students ke liye practical AI aur modern school padhai:
              </p>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300 font-semibold border-t border-slate-800/60 pt-3">
              <div className="flex items-center gap-1">
                <span className="text-emerald-400 font-bold">✔</span> Math Support
              </div>
              <div className="flex items-center gap-1">
                <span className="text-emerald-400 font-bold">✔</span> Science Support
              </div>
              <div className="flex items-center gap-1">
                <span className="text-emerald-400 font-bold">✔</span> English Support
              </div>
              <div className="flex items-center gap-1">
                <span className="text-emerald-400 font-bold">✔</span> AI Skills
              </div>
              <div className="flex items-center gap-1 col-span-2">
                <span className="text-emerald-400 font-bold">✔</span> Practical Computer Education
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/60 text-center">
              <div className="text-[10px] text-slate-500 mb-1">Admission Inquiry (एडमिशन पूछताछ):</div>
              <div className="text-lg font-black text-white tracking-wide">
                📞 +91 97532 39303
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
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
          <FounderVisionCard />
          <WhatsAppStudyCircle />
          {workshopMode && <BringAFriendBanner />}

        </div>

      </div>
    </main>
  );
}
