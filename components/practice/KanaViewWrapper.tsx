"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import KanaGrid from "./KanaGrid";

export default function KanaViewWrapper({ data }: { data: any[][] }) {
  const [mode, setMode] = useState(0); // 0: Basic, 1: Dakuten, 2: Handakuten

  const modes = [
    { label: "BASIC", color: "text-slate-400" },
    { label: "DAKUTEN (゛)", color: "text-purple-400" },
    { label: "HANDAKUTEN (゜)", color: "text-pink-400" }
  ];

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col items-center gap-4 mb-16">
        <div className="flex p-1.5 bg-slate-900 border border-white/5 rounded-2xl">
          {modes.map((m, idx) => (
            <button
              key={m.label}
              onClick={() => setMode(idx)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${
                mode === idx ? "bg-purple-600 text-white shadow-lg" : "text-slate-600 hover:text-slate-400"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <p className="text-[10px] font-bold text-slate-700 tracking-[0.3em] uppercase">
          Current Mode: {modes[mode].label}
        </p>
      </div>

      <KanaGrid data={data} mode={mode} />
    </div>
  );
}