"use client";

import { motion } from "framer-motion";
import QuestCard from "./QuestCard";

export default function QuestSelection() {
  return (
    <section className="py-24 px-6 container mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="text-sm font-black tracking-[0.3em] text-purple-500 uppercase mb-4">
          Choose Your Destiny
        </h2>
        <p className="text-4xl md:text-5xl font-bold tracking-tighter">
          Pick your first <span className="italic text-slate-500">Quest</span>
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <QuestCard 
          title="Hiragana"
          subtitle="The Soft Foundation"
          kana="あ"
          href="/learn/kana/hiragana"
          accentColor="bg-blue-500"
        />
        <QuestCard 
          title="Katakana"
          subtitle="The Sharp Edge"
          kana="ア"
          href="/learn/kana/katakana"
          accentColor="bg-purple-500"
        />
      </div>

      {/* Decorative "Locked" cards for future content */}
      <div className="mt-8 grid md:grid-cols-3 gap-6 opacity-40 grayscale pointer-events-none">
        {['Kanji N5', 'Grammar', 'Vocabulary'].map((item) => (
          <div key={item} className="p-6 border border-white/5 rounded-2xl flex justify-between items-center">
            <span className="text-sm font-bold uppercase tracking-widest">{item}</span>
            <span className="text-xs px-2 py-1 bg-white/10 rounded">LOCKED</span>
          </div>
        ))}
      </div>
    </section>
  );
}