import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Flame, 
  Search, 
  Bookmark, 
  CheckSquare, 
  Settings, 
  LogOut,
  Trophy,
  Eye
} from 'lucide-react';
import type { UserProfile } from '../types';
import { SUPPORTED_TEAMS } from '../constants';
import { translateTeamName } from '../utils/translations';

interface LayoutProps {
  children: React.ReactNode;
  profile: UserProfile;
  resetProfile: () => void;
  savedCount: number;
  watchedCount: number;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  profile,
  resetProfile,
  savedCount,
  watchedCount
}) => {
  const navigate = useNavigate();

  // Helper to extract flags of favorite teams
  const favoriteTeamFlags = profile.favoriteTeams.map(name => {
    const team = SUPPORTED_TEAMS.find(t => t.name === name);
    return team ? team.flag : '⚽';
  });

  return (
    <div className="min-h-screen bg-bg-dark text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-bg-card border-b md:border-b-0 md:border-r border-border-subtle flex flex-col justify-between shrink-0 p-5">
        <div className="space-y-8">
          {/* App Branding */}
          <div 
            onClick={() => navigate('/')} 
            className="flex items-center gap-3 cursor-pointer select-none py-1 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center glow-primary">
              <Flame className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent m-0 leading-none">
                MUNDIAL 2026
              </h1>
              <p className="text-[10px] text-brand-secondary font-bold uppercase tracking-widest mt-0.5">
                Buscador de Partidos
              </p>
            </div>
          </div>

          {/* Quick User Stats Dashboard */}
          <div className="bg-slate-900/60 rounded-2xl p-4 border border-border-subtle space-y-3">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Tus Estadísticas</span>
              <span className="text-[10px] text-brand-primary font-bold">ACTIVO</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-bg-dark/60 rounded-xl p-2 border border-slate-800/40">
                <Bookmark className="w-4 h-4 mx-auto text-brand-accent mb-1" />
                <span className="block text-sm font-extrabold">{savedCount}</span>
                <span className="text-[9px] text-slate-500 font-semibold uppercase">Guardados</span>
              </div>
              <div className="bg-bg-dark/60 rounded-xl p-2 border border-slate-800/40">
                <Eye className="w-4 h-4 mx-auto text-brand-primary mb-1" />
                <span className="block text-sm font-extrabold">{watchedCount}</span>
                <span className="text-[9px] text-slate-500 font-semibold uppercase">Vistos</span>
              </div>
            </div>

            {/* Favorite Teams Flag Preview */}
            {favoriteTeamFlags.length > 0 && (
              <div className="pt-2 border-t border-slate-800/60">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Equipos Seguidos ({favoriteTeamFlags.length})
                </span>
                <div className="flex flex-wrap gap-1 max-h-[48px] overflow-y-auto pr-1">
                  {favoriteTeamFlags.slice(0, 6).map((flag, i) => (
                    <span key={i} className="text-lg bg-bg-dark/80 px-1 py-0.5 rounded border border-slate-800" title={translateTeamName(profile.favoriteTeams[i])}>
                      {flag}
                    </span>
                  ))}
                  {favoriteTeamFlags.length > 6 && (
                    <span className="text-[9px] bg-slate-800 px-1.5 py-1 rounded text-slate-300 font-bold self-center">
                      +{favoriteTeamFlags.length - 6}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block px-3 mb-2">
              Explorar Partidos
            </span>

            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-brand-primary/10 text-brand-primary border-l-4 border-brand-primary pl-2'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`
              }
            >
              <Flame className="w-4 h-4" />
              <span>Imperdibles</span>
            </NavLink>

            <NavLink
              to="/explorer"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-brand-primary/10 text-brand-primary border-l-4 border-brand-primary pl-2'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`
              }
            >
              <Search className="w-4 h-4" />
              <span>Explorador de Partidos</span>
            </NavLink>

            <NavLink
              to="/saved"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-brand-primary/10 text-brand-primary border-l-4 border-brand-primary pl-2'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`
              }
            >
              <Bookmark className="w-4 h-4" />
              <span>Partidos Guardados</span>
            </NavLink>

            <NavLink
              to="/watched"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-brand-primary/10 text-brand-primary border-l-4 border-brand-primary pl-2'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`
              }
            >
              <CheckSquare className="w-4 h-4" />
              <span>Partidos Vistos</span>
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-brand-primary/10 text-brand-primary border-l-4 border-brand-primary pl-2'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`
              }
            >
              <Settings className="w-4 h-4" />
              <span>Configuración</span>
            </NavLink>
          </nav>
        </div>

        {/* Footer Actions / Reset */}
        <div className="pt-6 border-t border-border-subtle mt-8 md:mt-0">
          <button
            onClick={resetProfile}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-3 bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Restablecer Preferencias</span>
          </button>
          
          <div className="text-[10px] text-slate-500 text-center mt-4 font-semibold tracking-wide">
            BUSCADOR DE PARTIDOS DEL MUNDIAL v1.0
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-bg-dark overflow-y-auto">
        {/* Header bar */}
        <header className="h-16 border-b border-border-subtle flex justify-between items-center px-6 shrink-0 bg-bg-card/50 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-brand-secondary" />
            <h2 className="text-sm font-extrabold tracking-wider uppercase text-slate-300 m-0">
              Copa Mundial de la FIFA 2026™
            </h2>
          </div>
        </header>

        {/* View Content */}
        <div className="p-6 md:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
