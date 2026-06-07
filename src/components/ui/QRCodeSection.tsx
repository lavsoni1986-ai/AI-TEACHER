"use client";

import { QRCodeSVG } from "qrcode.react";

interface QRCodeSectionProps {
  className?: string;
}

export default function QRCodeSection({ className = "" }: QRCodeSectionProps) {
  const qrCodes = [
    {
      url: "https://bharatos-ai-teacher.vercel.app",
      label: "SCAN TO REGISTER",
      sublabel: "Website",
      color: "#00f2fe",
      bgColor: "#01101a"
    },
    {
      url: "https://wa.me/919753239303",
      label: "SCAN FOR WHATSAPP",
      sublabel: "WhatsApp Admission",
      color: "#34d399",
      bgColor: "#0a1f12"
    }
  ];

  return (
    <div className={`rounded-2xl bg-slate-950/60 border border-slate-800/60 p-4 space-y-3 ${className}`}>
      <div className="text-center text-[10px] font-black text-slate-500 uppercase tracking-widest pb-1">
        📱 Scan QR Code
      </div>
      <div className="grid grid-cols-2 gap-3">
        {qrCodes.map((qr) => (
          <div
            key={qr.url}
            className="flex flex-col items-center gap-2 rounded-xl border border-slate-800/60 bg-slate-900/40 p-3"
          >
            {/* QR Code */}
            <div className="rounded-lg overflow-hidden p-1.5 bg-white shadow-md">
              <QRCodeSVG
                value={qr.url}
                size={96}
                bgColor="#ffffff"
                fgColor="#0a0a0a"
                level="M"
                includeMargin={false}
              />
            </div>
            {/* Label */}
            <div className="text-center space-y-0.5">
              <div
                className="text-[9px] font-black uppercase tracking-[0.15em]"
                style={{ color: qr.color }}
              >
                {qr.label}
              </div>
              <div className="text-[9px] text-slate-600 font-semibold">{qr.sublabel}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
