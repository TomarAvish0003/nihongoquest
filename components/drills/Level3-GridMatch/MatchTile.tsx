"use client";

import { motion } from "framer-motion";

interface MatchTileProps {
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
}

export default function MatchTile({ content, isFlipped, isMatched, onClick }: MatchTileProps) {
  return (
    <motion.button
      whileTap={!isMatched ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={isMatched || isFlipped}
      className={`h-24 sm:h-32 rounded-2xl flex items-center justify-center text-3xl font-bold transition-all duration-300 border-2
        ${isMatched 
          ? "bg-green-500/10 border-green-500/50 text-green-500 opacity-50" 
          : isFlipped 
            ? "bg-slate-900 border-purple-500 text-white" 
            : "bg-slate-800 border-white/5 text-transparent hover:border-white/20"
        }
      `}
    >
      <span className={isFlipped || isMatched ? "opacity-100" : "opacity-0"}>
        {content}
      </span>
    </motion.button>
  );
}