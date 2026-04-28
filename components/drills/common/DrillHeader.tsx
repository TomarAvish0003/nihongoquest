"use client";

import { motion } from "framer-motion";
import { X, Heart } from "lucide-react";
import Link from "next/link";

interface DrillHeaderProps {
  progress: number;
  lives: number;
  maxLives: number;
  score: number;
  type: string;
}

export default function DrillHeader({ progress, lives, maxLives, score, type }: DrillHeaderProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-12 flex items-center gap-6 px-4">
      <Link href={`/learn/kana/${type.toLowerCase()}`}>
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-500 hover:text-white">
          <X size={24} />
        </button>
      </Link>

      <div className="flex-1 h-2.5 bg-slate-900 rounded-full border border-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-purple-600 to-pink-500"
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex gap-1">
          {[...Array(maxLives)].map((_, i) => (
            <motion.div key={i} animate={{ opacity: i < lives ? 1 : 0.2, scale: i < lives ? 1 : 0.8 }}>
              <Heart size={18} fill={i < lives ? "#ef4444" : "transparent"} className="text-red-500" />
            </motion.div>
          ))}
        </div>
        <div className="text-right min-w-[60px]">
          <span className="text-lg font-mono font-bold text-purple-400">{score}</span>
        </div>
      </div>
    </div>
  );
}