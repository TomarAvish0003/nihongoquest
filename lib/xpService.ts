// frontend/lib/xpService.ts

const XP_KEY = "nihonquest_total_xp";

export const getXP = (): number => {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(XP_KEY) || "0");
};

export const addXP = (amount: number): number => {
  const current = getXP();
  const total = current + amount;
  localStorage.setItem(XP_KEY, total.toString());
  return total;
};

export const checkUnlock = (xpNeeded: number): boolean => {
  return getXP() >= xpNeeded;
};