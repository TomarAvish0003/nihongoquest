"use client";

import { useState } from "react";
import DrillHeader from "../common/DrillHeader";
import ResultOverlay from "../common/ResultOverlay";
import IdentityCard from "../Level1-Identity/IdentityCard";
import RecallInput from "./RecallInput";
import { addXP } from "@/lib/xpService";
// 1. IMPORT AUTH AND SYNC HELPERS
import { useAuth } from "@/context/AuthContext";
import { syncDrillToDB } from "@/lib/apiClient";

export default function RecallManager({ kanaPool, type }: any) {
  // 2. INITIALIZE AUTH CONTEXT
  const { setUser } = useAuth();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isError, setIsError] = useState(false);

  const currentQuestion = kanaPool[currentIndex];

  // 3. INTERNAL SYNC HELPER
  const performSync = async (isCorrect: boolean) => {
    try {
      // Points per question (Recall usually grants more XP, e.g., 15)
      const xpEarned = isCorrect ? 15 : 0;
      
      // Sync with MongoDB
      const updatedUser = await syncDrillToDB(currentQuestion.romaji, isCorrect, xpEarned);
      
      // Update global context for real-time heatmap updates
      if (updatedUser && setUser) {
        setUser(updatedUser);
        console.log(`🛰️ [RECALL SYNC] ${currentQuestion.romaji} | Correct: ${isCorrect}`);
      }
    } catch (err) {
      console.error("❌ Recall Sync failed:", err);
    }
  };

  const handleSubmit = async () => { // Made async for the sync call
    if (!currentQuestion || isGameOver || isError) return;

    const isCorrect = userInput.trim().toLowerCase() === currentQuestion.romaji.toLowerCase();

    // 4. TRIGGER SYNC
    await performSync(isCorrect);

    if (isCorrect) {
      const newScore = score + 150;
      setScore(newScore);
      setUserInput("");
      
      if (currentIndex < kanaPool.length - 1) {
        setCurrentIndex(c => c + 1);
      } else {
        addXP(newScore);
        setIsGameOver(true);
      }
    } else {
      setIsError(true);
      setLives(l => l - 1);
      setTimeout(() => {
        setIsError(false);
        setUserInput("");
        if (lives <= 1) {
          addXP(score);
          setIsGameOver(true);
        }
      }, 600);
    }
  };

  if (isGameOver) return (
    <ResultOverlay score={score} accuracy={Math.round((score / (kanaPool.length * 150)) * 100)} onRetry={() => window.location.reload()} type={type} />
  );

  return (
    <div className="pt-8 w-full max-w-4xl mx-auto px-4">
      <DrillHeader progress={(currentIndex / kanaPool.length) * 100} lives={lives} maxLives={3} score={score} type={type} />
      <IdentityCard char={currentQuestion.char} keyProp={currentQuestion.romaji} />
      <RecallInput value={userInput} onChange={setUserInput} onEnter={handleSubmit} disabled={isError} isError={isError} />
    </div>
  );
}