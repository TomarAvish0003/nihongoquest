import { fetchKana, getVoicedVariants } from "@/lib/apiClient";
import IdentityManager from "@/components/drills/Level1-Identity/IdentityManager";
import RecallManager from "@/components/drills/Level2-Recall/RecallManager";
import GridMatchManager from "@/components/drills/Level3-GridMatch/GridMatchManager";
import BlitzManager from "@/components/drills/Level4-Blitz/BlitzManager";

export default async function DrillPage({ params, searchParams }: any) {
  const { type } = await params;
  const { level, voiced } = await searchParams;

  const baseData = await fetchKana(type);
  const voicedVariants = getVoicedVariants(baseData);

  // Level 4 ALWAYS includes voiced characters.
  const useVoiced = level === "4" || voiced === "true";
  const fullPool = useVoiced ? [...baseData, ...voicedVariants] : baseData;
  const pool = fullPool.sort(() => 0.5 - Math.random());

  return (
    <div className="min-h-screen bg-slate-950">
      {level === "4" ? (
        <BlitzManager kanaPool={pool} type={type} />
      ) : level === "3" ? (
        <GridMatchManager kanaPool={pool} type={type} />
      ) : level === "2" ? (
        <RecallManager kanaPool={pool} type={type} />
      ) : (
        <IdentityManager kanaPool={pool} type={type} />
      )}
    </div>
  );
}