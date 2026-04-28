// components/practice/MasteryHeatmap.tsx
"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getVoicedVariants } from "@/lib/apiClient";
import { Loader2 } from "lucide-react";

export default function MasteryHeatmap({ kanaPool = [], masteryData = {} }: any) {
  const [activeTab, setActiveTab] = useState<"hiragana" | "katakana">("hiragana");

  const displayPool = useMemo(() => {
    if (!kanaPool || kanaPool.length === 0) return [];
    const base = kanaPool.filter((k: any) => k.type?.toLowerCase() === activeTab);
    try {
      const voiced = getVoicedVariants(base);
      return [...base, ...voiced];
    } catch (e) { return base; }
  }, [kanaPool, activeTab]);

  return (
    <div className="space-y-10">
      <div className="flex justify-center">
        <div className="flex p-1 bg-slate-950 border border-white/10 rounded-2xl">
          {["hiragana", "katakana"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-10 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20" : "text-slate-500 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
        <AnimatePresence mode="popLayout">
          {displayPool.map((k : any) => {
            const romajiKey = k.romaji?.toLowerCase();
            const stats = masteryData?.[romajiKey];
            const hasMigration = masteryData?.["initial_migration"];
            
            // LOGIC: Use real data if found, otherwise migration baseline
            let stability = 0;
            if (stats && typeof stats.stability === 'number') {
              stability = stats.stability;
            } else if (hasMigration) {
              stability = 35; // Matches your migration SS
            }

            return (
              <motion.div
                key={`${activeTab}-${k.romaji}`}
                layout
                className="relative h-16 rounded-2xl bg-slate-950 border border-white/5 overflow-hidden group shadow-xl"
              >
                {/* Progress Fill */}
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${stability}%` }}
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-600/50 to-transparent border-t border-purple-500/20"
                />

                <div className="relative z-10 flex flex-col items-center justify-center h-full group-hover:opacity-0 transition-opacity duration-200">
                  <span className="text-xl font-bold text-white tracking-tighter">{k.char}</span>
                  <span className="text-[8px] font-black uppercase opacity-30 text-white">{k.romaji}</span>
                </div>

                {/* Percentage Overlay on Hover */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900 opacity-0 group-hover:opacity-100 transition-all duration-200">
                   <span className="text-xs font-black text-purple-400">{stability}%</span>
                   <span className="text-[7px] text-slate-500 uppercase font-black mt-1">
                     {stats ? 'Live' : 'Migrated'}
                   </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}