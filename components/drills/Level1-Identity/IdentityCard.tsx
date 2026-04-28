"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function IdentityCard({ char, keyProp }: { char: string; keyProp: string }) {
  return (
    <div className="flex flex-col items-center mb-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={keyProp}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 1.05 }}
          className="w-56 h-56 bg-slate-900 border border-white/10 rounded-[40px] flex items-center justify-center shadow-2xl relative"
        >
          <div className="absolute inset-0 bg-purple-500/5 blur-3xl rounded-full" />
          <span className="text-8xl font-bold relative z-10">{char}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}