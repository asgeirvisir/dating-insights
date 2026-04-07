import type { DataModuleRef } from "@/types/modules";
import { getModuleData } from "@/lib/data";
import type {
  GuessaryData,
  ComparisonData,
  MythData,
  ProfileInsightData,
  RankingData,
  BehavioralData,
} from "@/types/modules";

import Guessary from "./Guessary";
import ComparisonBars from "./ComparisonBars";
import MythVerdict from "./MythVerdict";
import ProfileTraitCard from "./ProfileTraitCard";
import RankingList from "./RankingList";
import BehavioralStat from "./BehavioralStat";

interface Props {
  moduleRef: DataModuleRef;
}

export async function ModuleRenderer({ moduleRef }: Props) {
  const data = await getModuleData(moduleRef.type, moduleRef.id);

  if (!data) {
    return null;
  }

  switch (moduleRef.type) {
    case "guessary":
      return <Guessary {...(data as GuessaryData)} />;
    case "comparison":
      return <ComparisonBars {...(data as ComparisonData)} />;
    case "myth":
      return <MythVerdict {...(data as MythData)} />;
    case "profileInsight":
      return <ProfileTraitCard {...(data as ProfileInsightData)} />;
    case "ranking":
      return <RankingList {...(data as RankingData)} />;
    case "behavioral":
      return <BehavioralStat {...(data as BehavioralData)} />;
    default:
      return null;
  }
}
