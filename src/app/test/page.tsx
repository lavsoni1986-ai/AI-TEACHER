"use client";

import { useState } from "react";
import HexagonTreeLogo from "@/components/ui/HexagonTreeLogo";

export default function TestPage() {
  const [name, setName] = useState("Aryan");
  const [classCat, setClassCat] = useState("कक्षा 9-12");
  const [career, setCareer] = useState("Game Developer");
  const [message, setMessage] = useState("Hello! Show my learning path.");
  
  const [rawResponse, setRawResponse] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [error, setError] = useState("");

  const runValidation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTesting(true);
    setRawResponse("");
    setError("");
    setResponseTime(null);
    const startTime = Date.now();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          classCategory: classCat,
          career,
          message,
          history: []
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let textAccumulator = "";

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        textAccumulator += chunk;
        setRawResponse(textAccumulator);
      }

      const duration = Date.now() - startTime;
      setResponseTime(duration);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unknown error during API call.");
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
          <HexagonTreeLogo size={55} />
          <div>
            <h1 className="text-2xl font-black tracking-wide text-white">AI Brain Validation Console</h1>
            <p className="text-xs text-slate-500 font-mono">Verify Gemini API, parameters, and prompt outputs</p>
          </div>
        </div>

        {/* Validation Form */}
        <form onSubmit={runValidation} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
          <h2 className="text-lg font-bold text-white">1. Input Parameters (Payload)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Student Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Class Category</label>
              <input
                type="text"
                value={classCat}
                onChange={(e) => setClassCat(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Dream Career</label>
              <input
                type="text"
                value={career}
                onChange={(e) => setCareer(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Trigger Message</label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isTesting}
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-800 text-slate-950 font-bold text-sm rounded-lg transition-colors cursor-pointer"
          >
            {isTesting ? "Testing Gemini Brain (Streaming response...)" : "Test AI Brain (Verify API Endpoint)"}
          </button>
        </form>

        {/* Validation Output */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-white">2. Raw Gemini Response (Brain Output)</h2>
            <div className="flex gap-2">
              {responseTime !== null && (
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/20 border border-emerald-900 px-2 py-0.5 rounded">
                  Time: {responseTime}ms
                </span>
              )}
              {isTesting && (
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/20 border border-cyan-900 px-2 py-0.5 rounded animate-pulse">
                  Streaming...
                </span>
              )}
            </div>
          </div>

          {error && (
            <div className="p-4 bg-rose-950/20 border border-rose-900 rounded-xl text-rose-300 text-sm font-semibold whitespace-pre-wrap">
              ❌ Connection Error: {error}
            </div>
          )}

          <div className="min-h-[200px] p-5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 font-mono text-sm leading-relaxed whitespace-pre-wrap overflow-x-auto select-all">
            {rawResponse || (
              <span className="text-slate-600 italic">No response generated. Click the button above to execute validation.</span>
            )}
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center pt-2">
          <a
            href="/demo"
            className="text-xs text-slate-500 hover:text-slate-300 underline"
          >
            Return to Classroom Demo Mode
          </a>
        </div>

      </div>
    </main>
  );
}
