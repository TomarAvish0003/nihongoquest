"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Zap, LogOut, User as UserIcon, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();

  // ONLY hide navbar when inside a specific drill session
  // This allows it to show on /learn, /practice, /leaderboard, etc.
  if (pathname.includes("/drill")) return null;

  return (
    <nav className="fixed top-0 w-full z-[100] border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center font-bold text-xl group-hover:rotate-12 transition-transform text-white">
            N
          </div>
          <span className="text-xl font-bold tracking-tighter uppercase text-white">
            Nihon<span className="text-purple-500">Quest</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <Link href="/learn" className={`transition-colors ${pathname === '/learn' ? 'text-white' : 'hover:text-white'}`}>
            Dojo
          </Link>
          <Link href="/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link>
          
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            ) : user ? (
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-6"
              >
                {/* XP Indicator */}
                <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full">
                  <Zap size={14} className="text-purple-500 fill-purple-500" />
                  <span className="text-purple-400 font-bold tabular-nums">
                    {user.xp.toLocaleString()} <span className="text-[10px] uppercase opacity-60">XP</span>
                  </span>
                </div>

                {/* Profile/Learn Link */}
                <Link href="/learn" className="flex items-center gap-2 hover:text-white transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center group-hover:bg-purple-600 transition-colors text-white">
                    <UserIcon size={16} />
                  </div>
                  <span className="font-bold text-slate-200 group-hover:text-white transition-colors">
                    {user.username}
                  </span>
                </Link>

                {/* Logout */}
                <button 
                  onClick={logout}
                  className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </motion.div>
            ) : (
              <Link href="/login">
                <button className="px-5 py-2 bg-white text-black rounded-full hover:bg-purple-400 transition-colors font-bold uppercase text-[10px] tracking-widest">
                  Login
                </button>
              </Link>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          <div className="space-y-1.5">
            <span className={`block w-6 h-0.5 bg-white transition-transform ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-opacity ${isOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-transform ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>
    </nav>
  );
}