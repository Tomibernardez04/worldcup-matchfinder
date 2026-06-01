import React from 'react';
import { Bookmark, Check, Calendar, Clock, MapPin, Sparkles, Trophy } from 'lucide-react';
import type { Match } from '../types';
import { parseMatchDateTime, formatMatchDate, formatMatchTime } from '../utils/dateUtils';
import { translateTeamName, translateStage, translateGroup } from '../utils/translations';

interface MatchCardProps {
  match: Match;
  isSaved: boolean;
  isWatched: boolean;
  onToggleSave: () => void;
  onToggleWatched: () => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  isSaved,
  isWatched,
  onToggleSave,
  onToggleWatched
}) => {
  const score = match.imperdibilityScore || 0;
  
  // Decide score badge color scheme
  let scoreColorClass = 'text-slate-400 border-slate-700 bg-slate-950/80';
  let glowClass = '';
  if (match.category === 'Must Watch') {
    scoreColorClass = 'text-brand-primary border-brand-primary bg-brand-primary/10';
    glowClass = 'shadow-[0_0_15px_rgba(16,185,129,0.15)]';
  } else if (match.category === 'Worth Watching') {
    scoreColorClass = 'text-brand-accent border-brand-accent bg-brand-accent/10';
    glowClass = 'shadow-[0_0_15px_rgba(245,158,11,0.15)]';
  }

  // Parsing date and time using es-AR + America/Argentina/Buenos_Aires settings
  const matchDate = React.useMemo(() => {
    try {
      return parseMatchDateTime(match.date, match.time);
    } catch {
      return null;
    }
  }, [match.date, match.time]);

  const formattedDate = matchDate ? formatMatchDate(matchDate) : match.date;
  const formattedTime = matchDate ? formatMatchTime(matchDate) : match.time;

  return (
    <div className={`rounded-2xl glass-panel glass-panel-hover overflow-hidden flex flex-col justify-between h-full border border-slate-800 ${glowClass}`}>
      {/* Top Banner: Stage and Imperdibility Score */}
      <div className="p-4 pb-2 flex justify-between items-center">
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800/80 border border-slate-700 text-slate-200">
            <Trophy className="w-3.5 h-3.5 text-brand-secondary" />
            {translateStage(match.stage)}
            {match.group && <span className="text-slate-400">({translateGroup(match.group)})</span>}
          </span>
          {match.isPlaceholder && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-brand-secondary/10 border border-brand-secondary/30 text-brand-secondary tracking-wider uppercase">
              A confirmar
            </span>
          )}
        </div>
        
        <div className={`flex flex-col items-center justify-center border w-12 h-12 rounded-full font-bold text-sm tracking-tighter ${scoreColorClass}`}>
          <span className="text-[10px] uppercase font-semibold text-slate-400 leading-none">Partido</span>
          <span className="text-base leading-none mt-0.5">{score}</span>
        </div>
      </div>

      {/* Matchup Content */}
      <div className="px-5 py-2 flex flex-col items-center">
        <div className="w-full flex items-center justify-between gap-2 my-2">
          {/* Home Team */}
          <div className="flex flex-col items-center text-center w-5/12">
            <span className="text-4xl mb-2 drop-shadow-sm select-none" role="img" aria-label={translateTeamName(match.homeTeam.name)}>
              {match.homeTeam.flag}
            </span>
            <span className="font-bold text-slate-100 text-sm md:text-base truncate w-full">
              {translateTeamName(match.homeTeam.name)}
            </span>
            <span className="text-[10px] text-slate-400 uppercase mt-0.5 tracking-wider font-medium">
              Puesto #{match.homeTeam.ranking}
            </span>
          </div>

          {/* VS Divider */}
          <div className="flex flex-col items-center justify-center w-2/12">
            <span className="text-[11px] font-bold text-brand-secondary/80 bg-brand-secondary/5 px-2 py-0.5 rounded border border-brand-secondary/15 uppercase tracking-widest">
              VS
            </span>
            {match.status === 'Finished' && match.result && (
              <span className="text-sm font-extrabold text-slate-200 mt-2 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {match.result.homeScore} - {match.result.awayScore}
              </span>
            )}
            {match.status === 'Live' && (
              <span className="text-[10px] font-bold text-red-500 animate-pulse mt-2 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30 uppercase tracking-widest">
                EN VIVO
              </span>
            )}
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center text-center w-5/12">
            <span className="text-4xl mb-2 drop-shadow-sm select-none" role="img" aria-label={translateTeamName(match.awayTeam.name)}>
              {match.awayTeam.flag}
            </span>
            <span className="font-bold text-slate-100 text-sm md:text-base truncate w-full">
              {translateTeamName(match.awayTeam.name)}
            </span>
            <span className="text-[10px] text-slate-400 uppercase mt-0.5 tracking-wider font-medium">
              Puesto #{match.awayTeam.ranking}
            </span>
          </div>
        </div>

        {/* Date, Time and Venue Details */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-4 bg-slate-900/40 p-2 rounded-lg w-full border border-slate-800/40">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-brand-secondary" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-brand-secondary" />
            {formattedTime}
          </span>
          <span className="flex items-center gap-1 w-full justify-center mt-1 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <span className="truncate">{match.venue}</span>
          </span>
        </div>
      </div>

      {/* Explanations Section */}
      <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/10 flex-grow flex flex-col justify-start">
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 flex items-center gap-1 mb-2">
          <Sparkles className="w-3 h-3 text-brand-accent" /> Análisis de Recomendación
        </span>
        <ul className="space-y-1.5 text-xs text-slate-300">
          {match.recommendationExplanation?.slice(0, 3).map((exp, idx) => (
            <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
              <span className="text-brand-secondary/80 mt-1 select-none">•</span>
              <span>{exp}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex justify-between gap-3 mt-auto">
        <button
          onClick={onToggleSave}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer ${
            isSaved
              ? 'bg-brand-accent/15 border-brand-accent text-brand-accent hover:bg-brand-accent/25'
              : 'bg-transparent border-slate-700 text-slate-300 hover:border-slate-500 hover:text-slate-100'
          }`}
          title={isSaved ? 'Quitar de Guardados' : 'Guardar Partido'}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
          {isSaved ? 'Guardado' : 'Guardar'}
        </button>

        <button
          onClick={onToggleWatched}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer ${
            isWatched
              ? 'bg-brand-primary/15 border-brand-primary text-brand-primary hover:bg-brand-primary/25'
              : 'bg-transparent border-slate-700 text-slate-300 hover:border-slate-500 hover:text-slate-100'
          }`}
          title={isWatched ? 'Marcar como no visto' : 'Marcar como visto'}
        >
          <Check className={`w-3.5 h-3.5 ${isWatched ? 'stroke-[3px]' : ''}`} />
          {isWatched ? 'Visto' : 'Marcar Visto'}
        </button>
      </div>
    </div>
  );
};

export default MatchCard;
