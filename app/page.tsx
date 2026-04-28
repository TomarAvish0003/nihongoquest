import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/landing/Hero";
import QuestSelection from "@/components/landing/QuestSelection";

export default function Home() {
  return (
    <main className="bg-slate-950 text-white min-h-screen selection:bg-purple-500/30">
      <Navbar />
      <Hero />
      <QuestSelection />
      
      {/* Visual Spacer */}
      <div className="h-40" />

      <footer className="py-12 border-t border-white/5 text-center">
        <p className="text-slate-600 text-xs tracking-widest uppercase font-bold">
          NihonQuest // 2026 // Prototype v1.0
        </p>
      </footer>
    </main>
  );
}