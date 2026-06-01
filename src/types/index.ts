export type Region = 
  | 'South America' 
  | 'Europe' 
  | 'North America' 
  | 'Africa' 
  | 'Asia' 
  | 'Oceania';

export type CompetitionStage =
  | 'Group Stage'
  | 'Round of 32'
  | 'Round of 16'
  | 'Quarter Finals'
  | 'Semi Finals'
  | 'Third Place Match'
  | 'Final';

export interface Team {
  name: string;
  code: string; // ISO 3-letter country code (e.g. ARG, BRA)
  region: Region;
  ranking: number; // FIFA ranking
  popularity: number; // 0-100 score
  flag: string; // URL or Emoji representation
}

export interface MatchScoreBreakdown {
  stageScore: number;
  popularityScore: number;
  rankingScore: number;
  rivalryScore: number;
  userPreferenceScore: number;
  total: number;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  stage: CompetitionStage;
  group: string | null; // e.g. "Group A"
  venue: string;
  city: string;
  country: string;
  status: 'Scheduled' | 'Live' | 'Finished';
  result?: {
    homeScore: number;
    awayScore: number;
  };
  isPlaceholder: boolean;
  category?: 'Must Watch' | 'Worth Watching' | 'Watch Highlights';
  // Dynamically computed by engine
  imperdibilityScore?: number;
  scoreBreakdown?: MatchScoreBreakdown;
  recommendationExplanation?: string[];
}

export interface UserProfile {
  favoriteTeams: string[];
  favoriteRegions: Region[];
  setupComplete: boolean;
}

export interface RankingData {
  [teamName: string]: number; // Rank number
}

export interface Rivalry {
  teams: [string, string]; // Alphabetical team names to match easily
  description: string;
  bonus: number;
}
