import type { UserProfile } from '../types';

const STORAGE_KEYS = {
  USER_PROFILE: 'wc2026_user_profile',
  SAVED_MATCHES: 'wc2026_saved_matches',
  WATCHED_MATCHES: 'wc2026_watched_matches'
};

const DEFAULT_PROFILE: UserProfile = {
  favoriteTeams: [],
  favoriteRegions: [],
  setupComplete: false
};

export const storageService = {
  // User Profile
  getUserProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : DEFAULT_PROFILE;
    } catch (e) {
      console.error('Error parsing user profile from LocalStorage', e);
      return DEFAULT_PROFILE;
    }
  },

  saveUserProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Error saving user profile to LocalStorage', e);
    }
  },

  resetUserProfile(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(DEFAULT_PROFILE));
      localStorage.removeItem(STORAGE_KEYS.SAVED_MATCHES);
      localStorage.removeItem(STORAGE_KEYS.WATCHED_MATCHES);
    } catch (e) {
      console.error('Error resetting user profile in LocalStorage', e);
    }
  },

  // Saved Matches
  getSavedMatchIds(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_MATCHES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading saved matches', e);
      return [];
    }
  },

  toggleSaveMatch(matchId: string): string[] {
    try {
      const saved = this.getSavedMatchIds();
      const index = saved.indexOf(matchId);
      if (index > -1) {
        saved.splice(index, 1);
      } else {
        saved.push(matchId);
      }
      localStorage.setItem(STORAGE_KEYS.SAVED_MATCHES, JSON.stringify(saved));
      return saved;
    } catch (e) {
      console.error('Error toggling save match', e);
      return [];
    }
  },

  // Watched Matches
  getWatchedMatchIds(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WATCHED_MATCHES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading watched matches', e);
      return [];
    }
  },

  toggleWatchedMatch(matchId: string): string[] {
    try {
      const watched = this.getWatchedMatchIds();
      const index = watched.indexOf(matchId);
      if (index > -1) {
        watched.splice(index, 1);
      } else {
        watched.push(matchId);
      }
      localStorage.setItem(STORAGE_KEYS.WATCHED_MATCHES, JSON.stringify(watched));
      return watched;
    } catch (e) {
      console.error('Error toggling watched match', e);
      return [];
    }
  }
};
export default storageService;
