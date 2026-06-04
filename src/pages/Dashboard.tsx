import React, { useState, useMemo } from 'react';
import { Flame, Sparkles, AlertTriangle, RefreshCw, EyeOff, Eye, Info, Bookmark, Check } from 'lucide-react';
import type { Match, UserProfile, StageFilter } from '../types';
import MatchCard from '../components/MatchCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { parseMatchDateTime, formatMatchDateLong, formatMatchTime } from '../utils/dateUtils';
import { translateTeamName, translateStage, translateGroup } from '../utils/translations';
import { getFlagUrl } from '../utils/flagUtils';

interface DashboardProps {
  matches: Match[];
  isLoading: boolean;
  error: string | null;
  profile: UserProfile;
  isSaved: (id: string) => boolean;
  isWatched: (id: string) => boolean;
  onToggleSave: (id: string) => void;
  onToggleWatched: (id: string) => void;
  onRetry: () => void;
  stageFilter: StageFilter;
  onStageFilterChange: (filter: StageFilter) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  matches,
  isLoading,
  error,
  profile,
  isSaved,
  isWatched,
  onToggleSave,
  onToggleWatched,
  onRetry,
  stageFilter,
  onStageFilterChange
}) => {
  const [hideWatched, setHideWatched] = useState<boolean>(false);

  // Filter and sort matches by Imperdibility Score
  const scoredMatches = useMemo(() => {
    let list = [...matches];

    if (hideWatched) {
      list = list.filter(m => !isWatched(m.id));
    }

    // Matches should be pre-scored, but double-check and sort
    return list.sort((a, b) => (b.imperdibilityScore || 0) - (a.imperdibilityScore || 0));
  }, [matches, hideWatched, isWatched]);

  // #1 Top Recommended Match (Hero Match by priority rules)
  const heroMatch = useMemo(() => {
    let list = [...matches];
    if (hideWatched) {
      list = list.filter(m => !isWatched(m.id));
    }
    if (list.length === 0) return null;

    const getMatchTimestamp = (m: Match): number => {
      try {
        const timeClean = m.time.split(' ')[0];
        return new Date(`${m.date}T${timeClean}`).getTime();
      } catch {
        return Number.MAX_SAFE_INTEGER;
      }
    };

    // Priority 1: Favorite team match closest in time
    const favMatches = list.filter(m =>
      profile.favoriteTeams.includes(m.homeTeam.name) ||
      profile.favoriteTeams.includes(m.awayTeam.name)
    );
    if (favMatches.length > 0) {
      const sortedFav = [...favMatches].sort((a, b) => getMatchTimestamp(a) - getMatchTimestamp(b));
      return sortedFav[0];
    }

    // Priority 2: Final
    const finalMatch = list.find(m => m.stage === 'Final');
    if (finalMatch) {
      return finalMatch;
    }

    // Priority 3: Semifinal closest in time
    const semiMatches = list.filter(m => m.stage === 'Semi Finals');
    if (semiMatches.length > 0) {
      const sortedSemi = [...semiMatches].sort((a, b) => getMatchTimestamp(a) - getMatchTimestamp(b));
      return sortedSemi[0];
    }

    // Priority 4: Highest finalScore
    const sortedByScore = [...list].sort((a, b) => (b.imperdibilityScore || 0) - (a.imperdibilityScore || 0));
    return sortedByScore[0];
  }, [matches, hideWatched, isWatched, profile]);

  // Top Matches (category === 'Must Watch') excluding Hero
  const blockbusterMatches = useMemo(() => {
    let list = [...matches];
    if (hideWatched) {
      list = list.filter(m => !isWatched(m.id));
    }
    if (heroMatch) {
      list = list.filter(m => m.id !== heroMatch.id);
    }
    const filtered = list.filter(m => m.category === 'Must Watch');
    return filtered.sort((a, b) => (b.imperdibilityScore || 0) - (a.imperdibilityScore || 0));
  }, [matches, hideWatched, isWatched, heroMatch]);

  // Medium Matches (category === 'Worth Watching') excluding Hero
  const worthWatchingMatches = useMemo(() => {
    let list = [...matches];
    if (hideWatched) {
      list = list.filter(m => !isWatched(m.id));
    }
    if (heroMatch) {
      list = list.filter(m => m.id !== heroMatch.id);
    }
    const filtered = list.filter(m => m.category === 'Worth Watching');
    return filtered.sort((a, b) => (b.imperdibilityScore || 0) - (a.imperdibilityScore || 0));
  }, [matches, hideWatched, isWatched, heroMatch]);

  // Error State
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Error de Sincronización</h3>
        <p className="text-slate-400 text-sm mb-6">{error}</p>
        <button
          onClick={onRetry}
          className="flex items-center gap-2 py-3 px-6 bg-brand-primary text-bg-dark rounded-xl font-bold transition-all hover:scale-105 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reintentar Carga</span>
        </button>
      </div>
    );
  }

  // Empty State from provider (Issue 3)
  if (!isLoading && matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800/80 flex items-center justify-center mb-6">
          <Info className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No hay partidos disponibles</h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          Los datos del fixture del Mundial 2026 todavía no están disponibles.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Dashboard Welcome Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-start gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2 m-0">
            ¡Bienvenido, futbolero!
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end">
          {/* Stage Filter Button Group */}
          <div className="flex items-center bg-slate-900/60 p-1 rounded-xl border border-slate-800 shrink-0">
            {(['groups', 'knockout', 'all'] as StageFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => onStageFilterChange(f)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] md:text-xs font-bold transition-all cursor-pointer ${stageFilter === f
                    ? 'bg-brand-primary text-bg-dark shadow'
                    : 'text-slate-400 hover:text-slate-200'
                  }`}
              >
                {f === 'groups' && '🏆 Fase de Grupos'}
                {f === 'knockout' && '🔥 Fase Eliminatoria'}
                {f === 'all' && '🌍 Todo el Torneo'}
              </button>
            ))}
          </div>

          {/* Hide Watched toggle */}
          <button
            onClick={() => setHideWatched(!hideWatched)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${hideWatched
                ? 'bg-brand-primary/10 border-brand-primary text-brand-primary'
                : 'bg-transparent border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
              }`}
          >
            {hideWatched ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span>{hideWatched ? 'Mostrando no vistos' : 'Ocultar partidos vistos'}</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="space-y-10">
          <div className="h-80 w-full bg-slate-900 animate-pulse rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonLoader count={3} />
          </div>
        </div>
      ) : (
        <>
          {scoredMatches.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/20 border border-slate-800 rounded-3xl p-8">
              <Info className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white">No hay partidos disponibles</h3>
              <p className="text-slate-500 text-sm mt-1">
                Intentá desactivando el filtro "Ocultar partidos vistos" o restableciendo tus preferencias en Configuración.
              </p>
            </div>
          ) : (
            <>
              {/* 1. HERO SPOTLIGHT CARD */}
              {(() => {
                if (!heroMatch) return null;
                let heroDateStr = heroMatch.date;
                let heroTimeStr = heroMatch.time;
                let heroDateObj: Date | null = null;
                try {
                  heroDateObj = parseMatchDateTime(heroDateStr, heroTimeStr);
                } catch (e) { }
                const heroFormattedDate = heroDateObj ? formatMatchDateLong(heroDateObj) : heroDateStr;
                const heroFormattedTime = heroDateObj ? formatMatchTime(heroDateObj) : heroTimeStr;

                return (
                  <section className="space-y-4">
                    <h3 className="text-xs uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-2">
                      <Flame className="w-4 h-4 text-red-500" /> Destacado del Mundial
                    </h3>

                    <div className="bg-gradient-to-br from-slate-900 via-bg-card to-slate-950 rounded-3xl border border-brand-primary/25 shadow-2xl overflow-hidden relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 to-transparent pointer-events-none" />

                      <div className="p-4 sm:p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-center">
                        {/* Left: VS Showcase */}
                        <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-4 lg:space-y-6">
                          <div className="flex flex-wrap gap-2 items-center justify-between w-full">
                            <div className="flex flex-wrap gap-2 items-center">
                              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-brand-primary/10 border border-brand-primary/30 text-brand-primary uppercase tracking-wider">
                                🔥 Imperdible
                              </span>
                              {heroMatch.availabilityBadge === 'Ideal' && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                                  🟢 Horario Ideal
                                </span>
                              )}
                              {heroMatch.availabilityBadge === 'Aceptable' && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold bg-amber-500/10 border border-amber-500/30 text-amber-400">
                                  🟡 Horario Aceptable
                                </span>
                              )}
                              {heroMatch.availabilityBadge === 'Complicado' && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold bg-rose-500/10 border border-rose-500/30 text-rose-400">
                                  🔴 Horario Complicado
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-400 font-semibold bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                              {translateStage(heroMatch.stage)} {heroMatch.group && ` - ${translateGroup(heroMatch.group)}`}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-2 py-2 lg:py-4">
                            {/* Home Team */}
                            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-5 w-5/12 text-center md:text-left">
                              <img
                                src={getFlagUrl(heroMatch.homeTeam.code, 40)}
                                alt={translateTeamName(heroMatch.homeTeam.name)}
                                className="w-12 h-8 md:w-14 md:h-10 object-cover rounded border border-slate-800 shadow-md shrink-0 select-none mb-1 md:mb-0"
                              />
                              <div className="min-w-0 w-full">
                                <h4 className="text-sm md:text-2xl font-extrabold text-white truncate">{translateTeamName(heroMatch.homeTeam.name)}</h4>
                                <span className="text-[10px] md:text-xs text-slate-400 font-semibold block md:inline">Puesto FIFA #{heroMatch.homeTeam.ranking}</span>
                              </div>
                            </div>

                            <div className="flex flex-col items-center justify-center w-2/12 shrink-0">
                              <span className="text-xs font-extrabold text-brand-secondary/80 bg-brand-secondary/5 border border-brand-secondary/20 px-3 py-1 rounded">VS</span>
                            </div>

                            {/* Away Team */}
                            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-5 w-5/12 justify-end text-center md:text-right">
                              <div className="min-w-0 w-full order-2 md:order-1">
                                <h4 className="text-sm md:text-2xl font-extrabold text-white truncate">{translateTeamName(heroMatch.awayTeam.name)}</h4>
                                <span className="text-[10px] md:text-xs text-slate-400 font-semibold block md:inline">Puesto FIFA #{heroMatch.awayTeam.ranking}</span>
                              </div>
                              <img
                                src={getFlagUrl(heroMatch.awayTeam.code, 40)}
                                alt={translateTeamName(heroMatch.awayTeam.name)}
                                className="w-12 h-8 md:w-14 md:h-10 object-cover rounded border border-slate-800 shadow-md shrink-0 select-none mb-1 md:mb-0 order-1 md:order-2"
                              />
                            </div>
                          </div>

                          {/* Venue / Timing */}
                          <div className="grid grid-cols-2 gap-y-2 gap-x-4 sm:flex sm:flex-wrap sm:gap-4 text-[10px] sm:text-xs text-slate-400 bg-slate-950/40 p-3 rounded-2xl border border-slate-800/40">
                            <span className="font-semibold col-span-2 sm:col-span-1">Sede: {heroMatch.venue}</span>
                            <span className="hidden sm:inline text-slate-600">|</span>
                            <span>Fecha: {heroFormattedDate}</span>
                            <span className="hidden sm:inline text-slate-600">|</span>
                            <span>Hora: {heroFormattedTime}</span>
                          </div>
                        </div>

                        {/* Right: Score Breakdown Dial */}
                        <div className="lg:col-span-5 bg-slate-950/60 rounded-2xl p-4 sm:p-6 border border-slate-800/80 flex flex-col justify-between h-full space-y-3 sm:space-y-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h5 className="font-bold text-sm text-slate-200">Índice de Recomendación</h5>
                              <p className="text-[10px] text-slate-500 font-semibold uppercase">Puntaje ponderado del partido</p>
                            </div>
                            <div className="text-right">
                              <span className="text-3xl font-extrabold text-brand-primary">{heroMatch.imperdibilityScore}</span>
                              <span className="text-xs text-slate-500">/100</span>
                            </div>
                          </div>

                          {/* Breakdown progress bars */}
                          {heroMatch.scoreBreakdown && (
                            <div className="space-y-1.5 sm:space-y-2.5 pt-2 border-t border-slate-800">
                              {[
                                { label: 'Fase del Torneo', val: heroMatch.scoreBreakdown.stageScore, color: 'bg-brand-secondary' },
                                { label: 'Factor de Popularidad', val: heroMatch.scoreBreakdown.popularityScore, color: 'bg-brand-primary' },
                                { label: 'Rankings FIFA', val: heroMatch.scoreBreakdown.rankingScore, color: 'bg-purple-500' },
                                { label: 'Rivalidad Histórica', val: heroMatch.scoreBreakdown.rivalryScore, color: 'bg-red-500' },
                                { label: 'Preferencia de Usuario', val: heroMatch.scoreBreakdown.userPreferenceScore, color: 'bg-brand-accent' },
                                ...(heroMatch.scoreBreakdown.availabilityScore !== undefined
                                  ? [{ label: 'Disponibilidad Horaria', val: heroMatch.scoreBreakdown.availabilityScore, color: 'bg-emerald-500' }]
                                  : [])
                              ].map((item, idx) => (
                                <div key={idx} className="space-y-1">
                                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                                    <span>{item.label}</span>
                                    <span>{item.val} pts</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.val}%` }} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-3 pt-4 border-t border-slate-800/60 mt-auto">
                            <button
                              onClick={() => onToggleSave(heroMatch.id)}
                              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${isSaved(heroMatch.id)
                                  ? 'bg-brand-accent/20 border-brand-accent text-brand-accent'
                                  : 'bg-transparent border-slate-700 text-slate-300 hover:border-slate-500'
                                }`}
                            >
                              <Bookmark className={`w-3.5 h-3.5 ${isSaved(heroMatch.id) ? 'fill-current' : ''}`} />
                              <span>{isSaved(heroMatch.id) ? 'Guardado' : 'Guardar'}</span>
                            </button>

                            <button
                              onClick={() => onToggleWatched(heroMatch.id)}
                              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${isWatched(heroMatch.id)
                                  ? 'bg-brand-primary/20 border-brand-primary text-brand-primary'
                                  : 'bg-transparent border-slate-700 text-slate-300 hover:border-slate-500'
                                }`}
                            >
                              <Check className={`w-3.5 h-3.5 ${isWatched(heroMatch.id) ? 'stroke-[3px]' : ''}`} />
                              <span>{isWatched(heroMatch.id) ? 'Visto' : 'Marcar Visto'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                );
              })()}

              {/* 2. BLOCKBUSTER MATCHES (Score 80+) */}
              {blockbusterMatches.length > 0 && (
                <section className="space-y-4">
                  <h3 className="text-xs uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-accent" /> Partidos Imperdibles
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blockbusterMatches.map(match => (
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
                </section>
              )}

              {/* 3. WORTH WATCHING MATCHES (Score 50-79) */}
              {worthWatchingMatches.length > 0 && (
                <section className="space-y-4">
                  <h3 className="text-xs uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-2">
                    Partidos Recomendados
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {worthWatchingMatches.map(match => (
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
                </section>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
