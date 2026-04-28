"use client";
import { motion } from "framer-motion";

export default function ChoiceGrid({ choices, onSelect, disabled }: any) {
  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-md mx-auto px-4">
      {choices.map((choice: string) => (
        <motion.button
          key={choice}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(choice)}
          disabled={disabled}
          className="py-6 bg-slate-900 border border-white/5 rounded-3xl text-2xl font-black hover:border-purple-500/50 transition-colors disabled:opacity-50"
        >
          {choice.toUpperCase()}
        </motion.button>
      ))}
    </div>
  );
}