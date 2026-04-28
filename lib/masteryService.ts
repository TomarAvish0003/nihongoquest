"use client";

export type MasteryData = {
  stability: number; 
  lastSeen: number;
  mistakes: number;
};

export const updateMastery = (charId: string, isCorrect: boolean) => {
  if (typeof window === "undefined") return;
  const data = JSON.parse(localStorage.getItem("kana_mastery") || "{}");
  const stats: MasteryData = data[charId] || { stability: 20, lastSeen: Date.now(), mistakes: 0 };

  if (isCorrect) {
    stats.stability = Math.min(100, stats.stability + (stats.mistakes === 0 ? 15 : 8));
  } else {
    stats.mistakes += 1;
    stats.stability = Math.max(0, stats.stability - 30);
  }

  stats.lastSeen = Date.now();
  data[charId] = stats;
  localStorage.setItem("kana_mastery", JSON.stringify(data));
};

export const getSmartPool = (basePool: any[], count: number) => {
  if (typeof window === "undefined") return basePool.slice(0, count);
  const mastery = JSON.parse(localStorage.getItem("kana_mastery") || "{}");
  
  const sorted = [...basePool].sort((a, b) => {
    const statA = mastery[a.romaji]?.stability ?? 0;
    const statB = mastery[b.romaji]?.stability ?? 0;
    return statA - statB;
  });

  const weakCount = Math.floor(count * 0.7);
  const weakSet = sorted.slice(0, weakCount);
  const randomSet = sorted.slice(weakCount).sort(() => 0.5 - Math.random()).slice(0, count - weakCount);

  return [...weakSet, ...randomSet].sort(() => 0.5 - Math.random());
};