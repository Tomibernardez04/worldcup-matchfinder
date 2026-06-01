import type { Match, MatchScoreBreakdown, UserProfile } from '../types';
import { getTeamPopularity } from '../data/teamPopularity';
import { getRivalry } from '../data/rivalries';
import localRankings from '../data/rankings.json';
import { translateTeamName, translateStage, translateRegion } from '../utils/translations';

/**
 * Calculates raw Stage Score (0-100)
 */
export function calculateStageScore(stage: Match['stage']): number {
  switch (stage) {
    case 'Group Stage': return 10;
    case 'Round of 32': return 20;
    case 'Round of 16': return 35;
    case 'Quarter Finals': return 55;
    case 'Semi Finals': return 75;
    case 'Third Place Match': return 65;
    case 'Final': return 100;
    default: return 10;
  }
}

/**
 * Calculates raw Popularity Score (0-100)
 */
export function calculatePopularityScore(homeName: string, awayName: string): number {
  const popHome = getTeamPopularity(homeName);
  const popAway = getTeamPopularity(awayName);
  return (popHome + popAway) / 2;
}

/**
 * Calculates raw Ranking Score (0-100)
 */
export function calculateRankingScore(homeName: string, awayName: string): number {
  const rankings = localRankings as { [key: string]: number };
  const rankHome = rankings[homeName] || 60;
  const rankAway = rankings[awayName] || 60;
  const avgRank = (rankHome + rankAway) / 2;
  
  const score = 100 - (avgRank - 1) * 1.6;
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Calculates raw Rivalry Score (0-100)
 */
export function calculateRivalryScore(homeName: string, awayName: string): number {
  const rivalry = getRivalry(homeName, awayName);
  if (!rivalry) return 0;
  return Math.min(100, Math.round((rivalry.bonus / 30) * 100));
}

/**
 * Generates reasons explaining why a match is recommended
 */
export function generateExplanations(
  match: Match,
  _breakdown: MatchScoreBreakdown,
  profile: UserProfile
): string[] {
  const explanations: string[] = [];
  
  // Rivalry
  const rivalry = getRivalry(match.homeTeam.name, match.awayTeam.name);
  if (rivalry) {
    explanations.push(`🔥 Rivalidad histórica: ${rivalry.description}`);
  }
  
  // User preferences
  const homeFav = profile.favoriteTeams.includes(match.homeTeam.name);
  const awayFav = profile.favoriteTeams.includes(match.awayTeam.name);
  const homeTranslated = translateTeamName(match.homeTeam.name);
  const awayTranslated = translateTeamName(match.awayTeam.name);
  
  if (homeFav && awayFav) {
    explanations.push(`⭐ ¡Partidazo! Seguís tanto a ${homeTranslated} como a ${awayTranslated}.`);
  } else if (homeFav) {
    explanations.push(`⭐ Seguís a ${homeTranslated}.`);
  } else if (awayFav) {
    explanations.push(`⭐ Seguís a ${awayTranslated}.`);
  }
  
  const homeRegionFav = profile.favoriteRegions.includes(match.homeTeam.region);
  const awayRegionFav = profile.favoriteRegions.includes(match.awayTeam.region);
  if (homeRegionFav || awayRegionFav) {
    const favRegion = homeRegionFav ? match.homeTeam.region : match.awayTeam.region;
    explanations.push(`📍 Tiene un equipo de tu región de interés (${translateRegion(favRegion)}).`);
  }
  
  // Stage importance
  if (match.stage !== 'Group Stage') {
    explanations.push(`🏆 Mucho en juego: fase eliminatoria (${translateStage(match.stage)}).`);
  }
  
  // Ranking quality
  const avgRank = (match.homeTeam.ranking + match.awayTeam.ranking) / 2;
  if (avgRank <= 12) {
    explanations.push(`📈 Fútbol de elite: ambas selecciones están en el Top 12 de la FIFA.`);
  } else if (match.homeTeam.ranking <= 5 || match.awayTeam.ranking <= 5) {
    explanations.push(`📈 Cruce de gigantes: incluye a una potencia del Top 5 de la FIFA.`);
  }
  
  // Popularity
  const avgPop = (match.homeTeam.popularity + match.awayTeam.popularity) / 2;
  if (avgPop >= 85) {
    explanations.push(`🌍 Gran popularidad: atracción mundial con enorme interés de los hinchas.`);
  }

  if (explanations.length === 0) {
    explanations.push('⚽ Partido competitivo de la Copa Mundial de la FIFA.');
  }
  
  return explanations;
}

export const recommendationEngine = {
  scoreMatch(match: Match, profile: UserProfile): {
    score: number;
    category: 'Must Watch' | 'Worth Watching' | 'Watch Highlights';
    breakdown: MatchScoreBreakdown;
    explanations: string[];
  } {
    const stageScore = calculateStageScore(match.stage);
    const popularityScore = calculatePopularityScore(match.homeTeam.name, match.awayTeam.name);
    const rankingScore = calculateRankingScore(match.homeTeam.name, match.awayTeam.name);
    const rivalryScore = calculateRivalryScore(match.homeTeam.name, match.awayTeam.name);
    
    // 1. Objective Score (55% Stage, 25% Popularity, 15% Ranking, 5% Rivalry)
    const objectiveScore =
      stageScore * 0.55 +
      popularityScore * 0.25 +
      rankingScore * 0.15 +
      rivalryScore * 0.05;

    // 2. Personal Score (70% Favorite Team, 30% Favorite Region)
    const homeFav = profile.favoriteTeams.includes(match.homeTeam.name);
    const awayFav = profile.favoriteTeams.includes(match.awayTeam.name);
    const favoriteTeamScore = (homeFav || awayFav) ? 100 : 0;

    const homeRegionFav = profile.favoriteRegions.includes(match.homeTeam.region);
    const awayRegionFav = profile.favoriteRegions.includes(match.awayTeam.region);
    const favoriteRegionScore = (homeRegionFav || awayRegionFav) ? 100 : 0;

    const personalScore =
      favoriteTeamScore * 0.7 +
      favoriteRegionScore * 0.3;

    // 3. Final Score (60% Objective Score, 40% Personal Score)
    const finalScore = Math.max(0, Math.min(100, Math.round(objectiveScore * 0.6 + personalScore * 0.4)));

    // 4. Categorization
    let category: 'Must Watch' | 'Worth Watching' | 'Watch Highlights' = 'Watch Highlights';
    
    const isMustWatch = (homeFav || awayFav) || (match.stage === 'Final') || (match.stage === 'Semi Finals');
    
    if (isMustWatch) {
      category = 'Must Watch';
    } else {
      const isWorthWatching =
        (match.stage === 'Quarter Finals') ||
        (match.stage === 'Round of 16') ||
        (homeRegionFav || awayRegionFav) ||
        (objectiveScore >= 60);
      
      if (isWorthWatching) {
        category = 'Worth Watching';
      }
    }

    const breakdown: MatchScoreBreakdown = {
      stageScore,
      popularityScore,
      rankingScore,
      rivalryScore,
      userPreferenceScore: personalScore,
      total: finalScore
    };

    const explanations = generateExplanations(match, breakdown, profile);

    return {
      score: finalScore,
      category,
      breakdown,
      explanations
    };
  },

  recommendMatches(matches: Match[], profile: UserProfile): Match[] {
    return matches.map(match => {
      const { score, category, breakdown, explanations } = this.scoreMatch(match, profile);
      return {
        ...match,
        imperdibilityScore: score,
        category,
        scoreBreakdown: breakdown,
        recommendationExplanation: explanations
      };
    });
  }
};

export default recommendationEngine;
