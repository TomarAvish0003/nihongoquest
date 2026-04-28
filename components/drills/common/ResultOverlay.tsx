"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { addXP } from "@/lib/xpService";
import { Trophy, RotateCcw, Home, Zap } from "lucide-react";

interface ResultProps {
  score: number;
  accuracy: number;
  onRetry: () => void;
  type: string;
  canPromote?: boolean;
}

export default function ResultOverlay({ score, accuracy, onRetry, type, canPromote }: ResultProps) {
  
  // Determine a "Rank" based on accuracy
  const getRank = () => {
    if (accuracy >= 95) return { label: "S-RANK", color: "text-yellow-400" };
    if (accuracy >= 80) return { label: "A-RANK", color: "text-purple-400" };
    return { label: "B-RANK", color: "text-blue-400" };
  };

  const rank = getRank();

  const handlePromotion = () => {
    // Add a significant XP boost to push them into the next grid tier (4x2 -> 4x4)
    addXP(2000); 
    window.location.reload();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900 border border-white/10 p-8 rounded-[40px] text-center shadow-2xl relative overflow-hidden"
      >
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full" />

        <header className="relative z-10 mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-950 border border-white/5 rounded-2xl mb-4">
            <Trophy className="text-yellow-500" size={32} />
          </div>
          <h2 className={`${rank.color} text-xs font-black uppercase tracking-[0.4em] mb-1`}>
            {rank.label}
          </h2>
          <h3 className="text-4xl font-black italic tracking-tighter">MISSION COMPLETE</h3>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-white/5 border border-white/5 p-5 rounded-3xl">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">XP EARNED</p>
            <p className="text-3xl font-black text-white">+{score}</p>
          </div>
          <div className="bg-white/5 border border-white/5 p-5 rounded-3xl">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">ACCURACY</p>
            <p className="text-3xl font-black text-white">{accuracy}%</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 relative z-10">
          {canPromote && (
            <button 
              onClick={handlePromotion}
              className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-2xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)]"
            >
              <Zap size={18} fill="currentColor" />
              INCREASE DIFFICULTY
            </button>
          )}

          <button 
            onClick={onRetry}
            className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 flex items-center justify-center gap-2 transition-all"
          >
            <RotateCcw size={18} />
            RETRY DRILL
          </button>

          <Link href={`/learn/kana/${type.toLowerCase()}`} className="w-full">
            <button className="w-full py-4 text-slate-500 hover:text-slate-300 font-bold flex items-center justify-center gap-2 transition-all">
              <Home size={18} />
              RETURN TO DOJO
            </button>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}