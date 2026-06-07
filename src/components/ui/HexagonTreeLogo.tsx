import React from "react";

interface HexagonTreeLogoProps {
  className?: string;
  size?: number;
}

export default function HexagonTreeLogo({ className = "", size = 80 }: HexagonTreeLogoProps) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-2xl overflow-hidden border border-amber-500/30 bg-slate-950 p-1 shadow-[0_0_20px_rgba(255,128,8,0.15)] ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src="/logo.jpg"
        alt="BharatOS Academy Logo"
        className="w-full h-full object-cover rounded-xl"
      />
    </div>
  );
}
