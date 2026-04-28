"use client";

import { motion } from "framer-motion";

const containerVars = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 }
  }
};

const itemVars = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } }
};

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/10 blur-[150px] rounded-full -z-10" />

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div variants={containerVars} initial="initial" animate="animate">
          <motion.div variants={itemVars} className="inline-block px-4 py-1.5 mb-6 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-widest">
            The Journey Begins
          </motion.div>
          <motion.h1 variants={itemVars} className="text-6xl lg:text-8xl font-black mb-6 leading-[0.9]">
            LEVEL UP YOUR <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">
              JAPANESE
            </span>
          </motion.h1>
          <motion.p variants={itemVars} className="text-slate-400 text-lg lg:text-xl max-w-md mb-8">
            A gamified dojo for mastering Kana. Complete quests, earn XP, and unlock your true linguistic potential.
          </motion.p>
          <motion.div variants={itemVars}>
            <button className="group relative px-8 py-4 bg-purple-600 rounded-xl font-bold overflow-hidden">
              <span className="relative z-10">START QUEST</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </motion.div>
        </motion.div>

        {/* Floating Card UI */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative flex justify-center lg:justify-end"
        >
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="w-full max-w-[400px] aspect-square bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-[40px] shadow-2xl flex items-center justify-center text-[200px] font-bold"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-t from-slate-500 to-white">あ</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}