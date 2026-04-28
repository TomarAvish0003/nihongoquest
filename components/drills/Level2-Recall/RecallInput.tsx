"use client";

import { motion } from "framer-motion";

interface RecallInputProps {
  value: string;
  onChange: (val: string) => void;
  onEnter: () => void;
  disabled: boolean;
  isError: boolean;
}

export default function RecallInput({ value, onChange, onEnter, disabled, isError }: RecallInputProps) {
  return (
    <div className="w-full max-w-sm mx-auto">
      <motion.div
        animate={isError ? { x: [-10, 10, -10, 10, 0] } : {}}
        className={`relative group ${disabled ? 'opacity-50' : ''}`}
      >
        <input
          autoFocus
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.toLowerCase())}
          onKeyDown={(e) => e.key === "Enter" && onEnter()}
          disabled={disabled}
          placeholder="Type Romaji..."
          className={`w-full bg-slate-900 border-2 py-6 px-4 rounded-3xl text-center text-3xl font-black tracking-widest outline-none transition-all
            ${isError ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'border-white/5 focus:border-purple-500'}
          `}
        />
        <div className="mt-4 text-center text-[10px] font-black text-slate-600 uppercase tracking-widest">
          Press Enter to Submit
        </div>
      </motion.div>
    </div>
  );
}