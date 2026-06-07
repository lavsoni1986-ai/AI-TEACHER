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
  title: "BharatOS AI Teacher V1",
  description: "Shahdol's first memory-enabled smart AI classroom assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi" className={`${outfit.variable} ${notoHindi.variable} h-full dark`}>
      <body className="min-h-full bg-[#05070f] text-slate-100 font-sans antialiased selection:bg-[#00f2fe]/30 selection:text-white overflow-x-hidden">
        <DemoProvider>
          {children}
        </DemoProvider>
        {/* Global Floating WhatsApp Button */}
        <a
          href="https://wa.me/919753239303"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm md:text-base shadow-[0_4px_20px_rgba(16,185,129,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 group"
          id="whatsapp-admission-btn"
        >
          <span className="text-lg animate-bounce">📱</span>
          <span>WhatsApp Admission</span>
        </a>
      </body>
    </html>
  );
}
