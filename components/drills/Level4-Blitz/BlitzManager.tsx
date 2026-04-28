"use client";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { syncDrillToDB } from "@/lib/apiClient";
import { playKanaSound, playSFX } from "@/lib/audioService";
import IdentityCard from "../Level1-Identity/IdentityCard";
import ResultOverlay from "../common/ResultOverlay";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Flame, Target, Trophy } from "lucide-react";

export default function BlitzManager({ kanaPool, type }: any) {
  const { setUser } = useAuth();

  const [timeLeft, setTimeLeft] = useState(20);
  const [blitzScore, setBlitzScore] = useState(0); // For Leaderboard
  const [combo, setCombo] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [feedback, setFeedback] = useState<"hit" | "miss" | null>(null);

  const current = kanaPool[currentIndex];

  // Calculate Multiplier (Capped at 10x)
  const multiplier = Math.min(Math.floor(combo / 5) + 1, 10);
  const isHyperMode = multiplier >= 5;

  useEffect(() => {
    if (timeLeft <= 0) {
      playSFX("complete");
      setIsGameOver(true);
      return;
    }
    const t = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  const choices = useMemo(() => {
    const distractors = kanaPool.filter((k: any) => k.romaji !== current.romaji)
      .sort(() => 0.5 - Math.random()).slice(0, combo > 10 ? 5 : 3);
    return [...distractors, current].sort(() => 0.5 - Math.random());
  }, [current, combo, kanaPool]);

  const performSync = async (romaji: string, isCorrect: boolean) => {
    try {
      // XP is fixed at 10 per correct answer to prevent powercreep
      const xpEarned = isCorrect ? 10 : 0;
      const updatedUser = await syncDrillToDB(romaji, isCorrect, xpEarned);
      if (updatedUser && setUser) setUser(updatedUser);
    } catch (err) {
      console.error("❌ Sync failed:", err);
    }
  };

  const handleSelect = async (selected: string) => {
    const isCorrect = selected === current.romaji;
    await performSync(current.romaji, isCorrect);

    if (isCorrect) {
      setFeedback("hit");
      playKanaSound(current.char);
      playSFX("correct");
      
      // Blitz Score scales with multiplier, XP does not.
      setBlitzScore(s => s + (100 * multiplier));
      setCombo(c => c + 1);
      setTimeLeft(t => Math.min(t + 1.5, 30));
      setCurrentIndex(Math.floor(Math.random() * kanaPool.length));
    } else {
      setFeedback("miss");
      playSFX("incorrect");
      setCombo(0);
      setTimeLeft(t => Math.max(0, t - 4));
    }
    setTimeout(() => setFeedback(null), 300);
  };

  if (isGameOver) return (
    <ResultOverlay 
      score={blitzScore} 
      accuracy={100} 
      onRetry={() => window.location.reload()} 
      type={`${type} BLITZ`} 
    />
  );

  return (
    <div className={`min-h-screen pt-20 flex flex-col items-center transition-colors duration-500 ${isHyperMode ? 'bg-purple-900/10' : 'bg-transparent'}`}>
      
      {/* Dynamic Scoreboard */}
      <div className="w-full max-w-4xl px-6 flex justify-between items-start mb-12">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-slate-500 font-black text-[10px] tracking-[0.3em] uppercase">
            <Trophy size={14} /> Blitz Score
          </div>
          <motion.div 
            key={blitzScore}
            initial={{ scale: 1.1, color: "#fff" }}
            animate={{ scale: 1, color: "#fff" }}
            className="text-5xl font-black italic tracking-tighter"
          >
            {blitzScore.toLocaleString()}
          </motion.div>
        </div>

        <div className="text-right space-y-2">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Time Remaining</div>
          <motion.div 
            animate={timeLeft < 5 ? { scale: [1, 1.2, 1], color: ["#fff", "#ef4444", "#fff"] } : {}}
            transition={{ repeat: Infinity, duration: 0.5 }}
            className={`text-6xl font-black tabular-nums ${timeLeft < 5 ? 'text-red-500' : 'text-white'}`}
          >
            {timeLeft}<span className="text-2xl ml-1 text-slate-600">s</span>
          </motion.div>
        </div>
      </div>

      {/* Multiplier Gauge */}
      <div className="relative mb-12">
        <div className="flex items-center gap-4 bg-black/40 border border-white/5 px-8 py-4 rounded-3xl backdrop-blur-xl">
          <motion.div
            animate={isHyperMode ? { rotate: [0, -10, 10, 0] } : {}}
            transition={{ repeat: Infinity, duration: 0.2 }}
          >
            <Flame className={isHyperMode ? "text-orange-500" : "text-purple-500"} fill="currentColor" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Multiplier</span>
            <span className={`text-3xl font-black italic ${isHyperMode ? 'text-orange-400' : 'text-purple-400'}`}>
              {multiplier}x
            </span>
          </div>
          {/* Progress to next mult */}
          <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden ml-4">
             <motion.div 
               className={`h-full ${isHyperMode ? 'bg-orange-500' : 'bg-purple-500'}`}
               animate={{ width: `${(combo % 5) * 20}%` }}
             />
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <motion.div 
        animate={feedback === "miss" ? { x: [-10, 10, -10, 10, 0] } : feedback === "hit" ? { scale: [1, 1.05, 1] } : {}}
        className="relative"
      >
        <AnimatePresence>
          {feedback === "hit" && (
            <motion.div 
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -100 }}
              className="absolute -top-12 left-1/2 -translate-x-1/2 text-2xl font-black text-green-400 z-50"
            >
              +{100 * multiplier}
            </motion.div>
          )}
        </AnimatePresence>
        
        <IdentityCard char={current.char} keyProp={current.romaji} />
      </motion.div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-lg mt-12 px-6">
        {choices.map((c: any) => (
          <motion.button
            key={c.romaji}
            whileHover={{ scale: 1.02, translateY: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(c.romaji)}
            className={`py-8 rounded-[32px] font-black text-2xl tracking-tighter transition-all border shadow-2xl
              ${feedback === "hit" && c.romaji === current.romaji ? 'bg-green-500 border-green-400 text-white' : 
                'bg-slate-900/80 border-white/5 text-slate-300 hover:border-purple-500/50 hover:text-white'}
            `}
          >
            {c.romaji.toUpperCase()}
          </motion.button>
        ))}
      </div>

      {/* Visual Incentive: Combo Particles would go here */}
    </div>
  );
}