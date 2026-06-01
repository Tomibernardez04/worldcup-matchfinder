import { useState, useEffect, useCallback } from 'react';
import type { Match } from '../types';
import fixtureService from '../services/fixtureService';
import storageService from '../services/storageService';

export function useMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Track saved and watched match IDs
  const [savedMatchIds, setSavedMatchIds] = useState<string[]>(() => 
    storageService.getSavedMatchIds()
  );
  const [watchedMatchIds, setWatchedMatchIds] = useState<string[]>(() => 
    storageService.getWatchedMatchIds()
  );

  const fetchMatches = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fixtureService.getAllMatches();
      setMatches(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch match fixtures. Please check your network or try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  // Actions
  const toggleSave = useCallback((matchId: string) => {
    const updated = storageService.toggleSaveMatch(matchId);
    setSavedMatchIds(updated);
  }, []);

  const toggleWatched = useCallback((matchId: string) => {
    const updated = storageService.toggleWatchedMatch(matchId);
    setWatchedMatchIds(updated);
  }, []);

  const isSaved = useCallback((matchId: string) => {
    return savedMatchIds.includes(matchId);
  }, [savedMatchIds]);

  const isWatched = useCallback((matchId: string) => {
    return watchedMatchIds.includes(matchId);
  }, [watchedMatchIds]);

  return {
    matches,
    isLoading,
    error,
    savedMatchIds,
    watchedMatchIds,
    toggleSave,
    toggleWatched,
    isSaved,
    isWatched,
    refresh: fetchMatches
  };
}

export default useMatches;
