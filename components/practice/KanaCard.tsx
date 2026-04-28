"use client";
import { motion } from "framer-motion";

export default function KanaCard({ kana, isVoicedMode }: { kana: any, isVoicedMode: boolean }) {
  // Check if this specific card has a voiced version
  const voicedData = isVoicedMode ? (kana.voiced || null) : null;
  const displayChar = voicedData ? voicedData.char : kana.char;
  const displayRomaji = voicedData ? voicedData.romaji : kana.romaji;

  return (
    <div className="h-24 sm:h-28 w-full perspective-1000">
      <motion.div
        animate={{ rotateY: isVoicedMode && kana.voiced ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        className="relative w-full h-full preserve-3d"
      >
        {/* Front Side (Basic) */}
        <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center bg-slate-900/40 border border-white/5 rounded-3xl group hover:border-purple-500/50 transition-colors cursor-pointer">
          <span className="text-3xl sm:text-4xl font-bold">{kana.char}</span>
          <span className="text-[10px] text-slate-500 font-bold uppercase mt-1">{kana.romaji}</span>
        </div>

        {/* Back Side (Voiced) */}
        <div 
          className="absolute inset-0 backface-hidden flex flex-col items-center justify-center bg-purple-900/20 border border-purple-500/40 rounded-3xl rotate-y-180"
        >
          <span className="text-3xl sm:text-4xl font-bold text-purple-300">{displayChar}</span>
          <span className="text-[10px] text-purple-500 font-black uppercase mt-1">{displayRomaji}</span>
        </div>
      </motion.div>
    </div>
  );
}