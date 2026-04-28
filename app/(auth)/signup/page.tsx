"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function SignupPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(form);
    } catch (err: any) {
      alert(err.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-slate-900 border border-white/5 p-10 rounded-[40px] shadow-2xl"
      >
        <div className="w-16 h-16 bg-purple-600/20 rounded-2xl flex items-center justify-center mb-8 border border-purple-500/30">
          <ShieldCheck className="text-purple-500" size={32} />
        </div>

        <h1 className="text-4xl font-black italic text-white mb-2">NEW <span className="text-purple-500">WARRIOR</span></h1>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-10">Start your journey today</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" placeholder="Username" 
            className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-purple-500 outline-none transition-all"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <input 
            type="email" placeholder="Email" 
            className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-purple-500 outline-none transition-all"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input 
            type="password" placeholder="Password" 
            className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-purple-500 outline-none transition-all"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button className="w-full py-5 bg-purple-600 rounded-2xl font-black text-white hover:bg-purple-500 transition-all active:scale-95 mt-4">
            CREATE ACCOUNT
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 text-xs font-bold tracking-widest">
          ALREADY TRAINED? <Link href="/login" className="text-purple-500 hover:underline">LOGIN HERE</Link>
        </p>
      </motion.div>
    </div>
  );
}