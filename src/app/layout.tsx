import type { Metadata } from "next";
import { Outfit, Noto_Sans_Devanagari } from "next/font/google";
import { DemoProvider } from "@/context/DemoContext";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const notoHindi = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-hindi",
});

export const metadata: Metadata = {
  title: "BharatOS AI Teacher — जहाँ Teacher खुद AI है",
  description: "Shahdol's AI-powered classroom assistant for Classes 8–12. Smart Study Assistant, Career Roadmaps, and more.",
};

const workshopMode = String(process.env.NEXT_PUBLIC_WORKSHOP_MODE).replace(/['"]/g, '') === "true";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi" className={`${outfit.variable} ${notoHindi.variable} h-full dark`}>
      <body className="min-h-full bg-[#05070f] text-slate-100 font-sans antialiased selection:bg-[#00f2fe]/30 selection:text-white overflow-x-hidden">

        {/* Workshop Mode Top Banner */}
        {workshopMode && (
          <div className="w-full bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 text-slate-950 text-center py-1.5 px-4 text-[11px] font-black tracking-wide sticky top-0 z-50 flex items-center justify-center gap-2 shadow-lg">
            <span>🔥</span>
            <span>MEGA AI WORKSHOP — 14 June 2026 (Sunday) · Shahdol, M.P. · ₹200</span>
            <span>🔥</span>
          </div>
        )}

        <DemoProvider>
          {children}
        </DemoProvider>

        {/* Global Floating WhatsApp Button with pulse animation */}
        <style>{`
          @keyframes wa-pulse {
            0%, 89%, 100% { box-shadow: 0 4px 20px rgba(16,185,129,0.4); transform: scale(1); }
            90% { box-shadow: 0 0 0 0 rgba(16,185,129,0.5); transform: scale(1.05); }
            95% { box-shadow: 0 0 0 12px rgba(16,185,129,0); transform: scale(1); }
          }
          #whatsapp-admission-btn {
            animation: wa-pulse 10s infinite;
          }
        `}</style>
        <a
          href="https://wa.me/919753239303"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-4 md:right-6 z-40 flex items-center gap-2 px-4 md:px-5 py-2.5 md:py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs md:text-sm shadow-[0_4px_20px_rgba(16,185,129,0.4)] transition-colors duration-300 active:scale-95 max-w-[180px] md:max-w-none"
          id="whatsapp-admission-btn"
        >
          <span className="text-base shrink-0">📱</span>
          <span className="truncate">WhatsApp Admission</span>
        </a>
      </body>
    </html>
  );
}
