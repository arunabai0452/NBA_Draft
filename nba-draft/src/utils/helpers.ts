import { seasonLogs } from './../assets/data/index';
// src/utils/helpers.ts


interface GameLog {
  playerId: number;
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  tov: number;
  fga: number;
  fgm: number;
  ftm: number;
  fta: number;
  tpm: number;
  tpa: number;
}

type SeasonLog = {
  "3P%": number;
  "3PA": number;
  "3PM": number;
  "AST": number;
  "BLK": number;
  "DRB": number;
  "FG2%": number;
  "FG2A": number;
  "FG2M": number;
  "FG%": number;
  "FGA": number;
  "FGM": number;
  "FT": number;
  "FTA": number;
  "FTP": number;
  "GP": number;
  "GS": number;
  "League": string;
  "MP": number;
  "ORB": number;
  "PF": number;
  "PTS": number;
  "STL": number;
  "Season": number;
  "TOV": number;
  "TRB": number;
  "Team": string;
  "age": string;
  "eFG%": number;
  "l": number;
  "playerId": number;
  "w": number;
  [key: string]: string | number;
};



type ScoutRanking = Record<string, number | null> & { playerId: number };

// Calculate the average rank for a player
export function getAverageRank(ranks: ScoutRanking): number {
  const values = Object.entries(ranks)
    .filter(([key]) => key !== "playerId" && ranks[key] !== null)
    .map(([, val]) => Number(val));

  if (values.length === 0) return Infinity;
  const total = values.reduce((sum, val) => sum + val, 0);
  return total / values.length;
}

export const calculateAge = (dob: string): number => {
    const birth = new Date(dob);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const isBeforeBirthday =
        now.getMonth() < birth.getMonth() ||
        (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate());
    if (isBeforeBirthday) age--;
    return age;
};


// Detect if a scout's rank is significantly high/low vs average
export function getRankStats(
  ranks: ScoutRanking,
  scoutName: string
): { isHigh: boolean; isLow: boolean } {
  if (ranks[scoutName] == null) {
    return { isHigh: false, isLow: false };
  }

  const allRanks = Object.entries(ranks)
    .filter(([key]) => key !== "playerId" && ranks[key] !== null)
    .map(([, val]) => Number(val));

  if (allRanks.length === 0) {
    return { isHigh: false, isLow: false };
  }

  const average = getAverageRank(ranks);
  const stdev =
    allRanks.length > 1
      ? Math.sqrt(
          allRanks.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) /
            allRanks.length
        )
      : 0;

  const thisRank = Number(ranks[scoutName]);

  return {
    isHigh: thisRank <= average - stdev,
    isLow: thisRank >= average + stdev,
  };
}

interface GameLog {
  playerId: number;
  gameId: number;
  season: number;
  [key: string]: any;
}

export const getGameLogsByPlayer = (playerId: number, allLogs: GameLog[]) => {
  return allLogs
    .filter((log) => log.playerId === playerId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // newest first
};

export const getTotalSeasonStats = (logs :SeasonLog[]) => {
  const seasonStats: Record<
    number,
    Record<string, number | string[]>
  > = {};

  logs.forEach((log) => {
    const season = log.Season;

    if (!seasonStats[season]) {
      seasonStats[season] = {};
      seasonStats[season]["League"] = [];
    }

    for (const key in log) {
      const value = log[key];

      // Handle League merging into an array of unique values
      if (key === "League") {
        const leagues = seasonStats[season]["League"] as string[];
        if (typeof value === "string" && !leagues.includes(value)) {
          leagues.push(value);
        }
        continue;
      }

      // Skip some keys that are non-numeric or that you want to exclude
      if (
        key === "playerId" ||
        key === "age" ||
        key === "Team" ||
        key === "Season"
      ) {
        continue;
      }

      // Sum numeric values
      if (typeof value === "number") {
        seasonStats[season][key] = (seasonStats[season][key] as number || 0) + value;
      }
    }
  });

  // After summing, recompute shooting percentages (keys with % in name)
  for (const season in seasonStats) {
    const stats = seasonStats[+season];

    // Compute FG%
    if (
      stats["FGM"] !== undefined &&
      stats["FGA"] !== undefined &&
      (stats["FGA"] as number) > 0
    ) {
      stats["FG%"] = +(
        ((stats["FGM"] as number) / (stats["FGA"] as number)) *
        100
      ).toFixed(1);
    }

    // Compute 3P% (3-point %)
    if (
      stats["3PM"] !== undefined &&
      stats["3PA"] !== undefined &&
      (stats["3PA"] as number) > 0
    ) {
      stats["3P%"] = +(
        ((stats["3PM"] as number) / (stats["3PA"] as number)) *
        100
      ).toFixed(1);
    }

    // Compute FT% (free throw %)
    if (
      stats["FT"] !== undefined &&
      stats["FTA"] !== undefined &&
      (stats["FTA"] as number) > 0
    ) {
      stats["FTP"] = +(
        ((stats["FT"] as number) / (stats["FTA"] as number)) *
        100
      ).toFixed(1);
    }
  }

  return seasonStats;
}