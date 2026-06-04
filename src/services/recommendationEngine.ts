import type { Match, MatchScoreBreakdown, UserProfile } from '../types';
import { getTeamPopularity } from '../data/teamPopularity';
import { getRivalry } from '../data/rivalries';
import localRankings from '../data/rankings.json';
import { translateTeamName, translateStage, translateRegion } from '../utils/translations';
import { parseMatchDateTime, getArgentineTimeParts } from '../utils/dateUtils';

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
  const homeFlag = match.homeTeam.flag;
  const awayFlag = match.awayTeam.flag;
  
  if (homeFav && awayFav) {
    explanations.push(`⭐ ¡Partidazo! Seguís tanto a ${homeFlag} ${homeTranslated} como a ${awayFlag} ${awayTranslated}.`);
  } else if (homeFav) {
    explanations.push(`⭐ Seguís a ${homeFlag} ${homeTranslated}.`);
  } else if (awayFav) {
    explanations.push(`⭐ Seguís a ${awayFlag} ${awayTranslated}.`);
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
    availabilityBadge?: 'Ideal' | 'Aceptable' | 'Complicado';
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

    // 5. User Time Availability Adjustment
    let availabilityScore: number | undefined = undefined;
    let availabilityBadge: Match['availabilityBadge'] = undefined;
    let adjustedScore = finalScore;

    const explanations = generateExplanations(match, {
      stageScore,
      popularityScore,
      rankingScore,
      rivalryScore,
      userPreferenceScore: personalScore,
      total: finalScore
    }, profile);

    if (profile.preferredStartTime && profile.preferredEndTime) {
      let matchHour = 12;
      let matchMinute = 0;
      try {
        const dateObj = parseMatchDateTime(match.date, match.time);
        const parts = getArgentineTimeParts(dateObj);
        matchHour = parts.hour;
        matchMinute = parts.minute;
      } catch {
        const timeClean = match.time.split(' ')[0];
        const [h, m] = timeClean.split(':').map(Number);
        if (!isNaN(h)) matchHour = h;
        if (!isNaN(m)) matchMinute = m;
      }

      const [startHour, startMin] = profile.preferredStartTime.split(':').map(Number);
      const [endHour, endMin] = profile.preferredEndTime.split(':').map(Number);
      const timeStart = startHour + startMin / 60;
      const timeEnd = endHour + endMin / 60;
      const timeMatch = matchHour + matchMinute / 60;

      // Check madrugada extrema: Entre 01:00 y 05:00
      const isMadrugada = timeMatch >= 1.0 && timeMatch <= 5.0;

      if (isMadrugada) {
        availabilityScore = 0;
        availabilityBadge = 'Complicado';
        explanations.push('🌙 Partido de madrugada. Quizás prefieras ver el resumen.');
      } else {
        // Check within range
        let inRange = false;
        if (timeStart <= timeEnd) {
          inRange = timeMatch >= timeStart && timeMatch <= timeEnd;
        } else {
          inRange = timeMatch >= timeStart || timeMatch <= timeEnd;
        }

        if (inRange) {
          availabilityScore = 100;
          availabilityBadge = 'Ideal';
          explanations.push('🕒 Se juega dentro de tu horario habitual para ver fútbol.');
        } else {
          // Check within 2 hours
          const timeStartExpanded = (timeStart - 2 + 24) % 24;
          const timeEndExpanded = (timeEnd + 2) % 24;
          
          let inExpandedRange = false;
          if (timeStartExpanded <= timeEndExpanded) {
            inExpandedRange = timeMatch >= timeStartExpanded && timeMatch <= timeEndExpanded;
          } else {
            inExpandedRange = timeMatch >= timeStartExpanded || timeMatch <= timeEndExpanded;
          }

          if (inExpandedRange) {
            availabilityScore = 70;
            availabilityBadge = 'Aceptable';
            explanations.push('🕒 Se juega cerca de tu horario habitual.');
          } else {
            availabilityScore = 30;
            availabilityBadge = 'Complicado';
            explanations.push('⚠️ Se juega fuera de tu horario habitual.');
          }
        }
      }

      adjustedScore = Math.max(0, Math.min(100, Math.round(finalScore * 0.90 + availabilityScore * 0.10)));
    }

    return {
      score: adjustedScore,
      category,
      breakdown: {
        stageScore,
        popularityScore,
        rankingScore,
        rivalryScore,
        userPreferenceScore: personalScore,
        availabilityScore,
        total: adjustedScore
      },
      explanations,
      availabilityBadge
    };
  },

  recommendMatches(matches: Match[], profile: UserProfile): Match[] {
    return matches.map(match => {
      const { score, category, breakdown, explanations, availabilityBadge } = this.scoreMatch(match, profile);
      return {
        ...match,
        imperdibilityScore: score,
        category,
        scoreBreakdown: breakdown,
        recommendationExplanation: explanations,
        availabilityBadge
      };
    });
  }
};

export default recommendationEngine;
