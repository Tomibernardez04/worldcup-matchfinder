import { useMemo } from 'react';
import type { Match, UserProfile } from '../types';
import recommendationEngine from '../services/recommendationEngine';

export function useRecommendations(matches: Match[], profile: UserProfile): Match[] {
  return useMemo(() => {
    if (!matches || matches.length === 0) return [];
    
    // Calculate recommendation scores and sort matches descending by score
    return recommendationEngine.recommendMatches(matches, profile);
  }, [matches, profile]);
}

export default useRecommendations;
