"use client";

import { useState, useEffect, useRef } from "react";
import DrillHeader from "../common/DrillHeader";
import ResultOverlay from "../common/ResultOverlay";
import MatchTile from "./MatchTile";
import { addXP, getXP } from "@/lib/xpService";
import { motion, AnimatePresence } from "framer-motion";
// 1. IMPORT AUTH AND SYNC HELPERS
import { useAuth } from "@/context/AuthContext";
import { syncDrillToDB } from "@/lib/apiClient";

type Difficulty = {
  key: "easy" | "medium" | "hard";
  pairs: number;
};

const DIFFICULTIES: Difficulty[] = [
  { key: "easy", pairs: 4 },
  { key: "medium", pairs: 8 },
  { key: "hard", pairs: 12 },
];

const GRID_CLASSES = {
  easy: "grid-cols-4 grid-rows-2",
  medium: "grid-cols-4 grid-rows-4",
  hard: "grid-cols-6 grid-rows-4",
};

export default function GridMatchManager({ kanaPool, type }: any) {
  // 2. INITIALIZE AUTH CONTEXT
  const { setUser } = useAuth();

  const [tiles, setTiles] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(true);
  const [previewCount, setPreviewCount] = useState(10);
  const [timer, setTimer] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [difficultyIndex, setDifficultyIndex] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const previewRef = useRef<NodeJS.Timeout | null>(null);
  const mismatchRef = useRef<NodeJS.Timeout | null>(null);
  const endRef = useRef<NodeJS.Timeout | null>(null);
  const gameOverRef = useRef(false);

  const difficulty = DIFFICULTIES[difficultyIndex];
  const currentPairCount = difficulty.pairs;

  // 3. INTERNAL SYNC HELPER
  const performSync = async (romaji: string) => {
    try {
      // Logic: Matching a pair correctly is a mastery "hit"
      // We grant a small amount of XP per pair (e.g., 5)
      const updatedUser = await syncDrillToDB(romaji, true, 5);
      
      if (updatedUser && setUser) {
        setUser(updatedUser);
        console.log(`🛰️ [MATCH SYNC] Pair Matched: ${romaji}`);
      }
    } catch (err) {
      console.error("❌ GridMatch Sync failed:", err);
    }
  };

  const clearAllTimers = () => {
    if (previewRef.current) clearInterval(previewRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    if (mismatchRef.current) clearTimeout(mismatchRef.current);
    if (endRef.current) clearTimeout(endRef.current);
    previewRef.current = null;
    timerRef.current = null;
    mismatchRef.current = null;
    endRef.current = null;
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setTimer((t) => t + 1);
    }, 1000);
  };

  const buildTiles = (count: number) => {
    if (kanaPool.length < count) {
      alert(`Not enough kana in the pool to build ${count} pairs. Please provide at least ${count} unique kana.`);
      setTiles([]);
      return;
    }
    const shuffledPool = [...kanaPool].sort(() => 0.5 - Math.random());
    const selection = shuffledPool.slice(0, count);
    const gameTiles: any[] = [];

    selection.forEach((k: any) => {
      const uniqueId = Math.random().toString(36).slice(2, 11);
      gameTiles.push({
        id: `k-${k.romaji}-${uniqueId}`,
        charId: k.romaji,
        content: k.char,
      });
      gameTiles.push({
        id: `r-${k.romaji}-${uniqueId}`,
        charId: k.romaji,
        content: k.romaji,
      });
    });

    setTiles(gameTiles.sort(() => Math.random() - 0.5));
  };

  const resetLevelState = () => {
    setFlipped([]);
    setMatched([]);
    setTimer(0);
    setPreviewCount(10);
    setIsPreviewing(true);
    gameOverRef.current = false;
  };

  const startLevel = (index: number) => {
    clearAllTimers();
    setDifficultyIndex(index);
    resetLevelState();
    buildTiles(DIFFICULTIES[index].pairs);
    setHasLoaded(true);

    previewRef.current = setInterval(() => {
      setPreviewCount((prev) => {
        if (prev <= 1) {
          if (previewRef.current) {
            clearInterval(previewRef.current);
            previewRef.current = null;
          }
          setIsPreviewing(false);
          startTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    const xp = getXP();
    setTotalXP(xp);
    
    let startIdx = 0;
    if (xp >= 6000) startIdx = 2;
    else if (xp >= 3000) startIdx = 1;

    startLevel(startIdx);

    return () => {
      clearAllTimers();
    };
  }, [kanaPool]);

  const advanceOrFinish = () => {
    if (gameOverRef.current) return;
    gameOverRef.current = true;
    stopTimer();

    const finalScore = Math.max(150, 1000 - timer * 10);
    addXP(finalScore);

    if (difficultyIndex < DIFFICULTIES.length - 1) {
      endRef.current = setTimeout(() => {
        startLevel(difficultyIndex + 1);
      }, 700);
    } else {
      endRef.current = setTimeout(() => setIsGameOver(true), 600);
    }
  };

  const handleTileClick = async (index: number) => { // Made async
    if (
      isPreviewing ||
      gameOverRef.current ||
      flipped.length === 2 ||
      flipped.includes(index) ||
      matched.includes(tiles[index]?.charId)
    )
      return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;

      if (tiles[first].charId === tiles[second].charId) {
        // 4. TRIGGER SYNC ON SUCCESSFUL MATCH
        await performSync(tiles[first].charId);

        const newMatched = [...matched, tiles[first].charId];
        setMatched(newMatched);
        setFlipped([]);

        if (newMatched.length === currentPairCount) {
          advanceOrFinish();
        }
      } else {
        mismatchRef.current = setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!hasLoaded) return null;

  if (isGameOver) {
    return (
      <ResultOverlay
        score={Math.max(150, 1000 - timer * 10)}
        accuracy={100}
        onRetry={() => window.location.reload()}
        type={type}
        canPromote={totalXP < 6000}
      />
    );
  }

  return (
    <div className="pt-4 w-full flex flex-col items-center px-4 min-h-[600px]">
      <div className="w-full max-w-4xl">
        <DrillHeader
          progress={(matched.length / currentPairCount) * 100}
          lives={3}
          maxLives={3}
          score={totalXP}
          type={type}
        />
      </div>

      <div className="w-full max-w-2xl flex justify-between items-end mb-10">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2">
            Elapsed Time
          </span>
          <span className="text-5xl font-mono font-bold text-white tracking-tighter leading-none">
            {formatTime(timer)}
          </span>
        </div>

        <AnimatePresence>
          {isPreviewing && (
            <motion.div
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-right"
            >
              <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest block mb-1">
                Memorize
              </span>
              <span className="text-4xl font-black italic text-purple-400 leading-none">
                {previewCount}s
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div
        className={`grid gap-4 w-full max-w-4xl mx-auto ${
          GRID_CLASSES[difficulty.key]
        }`}
      >
        {tiles.map((tile, idx) => (
          <MatchTile
            key={tile.id}
            content={tile.content}
            isFlipped={isPreviewing || flipped.includes(idx)}
            isMatched={matched.includes(tile.charId)}
            onClick={() => handleTileClick(idx)}
          />
        ))}
      </div>
    </div>
  );
}