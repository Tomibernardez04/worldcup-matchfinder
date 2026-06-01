import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import useUserProfile from './hooks/useUserProfile';
import useMatches from './hooks/useMatches';
import useRecommendations from './hooks/useRecommendations';
import Layout from './components/Layout';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import MatchExplorer from './pages/MatchExplorer';
import SavedMatches from './pages/SavedMatches';
import WatchedMatches from './pages/WatchedMatches';
import Settings from './pages/Settings';

export function App() {
  const { profile, updateFavorites, resetProfile } = useUserProfile();
  
  // Custom hook to query fixtures from the Fixture Service (env key configured)
  const {
    matches,
    isLoading,
    error,
    savedMatchIds,
    watchedMatchIds,
    toggleSave,
    toggleWatched,
    isSaved,
    isWatched,
    refresh
  } = useMatches();

  // Compute recommendation ratings and sorting
  const recommendedMatches = useRecommendations(matches, profile);

  // Enforce Onboarding flow if profile setup is not complete
  if (!profile.setupComplete) {
    return (
      <HashRouter>
        <Routes>
          <Route 
            path="*" 
            element={
              <Onboarding 
                onComplete={(p) => {
                  updateFavorites(p.favoriteTeams, p.favoriteRegions);
                }} 
              />
            } 
          />
        </Routes>
      </HashRouter>
    );
  }

  return (
    <HashRouter>
      <Layout
        profile={profile}
        resetProfile={resetProfile}
        savedCount={savedMatchIds.length}
        watchedCount={watchedMatchIds.length}
      >
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                matches={recommendedMatches}
                isLoading={isLoading}
                error={error}
                profile={profile}
                isSaved={isSaved}
                isWatched={isWatched}
                onToggleSave={toggleSave}
                onToggleWatched={toggleWatched}
                onRetry={refresh}
              />
            }
          />
          <Route
            path="/explorer"
            element={
              <MatchExplorer
                matches={recommendedMatches}
                isLoading={isLoading}
                isSaved={isSaved}
                isWatched={isWatched}
                onToggleSave={toggleSave}
                onToggleWatched={toggleWatched}
              />
            }
          />
          <Route
            path="/saved"
            element={
              <SavedMatches
                matches={recommendedMatches}
                isLoading={isLoading}
                isSaved={isSaved}
                isWatched={isWatched}
                onToggleSave={toggleSave}
                onToggleWatched={toggleWatched}
              />
            }
          />
          <Route
            path="/watched"
            element={
              <WatchedMatches
                matches={recommendedMatches}
                isLoading={isLoading}
                isSaved={isSaved}
                isWatched={isWatched}
                onToggleSave={toggleSave}
                onToggleWatched={toggleWatched}
              />
            }
          />
          <Route
            path="/settings"
            element={
              <Settings
                profile={profile}
                onUpdateFavorites={updateFavorites}
                onReset={resetProfile}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;
