"use client";
import { motion } from "framer-motion";

export default function KanaGrid({ data, mode }: { data: any[][], mode: number }) {
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-4">
      {data.map((row, rIdx) => (
        <div key={rIdx} className="grid grid-cols-5 gap-4">
          {row.map((kana, cIdx) => {
            // Logic to determine the content of the card's back face
            const variation = mode === 1 ? kana?.voiced : mode === 2 ? kana?.semiVoiced : null;
            const isFlipped = mode !== 0 && !!variation;

            return (
              <div key={cIdx} className="h-28 sm:h-32 w-full perspective-1000">
                {kana ? (
                  <motion.div
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 25 }}
                    className="relative w-full h-full preserve-3d cursor-pointer"
                  >
                    {/* Front Side: Basic */}
                    <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center bg-slate-900 border border-white/5 rounded-[32px] group hover:border-white/20 transition-all">
                      <span className="text-4xl font-bold">{kana.char}</span>
                      <span className="text-[10px] text-slate-500 font-black uppercase mt-2 tracking-widest">{kana.romaji}</span>
                    </div>

                    {/* Back Side: Transformation */}
                    <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center bg-purple-900/20 border border-purple-500/40 rounded-[32px] rotate-y-180">
                      <span className={`text-4xl font-bold ${mode === 2 ? 'text-pink-300' : 'text-purple-300'}`}>
                        {variation?.char || kana.char}
                      </span>
                      <span className={`text-[10px] font-black uppercase mt-2 tracking-widest ${mode === 2 ? 'text-pink-500' : 'text-purple-500'}`}>
                        {variation?.romaji || kana.romaji}
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center opacity-10">
                    <div className="w-2 h-2 bg-slate-700 rounded-full" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}