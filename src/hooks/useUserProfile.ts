import { useState, useCallback } from 'react';
import type { UserProfile, Region } from '../types';
import storageService from '../services/storageService';

export function useUserProfile() {
  const [profile, setProfileState] = useState<UserProfile>(() => storageService.getUserProfile());

  const saveProfile = useCallback((updatedProfile: UserProfile) => {
    storageService.saveUserProfile(updatedProfile);
    setProfileState(updatedProfile);
  }, []);

  const updateFavorites = useCallback((favoriteTeams: string[], favoriteRegions: Region[]) => {
    setProfileState((prev) => {
      const updated = {
        ...prev,
        favoriteTeams,
        favoriteRegions,
        setupComplete: true
      };
      storageService.saveUserProfile(updated);
      return updated;
    });
  }, []);

  const resetProfile = useCallback(() => {
    storageService.resetUserProfile();
    // Retrieve default clean profile from storage service
    const defaultProfile = storageService.getUserProfile();
    setProfileState(defaultProfile);
    // Redirect to onboarding page route
    window.location.hash = '/onboarding';
  }, []);

  return {
    profile,
    saveProfile,
    updateFavorites,
    resetProfile
  };
}

export default useUserProfile;
