"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import Link from "next/link";
import { KeyRound } from "lucide-react";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(form);
    } catch (err: any) {
      alert(err.message || "Invalid credentials");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900 border border-white/5 p-10 rounded-[40px] shadow-2xl"
      >
        <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/30">
          <KeyRound className="text-blue-500" size={32} />
        </div>

        <h1 className="text-4xl font-black italic text-white mb-2">WELCOME <span className="text-blue-500">BACK</span></h1>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-10">Return to your training, warrior</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 ml-4 tracking-widest">Email Address</label>
            <input 
              type="email" 
              placeholder="shogun@quest.com" 
              className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-blue-500 outline-none transition-all"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 ml-4 tracking-widest">Secret Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-blue-500 outline-none transition-all"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button 
            disabled={isSubmitting}
            className="w-full py-5 bg-blue-600 rounded-2xl font-black text-white hover:bg-blue-500 transition-all active:scale-95 mt-6 disabled:opacity-50"
          >
            {isSubmitting ? "ENTERING DOJO..." : "CONTINUE TRAINING"}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 text-xs font-bold tracking-widest">
          NEW TO THE QUEST? <Link href="/signup" className="text-blue-500 hover:underline">CREATE ACCOUNT</Link>
        </p>
      </motion.div>
    </div>
  );
}