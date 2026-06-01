import React, { useMemo } from 'react';
import { Bookmark } from 'lucide-react';
import type { Match } from '../types';
import MatchCard from '../components/MatchCard';
import SkeletonLoader from '../components/SkeletonLoader';

interface SavedMatchesProps {
  matches: Match[];
  isLoading: boolean;
  isSaved: (id: string) => boolean;
  isWatched: (id: string) => boolean;
  onToggleSave: (id: string) => void;
  onToggleWatched: (id: string) => void;
}

export const SavedMatches: React.FC<SavedMatchesProps> = ({
  matches,
  isLoading,
  isSaved,
  isWatched,
  onToggleSave,
  onToggleWatched
}) => {
  // Filter matches that are saved
  const savedMatches = useMemo(() => {
    return matches
      .filter(m => isSaved(m.id))
      .sort((a, b) => (b.imperdibilityScore || 0) - (a.imperdibilityScore || 0)); // Sorted by rating
  }, [matches, isSaved]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white m-0">
          Partidos Guardados ({savedMatches.length})
        </h1>
        <p className="text-slate-400 text-xs md:text-sm mt-1">
          Tu lista de seguimiento guardada, ordenada por prioridad de recomendación. ¡No te pierdas estos partidos!
        </p>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonLoader count={3} />
        </div>
      ) : savedMatches.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/10 border border-slate-800/80 rounded-2xl p-6 max-w-md mx-auto mt-6">
          <Bookmark className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white">Tu lista de seguimiento está vacía</h3>
          <p className="text-slate-500 text-xs mt-2 leading-relaxed">
            Ir al <a href="#/" className="text-brand-secondary font-bold hover:underline">Tablero</a> o al <a href="#/explorer" className="text-brand-secondary font-bold hover:underline">Explorador</a> y hacé clic en el botón **Guardar** para armar tu lista del torneo.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedMatches.map(match => (
            <MatchCard
              key={match.id}
              match={match}
              isSaved={isSaved(match.id)}
              isWatched={isWatched(match.id)}
              onToggleSave={() => onToggleSave(match.id)}
              onToggleWatched={() => onToggleWatched(match.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedMatches;
