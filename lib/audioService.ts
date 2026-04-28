"use client";

export const playKanaSound = (char: string) => {
  if (typeof window === "undefined") return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(char);
  utterance.lang = "ja-JP";
  utterance.rate = 0.85; // Slightly slower for learner clarity

  const jaVoice = window.speechSynthesis.getVoices().find(v => v.lang === "ja-JP" && v.name.includes("Google"));
  if (jaVoice) utterance.voice = jaVoice;
  
  window.speechSynthesis.speak(utterance);
};

export const playSFX = (type: "correct" | "incorrect" | "complete") => {
  if (typeof window === "undefined") return;
  const sounds = {
    correct: "https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3",
    incorrect: "https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3",
    complete: "https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3"
  };
  const audio = new Audio(sounds[type]);
  audio.volume = 0.15;
  audio.play().catch(() => {}); 
};