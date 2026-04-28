import { fetchKana } from "@/lib/apiClient";
import Navbar from "@/components/layout/Navbar";
import KanaViewWrapper from "@/components/practice/KanaViewWrapper";
import DrillSelector from "@/components/practice/DrillSelector";

export default async function KanaPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const rawData = await fetchKana(type as "hiragana" | "katakana");

  const rows = ["", "k", "s", "t", "n", "h", "m", "y", "r", "w"];
  const vowels = ["a", "i", "u", "e", "o"];
  
  const basicIrregulars: Record<string, string> = { 
    "si": "shi", "ti": "chi", "tu": "tsu", "hu": "fu" 
  };
  const voicedIrregulars: Record<string, string> = { 
    "zi": "ji", "di": "ji", "du": "zu" 
  };

  // 1. Structure the grid data with Dakuten and Handakuten logic
  const structuredData = rows.map(r => 
    vowels.map(v => {
      // Handle Gaps (y-row and w-row)
      if (r === "y" && (v === "i" || v === "e")) return null;
      if (r === "w" && (v === "i" || v === "u" || v === "e")) return null;

      let target = r === "" ? v : r + v;
      if (basicIrregulars[target]) target = basicIrregulars[target];
      
      const baseKana = rawData.find((k: any) => k.romaji === target) || null;

      if (baseKana) {
        const voicingConsonants: any = { k: "g", s: "z", t: "d", h: "b" };
        let updatedKana = { ...baseKana };

        // Attach Dakuten (゛)
        if (voicingConsonants[r]) {
          const vConsonant = voicingConsonants[r];
          updatedKana.voiced = {
            char: baseKana.char + "\u3099",
            romaji: voicedIrregulars[vConsonant + v] || vConsonant + v
          };
        }

        // Attach Handakuten (゜) - Specifically for H-row (p-sounds)
        if (r === "h") {
          updatedKana.semiVoiced = {
            char: baseKana.char + "\u309A",
            romaji: "p" + v
          };
        }

        return updatedKana;
      }
      return baseKana;
    })
  );

  // Add the standalone 'n' character at the end
  const nCard = rawData.find((k: any) => k.romaji === "n");
  if (nCard) structuredData.push([nCard, null, null, null, null]);

  return (
    <main className="min-h-screen bg-slate-950 text-white pt-32 pb-20 px-6">
      <Navbar />
      
      {/* Page Header */}
      <header className="max-w-5xl mx-auto mb-16">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-purple-400">
            Current Script
          </span>
        </div>
        <h1 className="text-7xl font-black tracking-tighter capitalize leading-tight">
          {type} <span className="text-purple-500 italic">Dojo</span>
        </h1>
        <p className="text-slate-500 mt-4 max-w-2xl text-lg font-medium">
          Master the foundation of Japanese. Use the study reference below to memorize characters, 
          then test your skills in the training grounds.
        </p>
      </header>

      {/* Training Grounds: Drill Selection Section */}
      <DrillSelector type={type} />

      {/* Study Reference: The Interactive Grid */}
      <section className="max-w-5xl mx-auto py-4">
        <div className="flex items-center gap-4 mb-10">
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 whitespace-nowrap">
            Phonetic Chart
          </h2>
          <div className="h-px w-full bg-white/5" />
        </div>
        
        <KanaViewWrapper data={structuredData} />
      </section>

      {/* Decorative Background Elements */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] -z-10 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] -z-10 pointer-events-none" />
    </main>
  );
}