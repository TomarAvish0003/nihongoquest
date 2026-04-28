"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface QuestCardProps {
  title: string;
  subtitle: string;
  kana: string;
  href: string;
  accentColor: string;
}

export default function QuestCard({ title, subtitle, kana, href, accentColor }: QuestCardProps) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ y: -8 }}
        className="group relative p-8 rounded-[32px] bg-slate-900/40 border border-white/5 hover:border-white/20 transition-colors overflow-hidden"
      >
        {/* Animated Background Glow */}
        <div className={`absolute -bottom-12 -right-12 w-40 h-40 blur-[80px] rounded-full transition-opacity opacity-20 group-hover:opacity-40 ${accentColor}`} />

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h3 className="text-3xl font-bold mb-2 tracking-tight">{title}</h3>
              <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">{subtitle}</p>
            </div>
            <motion.span 
              initial={{ opacity: 0.2, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1.1, rotate: -5 }}
              className="text-6xl font-black text-white/10 group-hover:text-white transition-all duration-500"
            >
              {kana}
            </motion.span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-[2px] bg-white/5 overflow-hidden">
              <motion.div 
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.5 }}
                className={`h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent`}
              />
            </div>
            <span className="text-xs font-bold tracking-widest text-slate-400 group-hover:text-white transition-colors">
              SELECT PATH
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}