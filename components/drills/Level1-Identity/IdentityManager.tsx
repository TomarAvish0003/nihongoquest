"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import IdentityCard from "./IdentityCard";
import ChoiceGrid from "./ChoiceGrid";
import DrillHeader from "../common/DrillHeader";
import ResultOverlay from "../common/ResultOverlay";
import { addXP } from "@/lib/xpService";
// 1. IMPORT AUTH AND SYNC HELPERS
import { useAuth } from "@/context/AuthContext";
import { syncDrillToDB } from "@/lib/apiClient";

export default function IdentityManager({ kanaPool, type }: { kanaPool: any[], type: string }) {
  // 2. INITIALIZE AUTH CONTEXT
  const { setUser } = useAuth();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);

  const currentQuestion = kanaPool[currentIndex];

  const choices = useMemo(() => {
    if (!currentQuestion) return [];
    const distractors = kanaPool
      .filter((k) => k.romaji !== currentQuestion.romaji)
      .sort(() => Math.random() - 0.5).slice(0, 3).map((k) => k.romaji);
    return [...distractors, currentQuestion.romaji].sort(() => Math.random() - 0.5);
  }, [currentIndex, kanaPool]);

  // 3. INTERNAL SYNC HELPER
  const performSync = async (isCorrect: boolean) => {
    try {
      // Points per question (adjust as needed)
      const xpEarned = isCorrect ? 10 : 0;
      
      // Sync with MongoDB using the Atomic $set logic we built
      const updatedUser = await syncDrillToDB(currentQuestion.romaji, isCorrect, xpEarned);
      
      // Update global context so Heatmap sees the new 'stability'
      if (updatedUser && setUser) {
        setUser(updatedUser);
        console.log(`🛰️ Sync Complete: ${currentQuestion.romaji} | Correct: ${isCorrect}`);
      }
    } catch (err) {
      console.error("❌ Sync failed:", err);
    }
  };

  const handleSelect = async (selected: string) => { // Added async
    if (feedback || isGameOver) return;

    const isCorrect = selected === currentQuestion.romaji;

    // 4. FIRE SYNC ON EVERY ANSWER
    // This ensures mastery updates even if you don't finish the whole session
    await performSync(isCorrect);

    if (isCorrect) {
      setFeedback("correct");
      setScore(s => s + 100);
      setTimeout(() => {
        setFeedback(null);
        if (currentIndex < kanaPool.length - 1) setCurrentIndex(c => c + 1);
        else {
          addXP(score + 100);
          setIsGameOver(true);
        }
      }, 600);
    } else {
      setFeedback("incorrect");
      setLives(l => l - 1);
      setTimeout(() => {
        if (lives <= 1) {
          addXP(score);
          setIsGameOver(true);
        } else setFeedback(null);
      }, 600);
    }
  };

  if (isGameOver) return (
    <ResultOverlay score={score} accuracy={Math.round((score / (kanaPool.length * 100)) * 100)} onRetry={() => window.location.reload()} type={type} />
  );

  return (
    <div className="pt-8 w-full max-w-4xl mx-auto px-4">
      <DrillHeader progress={(currentIndex / kanaPool.length) * 100} lives={lives} maxLives={3} score={score} type={type} />
      <motion.div animate={feedback === "incorrect" ? { x: [-5, 5, -5, 5, 0] } : {}}>
        <IdentityCard char={currentQuestion.char} keyProp={currentQuestion.romaji} />
        <ChoiceGrid choices={choices} onSelect={handleSelect} disabled={!!feedback} />
      </motion.div>
    </div>
  );
}