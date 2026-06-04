import type { Match, Team, CompetitionStage, Region } from '../types';
import { getTeamPopularity } from '../data/teamPopularity';
import { rankingService } from './rankingService';
import localTeamsData from '../data/worldCup2026/worldcup.teams.json';
import localStadiumsData from '../data/worldCup2026/worldcup.stadiums.json';

/**
 * Checks if a team name represents a future tournament placeholder (e.g., 2A, W74, 3A/B/C/D/F).
 */
export function isPlaceholderTeam(name: string): boolean {
  const norm = name.trim().toUpperCase();
  return (
    /^[12][A-L]$/.test(norm) ||
    /^3[A-L/]+$/.test(norm) ||
    /^[WL]\d+$/.test(norm)
  );
}

/**
 * Formats future knockout placeholders into clean, user-friendly labels.
 * E.g., "W74" -> "Winner of Match 74", "1J" -> "Winner Group J", "3D/E/I/J/L" -> "3rd Place Group D/E/I/J/L".
 */
export function resolvePlaceholderName(name: string): string {
  const norm = name.trim().toUpperCase();
  
  // W74 style
  if (/^W\d+$/.test(norm)) {
    return `Ganador del Partido ${norm.substring(1)}`;
  }
  // L101 style
  if (/^L\d+$/.test(norm)) {
    return `Perdedor del Partido ${norm.substring(1)}`;
  }
  // 1J style
  if (/^1[A-L]$/.test(norm)) {
    return `Ganador del Grupo ${norm.charAt(1)}`;
  }
  // 2A style
  if (/^2[A-L]$/.test(norm)) {
    return `Segundo del Grupo ${norm.charAt(1)}`;
  }
  // 3A/B/C/D/F style
  if (/^3[A-L/]+$/.test(norm)) {
    return `Tercero del Grupo ${norm.substring(1)}`;
  }
  
  return name;
}

/**
 * Converts a raw string team name from OpenFootball into a full Team object.
 */
export function mapTeam(name: string, rankingsMap: { [key: string]: number }): Team {
  const isPlaceholder = isPlaceholderTeam(name);
  const resolvedName = resolvePlaceholderName(name);

  if (isPlaceholder) {
    return {
      name: resolvedName,
      code: 'TBD',
      region: 'Europe', // Default fallback region
      ranking: 100,      // Standard baseline rank
      popularity: 30,   // Baseline popularity
      flag: '🏳️'
    };
  }

  // Lookup in worldcup.teams.json
  const teamMeta = localTeamsData.find(
    t => t.name.toLowerCase() === name.toLowerCase()
  );

  const ranking = rankingsMap[name] || rankingService.getDefaultRank();
  
  // Map continent to internal Region type
  let region: Region = 'Europe'; // Default fallback
  if (teamMeta) {
    const cont = teamMeta.continent;
    if (
      cont === 'North America' ||
      cont === 'South America' ||
      cont === 'Europe' ||
      cont === 'Africa' ||
      cont === 'Asia' ||
      cont === 'Oceania'
    ) {
      region = cont;
    }
  }

  return {
    name,
    code: teamMeta?.fifa_code || 'UNK',
    region,
    ranking,
    popularity: getTeamPopularity(name),
    flag: teamMeta?.flag_icon || '🏳️'
  };
}

/**
 * Parse round string into CompetitionStage.
 */
export function parseStage(roundName: string): CompetitionStage {
  const norm = roundName.toLowerCase();
  if (norm.includes('matchday')) {
    return 'Group Stage';
  }
  if (norm.includes('round of 32')) {
    return 'Round of 32';
  }
  if (norm.includes('round of 16')) {
    return 'Round of 16';
  }
  if (norm.includes('quarter-final') || norm.includes('quarter final') || norm.includes('quarterfinals')) {
    return 'Quarter Finals';
  }
  if (norm.includes('semi-final') || norm.includes('semi final') || norm.includes('semifinals')) {
    return 'Semi Finals';
  }
  if (norm.includes('third place') || norm.includes('3rd place') || norm.includes('match for third place')) {
    return 'Third Place Match';
  }
  if (norm.includes('final')) {
    return 'Final';
  }
  return 'Group Stage'; // Fallback
}

/**
 * Converts raw OpenFootball match objects into normalized Match models.
 */
export function mapRawMatch(
  rawMatch: any,
  rankingsMap: { [key: string]: number }
): Match {
  const homeTeamName = rawMatch.team1 || 'TBD';
  const awayTeamName = rawMatch.team2 || 'TBD';

  const homeTeam = mapTeam(homeTeamName, rankingsMap);
  const awayTeam = mapTeam(awayTeamName, rankingsMap);

  const isPlaceholder = isPlaceholderTeam(homeTeamName) || isPlaceholderTeam(awayTeamName);

  // Look up stadium information
  const stadium = localStadiumsData.stadiums.find(
    s => s.city.toLowerCase() === rawMatch.ground?.toLowerCase()
  );

  const venue = stadium ? stadium.name : (rawMatch.ground || 'Stadium');
  const city = stadium ? stadium.city : (rawMatch.ground || 'Host City');
  let country = 'Host Country';
  if (stadium) {
    if (stadium.cc === 'us') country = 'USA';
    else if (stadium.cc === 'mx') country = 'Mexico';
    else if (stadium.cc === 'ca') country = 'Canada';
  }

  // Deterministic Match ID mapping
  let matchId = '';
  if (rawMatch.num) {
    matchId = `oc-${rawMatch.num}`;
  } else if (rawMatch.round === 'Match for third place') {
    matchId = 'oc-103';
  } else if (rawMatch.round === 'Final') {
    matchId = 'oc-104';
  } else {
    matchId = `oc-${homeTeamName}-${awayTeamName}-${rawMatch.date}`.replace(/\s+/g, '-').toLowerCase();
  }

  const stage = parseStage(rawMatch.round || 'Group Stage');
  const group = rawMatch.group || null;

  // Determine score details if present
  let hasScore = false;
  let homeScore = 0;
  let awayScore = 0;

  if (rawMatch.score1 !== undefined && rawMatch.score1 !== null && rawMatch.score2 !== undefined && rawMatch.score2 !== null) {
    hasScore = true;
    homeScore = Number(rawMatch.score1);
    awayScore = Number(rawMatch.score2);
  } else if (rawMatch.score && Array.isArray(rawMatch.score.ft)) {
    hasScore = true;
    homeScore = Number(rawMatch.score.ft[0]);
    awayScore = Number(rawMatch.score.ft[1]);
  }

  const match: Match = {
    id: matchId,
    homeTeam,
    awayTeam,
    date: rawMatch.date || '',
    time: rawMatch.time || '00:00',
    stage,
    group,
    venue,
    city,
    country,
    status: hasScore ? 'Finished' : 'Scheduled',
    isPlaceholder
  };

  if (hasScore) {
    match.result = {
      homeScore,
      awayScore
    };
  }

  return match;
}
