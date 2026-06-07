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
      </body>
    </html>
  );
}
