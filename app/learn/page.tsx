"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchKana, syncDrillToDB } from "@/lib/apiClient";
import MasteryHeatmap from "@/components/practice/MasteryHeatmap";
import { motion } from "framer-motion";
import Link from "next/link";
import { Zap, Trophy, ChevronRight, RefreshCw } from "lucide-react";

export default function LearnHub() {
  const { user, loading, refreshUser } = useAuth();
  const [allKana, setAllKana] = useState<any[]>([]);
  const [isMigrating, setIsMigrating] = useState(false);

  // 1. Fetch the Grid Structure
  useEffect(() => {
    async function loadGrid() {
      try {
        const hira = await fetchKana("hiragana");
        const kata = await fetchKana("katakana");
        if (hira && kata) {
          setAllKana([...hira, ...kata]);
        }
      } catch (err) {
        console.error("❌ [Hub] Pool Fetch Failed:", err);
      }
    }
    loadGrid();
  }, []);

  // 2. Handle Migration
  useEffect(() => {
    async function handleMigration() {
      const localXP = parseInt(localStorage.getItem("nihonquest_total_xp") || "0");
      if (user && user.xp === 0 && localXP > 0) {
        setIsMigrating(true);
        try {
          await syncDrillToDB("initial_migration", true, localXP);
          localStorage.removeItem("nihonquest_total_xp");
          await refreshUser();
        } catch (err) {
          console.error("❌ [Hub] Migration Error:", err);
        } finally {
          setIsMigrating(false);
        }
      }
    }
    if (!loading && user) handleMigration();
  }, [user, loading, refreshUser]);

  if (isMigrating) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <RefreshCw className="text-purple-500 animate-spin" size={40} />
        <p className="text-purple-500 font-black tracking-widest uppercase text-xs">Migrating Neural Data...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white relative pt-32 pb-20 px-6 overflow-x-hidden">
      {/* Background Decorations - Fixed Z-Index */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-600/5 blur-[120px] pointer-events-none -z-10" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-7xl font-black italic tracking-tighter leading-none mb-4 uppercase">
              {user?.username || "Warrior"}
            </h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em]">
              Neural Sync: <span className={user ? "text-green-500" : "text-amber-500"}>
                {user ? "Online" : "Guest Mode"}
              </span>
            </p>
          </motion.div>

          <div className="flex gap-4">
            <StatBox icon={<Zap size={20} fill="currentColor" />} value={user?.xp || 0} label="Cloud XP" color="text-yellow-500" />
            <StatBox icon={<Trophy size={20} />} value={user?.level || 1} label="Mastery Level" color="text-purple-500" />
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          {/* Path Selection */}
          <div className="xl:col-span-4 space-y-6">
            <PathCard title="Hiragana" type="hiragana" color="from-purple-600 to-indigo-700" />
            <PathCard title="Katakana" type="katakana" color="from-blue-600 to-cyan-700" />
          </div>

          {/* Mastery Heatmap Area */}
          <div className="xl:col-span-8">
            <div className="bg-slate-900/40 border border-white/5 backdrop-blur-xl rounded-[40px] p-8 md:p-10 shadow-2xl">
              <div className="mb-8">
                <h2 className="text-xl font-black italic uppercase tracking-tighter">Cognitive Mastery Map</h2>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Synaptic stability verified via MongoDB</p>
              </div>
              
              <MasteryHeatmap 
                kanaPool={allKana} 
                masteryData={user?.mastery || {}} 
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatBox({ icon, value, label, color }: any) {
  return (
    <div className="bg-slate-900/80 border border-white/5 p-6 rounded-[28px] min-w-[150px] backdrop-blur-md">
      <div className={`mb-3 ${color}`}>{icon}</div>
      <p className="text-2xl font-black italic text-white leading-none">{value.toLocaleString()}</p>
      <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mt-2">{label}</p>
    </div>
  );
}

function PathCard({ title, type, color }: any) {
  return (
    <Link href={`/learn/kana/${type}`}>
      <div className={`relative p-8 rounded-[32px] bg-gradient-to-br ${color} overflow-hidden group cursor-pointer border border-white/10 transition-transform hover:scale-[1.02]`}>
        <h3 className="text-3xl font-black italic relative z-10 text-white">{title.toUpperCase()}</h3>
        <div className="mt-4 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest bg-black/20 w-fit px-4 py-2 rounded-full relative z-10 text-white">
          Enter Dojo <ChevronRight size={12} />
        </div>
        <span className="absolute -bottom-6 -right-6 text-[120px] font-black italic opacity-10 group-hover:scale-110 transition-transform pointer-events-none text-white">
          {type === 'hiragana' ? 'あ' : 'ア'}
        </span>
      </div>
    </Link>
  );
}