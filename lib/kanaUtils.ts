// frontend/lib/kanaUtils.ts

const DAKUTEN = "゙";
const HANDAKUTEN = "゚";

const voicedMap: Record<string, { base: string; voiced: string; type: 'dakuten' | 'handakuten' }> = {
  g: { base: "k", voiced: DAKUTEN, type: 'dakuten' },
  z: { base: "s", voiced: DAKUTEN, type: 'dakuten' },
  d: { base: "t", voiced: DAKUTEN, type: 'dakuten' },
  b: { base: "h", voiced: DAKUTEN, type: 'dakuten' },
  p: { base: "h", voiced: HANDAKUTEN, type: 'handakuten' },
};

const irregulars: Record<string, string> = {
  "zi": "ji", "di": "ji", "du": "zu", "si": "shi", "ti": "chi", "tu": "tsu", "hu": "fu"
};

export function generateVoicedGrid(rawData: any[], rows: string[], vowels: string[]) {
  return rows.map(r => 
    vowels.map(v => {
      const mapping = voicedMap[r];
      if (!mapping) return null;

      // Find the base character (e.g., to get 'ga', we look for 'ka')
      let baseRomaji = mapping.base + v;
      if (irregulars[baseRomaji]) baseRomaji = irregulars[baseRomaji];

      const baseKana = rawData.find(k => k.romaji === baseRomaji);
      
      if (!baseKana) return null;

      // Programmatically create the voiced version
      return {
        ...baseKana,
        char: baseKana.char + mapping.voiced,
        romaji: r + v === "zi" ? "ji" : r + v === "di" ? "ji" : r + v === "du" ? "zu" : r + v
      };
    })
  );
}

// frontend/lib/kanaUtils.ts

export const voicingMap: Record<string, { voiced: string; romaji: string }> = {
  // K -> G
  "ka": { voiced: "が", romaji: "ga" }, "ki": { voiced: "ぎ", romaji: "gi" }, 
  "ku": { voiced: "ぐ", romaji: "gu" }, "ke": { voiced: "げ", romaji: "ge" }, "ko": { voiced: "ご", romaji: "go" },
  // S -> Z
  "sa": { voiced: "ざ", romaji: "za" }, "shi": { voiced: "じ", romaji: "ji" }, 
  "su": { voiced: "ず", romaji: "zu" }, "se": { voiced: "ぜ", romaji: "ze" }, "so": { voiced: "ぞ", romaji: "zo" },
  // T -> D
  "ta": { voiced: "だ", romaji: "da" }, "chi": { voiced: "ぢ", romaji: "ji" }, 
  "tsu": { voiced: "づ", romaji: "zu" }, "te": { voiced: "で", romaji: "de" }, "to": { voiced: "ど", romaji: "do" },
  // H -> B (Dakuten) / P (Handakuten) - We'll default to Dakuten for the first flip
  "ha": { voiced: "ば", romaji: "ba" }, "hi": { voiced: "び", romaji: "bi" }, 
  "fu": { voiced: "ぶ", romaji: "bu" }, "he": { voiced: "べ", romaji: "be" }, "ho": { voiced: "ぼ", romaji: "bo" },
};

// Handakuten mapping for a second toggle state or specific logic
export const handakutenMap: Record<string, { voiced: string; romaji: string }> = {
  "ha": { voiced: "ぱ", romaji: "pa" }, "hi": { voiced: "ぴ", romaji: "pi" }, 
  "fu": { voiced: "ぷ", romaji: "pu" }, "he": { voiced: "ぺ", romaji: "pe" }, "ho": { voiced: "ぽ", romaji: "po" },
};