export interface LeetifyRank {
  type: string;
  name: string;
  rating?: number;
  skillLevel?: number;
}

export interface LeetifyStats {
  aim: number;
  positioning: number;
  utility: number;
  leetifyRating: number;
  clutchSuccess?: number;
  openingDuelSuccess?: number;
}

export interface LeetifyProfile {
  steamId: string;
  name: string;
  ranks: LeetifyRank[];
  recentStats: LeetifyStats;
  gamesPlayed: number;
  winRate: number;
}

export interface LeetifyProfileResponse {
  meta: {
    name: string;
    steam64Id: string;
    pictureUrl?: string;
  };
  games: {
    skillLevel?: number;
    leetifyRating?: number;
    aimRating?: number;
    positioningRating?: number;
    utilityRating?: number;
    ctRating?: number;
    tRating?: number;
  }[];
  ranks?: {
    type: string;
    name: string;
    skillLevel?: number;
  }[];
}
