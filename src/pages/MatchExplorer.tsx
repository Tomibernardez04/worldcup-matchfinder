import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, RefreshCw, HelpCircle } from 'lucide-react';
import type { Match } from '../types';
import MatchCard from '../components/MatchCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { COMPETITION_STAGES } from '../constants';
import { translateTeamName, translateStage, translateGroup } from '../utils/translations';

interface MatchExplorerProps {
  matches: Match[];
  isLoading: boolean;
  isSaved: (id: string) => boolean;
  isWatched: (id: string) => boolean;
  onToggleSave: (id: string) => void;
  onToggleWatched: (id: string) => void;
}

type SortOption = 'date-asc' | 'date-desc' | 'score-desc' | 'score-asc' | 'popularity-desc';

export const MatchExplorer: React.FC<MatchExplorerProps> = ({
  matches,
  isLoading,
  isSaved,
  isWatched,
  onToggleSave,
  onToggleWatched
}) => {
  // Empty State from provider (Issue 3)
  if (!isLoading && matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800/80 flex items-center justify-center mb-6">
          <HelpCircle className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No hay partidos disponibles</h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          Los datos del fixture del Mundial 2026 todavía no están disponibles.
        </p>
      </div>
    );
  }

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [selectedStage, setSelectedStage] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('score-desc');

  // Derive available groups from actual match data
  const availableGroups = useMemo(() => {
    const groups = new Set<string>();
    matches.forEach(m => {
      if (m.group) groups.add(m.group);
    });
    return Array.from(groups).sort();
  }, [matches]);

  // Derive unique team names from actual match data to filter
  const allMatchTeams = useMemo(() => {
    const teams = new Set<string>();
    matches.forEach(m => {
      teams.add(m.homeTeam.name);
      teams.add(m.awayTeam.name);
    });
    return Array.from(teams).sort();
  }, [matches]);

  // Filter and sort match fixtures
  const filteredAndSortedMatches = useMemo(() => {
    let list = [...matches];

    // 1. Search term (matches home team, away team, or venue)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(m => 
        m.homeTeam.name.toLowerCase().includes(term) ||
        translateTeamName(m.homeTeam.name).toLowerCase().includes(term) ||
        m.awayTeam.name.toLowerCase().includes(term) ||
        translateTeamName(m.awayTeam.name).toLowerCase().includes(term) ||
        m.venue.toLowerCase().includes(term)
      );
    }

    // 2. Filter by specific Team
    if (selectedTeam) {
      list = list.filter(m => 
        m.homeTeam.name === selectedTeam || 
        m.awayTeam.name === selectedTeam
      );
    }

    // 3. Filter by Tournament Stage
    if (selectedStage) {
      list = list.filter(m => m.stage === selectedStage);
    }

    // 4. Filter by Group
    if (selectedGroup) {
      list = list.filter(m => m.group === selectedGroup);
    }

    // 5. Filter by Date
    if (selectedDate) {
      list = list.filter(m => m.date === selectedDate);
    }

    // 6. Sorting
    list.sort((a, b) => {
      if (sortBy === 'date-asc') {
        const timeA = new Date(`${a.date}T${a.time}`).getTime();
        const timeB = new Date(`${b.date}T${b.time}`).getTime();
        return timeA - timeB;
      }
      if (sortBy === 'date-desc') {
        const timeA = new Date(`${a.date}T${a.time}`).getTime();
        const timeB = new Date(`${b.date}T${b.time}`).getTime();
        return timeB - timeA;
      }
      if (sortBy === 'score-desc') {
        return (b.imperdibilityScore || 0) - (a.imperdibilityScore || 0);
      }
      if (sortBy === 'score-asc') {
        return (a.imperdibilityScore || 0) - (b.imperdibilityScore || 0);
      }
      if (sortBy === 'popularity-desc') {
        const popA = (a.homeTeam.popularity + a.awayTeam.popularity) / 2;
        const popB = (b.homeTeam.popularity + b.awayTeam.popularity) / 2;
        return popB - popA;
      }
      return 0;
    });

    return list;
  }, [matches, searchTerm, selectedTeam, selectedStage, selectedGroup, selectedDate, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTeam('');
    setSelectedStage('');
    setSelectedGroup('');
    setSelectedDate('');
    setSortBy('score-desc');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white m-0">
          Explorador de Partidos del Mundial
        </h1>
        <p className="text-slate-400 text-xs md:text-sm mt-1">
          Buscá y ordená todos los partidos programados para armar tu calendario de partidos personalizado.
        </p>
      </div>

      {/* Control Panel: Filters, Search and Sorting */}
      <div className="bg-bg-card border border-border-subtle rounded-2xl p-5 md:p-6 space-y-4">
        
        {/* Row 1: Search & Sorting */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscá por equipo o sede (ej. Azteca, Alemania)..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-bg-dark border border-slate-800 focus:border-brand-primary rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none transition-all"
            />
          </div>
          
          {/* Sorting */}
          <div className="flex items-center gap-2 min-w-[240px] shrink-0">
            <ArrowUpDown className="w-4.5 h-4.5 text-slate-500" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortOption)}
              className="w-full bg-bg-dark border border-slate-800 hover:border-slate-700 rounded-xl px-3 py-3 text-sm focus:outline-none text-slate-300 font-medium cursor-pointer"
            >
              <option value="score-desc">Ordenar por: Recomendación (Mayor a menor)</option>
              <option value="score-asc">Ordenar por: Recomendación (Menor a mayor)</option>
              <option value="date-asc">Ordenar por: Fecha y hora (Más temprano)</option>
              <option value="date-desc">Ordenar por: Fecha y hora (Más tarde)</option>
              <option value="popularity-desc">Ordenar por: Popularidad del equipo (Mayor a menor)</option>
            </select>
          </div>
        </div>

        {/* Row 2: Advanced Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-800/40">
          
          {/* Team Filter */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Filtrar por Equipo</label>
            <select
              value={selectedTeam}
              onChange={e => setSelectedTeam(e.target.value)}
              className="bg-bg-dark border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none text-slate-300 cursor-pointer"
            >
              <option value="">Todos los países</option>
              {allMatchTeams.map(name => (
                <option key={name} value={name}>{translateTeamName(name)}</option>
              ))}
            </select>
          </div>

          {/* Stage Filter */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Fase del Torneo</label>
            <select
              value={selectedStage}
              onChange={e => setSelectedStage(e.target.value)}
              className="bg-bg-dark border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none text-slate-300 cursor-pointer"
            >
              <option value="">Todas las fases</option>
              {COMPETITION_STAGES.map(stage => (
                <option key={stage} value={stage}>{translateStage(stage)}</option>
              ))}
            </select>
          </div>

          {/* Group Filter */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Grupo</label>
            <select
              value={selectedGroup}
              onChange={e => setSelectedGroup(e.target.value)}
              className="bg-bg-dark border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none text-slate-300 cursor-pointer"
            >
              <option value="">Todos los grupos</option>
              {availableGroups.map(grp => (
                <option key={grp} value={grp}>{translateGroup(grp)}</option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Fecha del Partido</label>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                min="2026-06-11"
                max="2026-07-19"
                onChange={e => setSelectedDate(e.target.value)}
                className="w-full bg-bg-dark border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none text-slate-300 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Clear filter and results counter */}
        <div className="flex justify-between items-center pt-2 text-xs text-slate-400">
          <span>Se encontraron <strong>{filteredAndSortedMatches.length}</strong> partidos</span>
          {(searchTerm || selectedTeam || selectedStage || selectedGroup || selectedDate) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-brand-secondary hover:text-brand-secondary/80 font-bold hover:underline cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restablecer Filtros</span>
            </button>
          )}
        </div>

      </div>

      {/* Grid of Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonLoader count={6} />
        </div>
      ) : filteredAndSortedMatches.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/10 border border-slate-800/80 rounded-2xl p-6">
          <HelpCircle className="w-10 h-10 text-slate-600 mx-auto mb-4" />
          <h3 className="text-base font-bold text-white">No se encontraron partidos coincidentes</h3>
          <p className="text-slate-500 text-xs mt-1">
            Intentá ajustando los filtros de búsqueda o restableciendo los filtros para ver todos los partidos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedMatches.map(match => (
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

export default MatchExplorer;
