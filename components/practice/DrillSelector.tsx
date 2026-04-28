"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, Keyboard, Grid, Zap, Lock, Volume2 } from "lucide-react";
import { getXP } from "@/lib/xpService";

const DRILLS = [
  { level: 1, id: "id", title: "Identification", xpReq: 0, icon: <BookOpen size={20} /> },
  { level: 2, id: "recall", title: "Active Recall", xpReq: 0, icon: <Keyboard size={20} /> },
  { level: 3, id: "match", title: "Grid Match", xpReq: 3000, icon: <Grid size={20} /> },
  { level: 4, id: "blitz", title: "Blitz Mode", xpReq: 5000, icon: <Zap size={20} /> },
];

export default function DrillSelector({ type }: { type: string }) {
  const router = useRouter();
  const [userXP, setUserXP] = useState(0);
  const [includeVoiced, setIncludeVoiced] = useState(false);

  useEffect(() => { setUserXP(getXP()); }, []);

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={() => setIncludeVoiced(!includeVoiced)}
          className={`flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all ${
            includeVoiced ? "bg-purple-600/20 border-purple-500 text-purple-400" : "bg-slate-900 border-white/5 text-slate-500"
          }`}
        >
          <Volume2 size={18} className={includeVoiced ? "animate-pulse" : ""} />
          <span className="text-[10px] font-black uppercase tracking-widest">Include Voiced (゛/ ゜)</span>
        </button>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Current Mastery</p>
          <p className="text-2xl font-black text-white">{userXP} XP</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DRILLS.map((drill) => {
          const isUnlocked = userXP >= drill.xpReq;
          // Force voiced for level 4
          const finalVoiced = drill.level === 4 || includeVoiced;

          return (
            <motion.button
              key={drill.id}
              whileHover={isUnlocked ? { y: -5 } : {}}
              onClick={() => isUnlocked && router.push(`/learn/kana/${type}/drill?level=${drill.level}&voiced=${finalVoiced}`)}
              className={`p-6 rounded-[32px] text-left border relative transition-all ${
                isUnlocked ? "bg-slate-900/40 border-white/5" : "bg-slate-950 border-transparent opacity-40 cursor-not-allowed"
              }`}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-6 ${
                isUnlocked ? "bg-purple-600/20 text-purple-400" : "bg-slate-800 text-slate-600"
              }`}>
                {isUnlocked ? drill.icon : <Lock size={18} />}
              </div>
              <h3 className="font-bold text-lg mb-1">{drill.title}</h3>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Level {drill.level}</p>
              {drill.level === 4 && (
                <span className="absolute top-4 right-4 bg-purple-500 text-[8px] font-black px-2 py-1 rounded">ULTIMATE</span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}