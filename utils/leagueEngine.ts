import { TeamStats, MatchData } from '../types';

export const getMatchKey = (home: string, away: string) => `${home}||${away}`;

export const calculateStandings = (teams: string[], matches: MatchData): TeamStats[] => {
  const statsMap: Record<string, TeamStats> = {};

  teams.forEach(name => {
    statsMap[name] = {
      name,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      points: 0
    };
  });

  // Process each unique pair once
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      const home = teams[i];
      const away = teams[j];
      const key = getMatchKey(home, away);
      const score = matches[key];

      if (score && score.home !== null && score.away !== null) {
        const h = score.home;
        const a = score.away;

        // Home stats
        statsMap[home].played++;
        statsMap[home].gf += h;
        statsMap[home].ga += a;
        statsMap[home].gd += (h - a);

        // Away stats
        statsMap[away].played++;
        statsMap[away].gf += a;
        statsMap[away].ga += h;
        statsMap[away].gd += (a - h);

        if (h > a) {
          statsMap[home].won++;
          statsMap[home].points += 3;
          statsMap[away].lost++;
        } else if (h < a) {
          statsMap[away].won++;
          statsMap[away].points += 3;
          statsMap[home].lost++;
        } else {
          statsMap[home].drawn++;
          statsMap[home].points += 1;
          statsMap[away].drawn++;
          statsMap[away].points += 1;
        }
      }
    }
  }

  const standings = Object.values(statsMap);

  // Sorting Rules: Points > GD > GF > Head-to-Head
  standings.sort((a, b) => {
    // 1. Points
    if (b.points !== a.points) return b.points - a.points;
    // 2. Goal Difference
    if (b.gd !== a.gd) return b.gd - a.gd;
    // 3. Goals For
    if (b.gf !== a.gf) return b.gf - a.gf;

    // 4. Head-to-Head (Simple 2-team logic as per original spec)
    const h2hKey = getMatchKey(a.name, b.name);
    const h2hReverseKey = getMatchKey(b.name, a.name);
    const score = matches[h2hKey] || matches[h2hReverseKey];

    if (score && score.home !== null && score.away !== null) {
      const isReverse = !!matches[h2hReverseKey];
      const teamAScore = isReverse ? score.away : score.home;
      const teamBScore = isReverse ? score.home : score.away;

      if (teamBScore !== teamAScore) return (teamBScore ?? 0) - (teamAScore ?? 0);
    }

    return 0;
  });

  // Assign ranks
  let currentRank = 1;
  standings.forEach((s, i) => {
    if (i > 0) {
      const prev = standings[i - 1];
      // Basic check for tie-breaking rank
      const isSame = s.points === prev.points && s.gd === prev.gd && s.gf === prev.gf;
      if (!isSame) {
        currentRank = i + 1;
      }
    }
    s.rank = currentRank;
  });

  return standings;
};