export interface Score {
  home: number | null;
  away: number | null;
}

export type MatchData = Record<string, Score>;

export interface TeamStats {
  name: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
  rank?: number;
}

export interface LeagueState {
  teams: string[];
  matches: MatchData;
}