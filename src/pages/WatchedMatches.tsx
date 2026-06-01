import React, { useMemo } from 'react';
import { Eye } from 'lucide-react';
import type { Match } from '../types';
import MatchCard from '../components/MatchCard';
import SkeletonLoader from '../components/SkeletonLoader';

interface WatchedMatchesProps {
  matches: Match[];
  isLoading: boolean;
  isSaved: (id: string) => boolean;
  isWatched: (id: string) => boolean;
  onToggleSave: (id: string) => void;
  onToggleWatched: (id: string) => void;
}

export const WatchedMatches: React.FC<WatchedMatchesProps> = ({
  matches,
  isLoading,
  isSaved,
  isWatched,
  onToggleSave,
  onToggleWatched
}) => {
  // Filter matches that are watched
  const watchedMatches = useMemo(() => {
    return matches.filter(m => isWatched(m.id));
  }, [matches, isWatched]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white m-0">
          Partidos Vistos ({watchedMatches.length})
        </h1>
        <p className="text-slate-400 text-xs md:text-sm mt-1">
          Un historial de los partidos que marcaste como vistos. ¡Mantenete al día con tu agenda de partidos!
        </p>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonLoader count={3} />
        </div>
      ) : watchedMatches.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/10 border border-slate-800/80 rounded-2xl p-6 max-w-md mx-auto mt-6">
          <Eye className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white">Aún no viste ningún partido</h3>
          <p className="text-slate-500 text-xs mt-2 leading-relaxed">
            A medida que avance el torneo, marcá los partidos que veas haciendo clic en el botón **Marcar Visto**.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {watchedMatches.map(match => (
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

export default WatchedMatches;
