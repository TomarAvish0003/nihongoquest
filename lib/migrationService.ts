import { syncDrillToDB } from "./apiClient";

export const migrateGuestData = async () => {
  const localMastery = JSON.parse(localStorage.getItem("kana_mastery") || "{}");
  const localXP = parseInt(localStorage.getItem("user_xp") || "0");

  if (Object.keys(localMastery).length === 0 && localXP === 0) return;

  console.log("Migrating guest data to cloud...");

  // Sync each character from local storage to the DB
  const entries = Object.entries(localMastery);
  for (const [charId, stats] of entries) {
    // We sync the character progress. 
    // If it's a high-stability character, we mark it as correct in the DB.
    await syncDrillToDB(charId, (stats as any).stability > 50, 0);
  }

  // Clear local storage to complete migration
  localStorage.removeItem("kana_mastery");
  localStorage.removeItem("user_xp");
};