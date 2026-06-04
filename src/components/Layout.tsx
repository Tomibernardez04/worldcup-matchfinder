import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Flame, 
  Search, 
  Bookmark, 
  CheckSquare, 
  Settings, 
  Trophy,
  Eye,
  Menu,
  X
} from 'lucide-react';
import type { UserProfile } from '../types';
import { SUPPORTED_TEAMS } from '../constants';
import { translateTeamName } from '../utils/translations';
import { getFlagUrl } from '../utils/flagUtils';

interface LayoutProps {
  children: React.ReactNode;
  profile: UserProfile;
  savedCount: number;
  watchedCount: number;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  profile,
  savedCount,
  watchedCount
}) => {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  // Manage body scroll locking and Escape key listener when drawer is open
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDrawerOpen(false);
      }
    };
    if (isDrawerOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  // Helper to extract names and codes of favorite teams
  const favoriteTeamsData = profile.favoriteTeams.map(name => {
    const team = SUPPORTED_TEAMS.find(t => t.name === name);
    return {
      name,
      code: team ? team.code : ''
    };
  });

  const handleNavLinkClick = (to: string) => {
    if (to !== '/settings') {
      setIsDrawerOpen(false);
    }
  };

  const renderSidebarContent = () => (
    <div className="space-y-5 flex flex-col justify-between h-full">
      <div className="space-y-5">
        {/* App Branding */}
        <div 
          onClick={() => {
            navigate('/');
            setIsDrawerOpen(false);
          }} 
          className="flex items-center gap-3 cursor-pointer select-none py-1 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center glow-primary">
            <Flame className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent m-0 leading-none">
              MY WORLD CUP
            </h1>
            <p className="text-[10px] text-brand-secondary font-bold uppercase tracking-widest mt-0.5">
              Mundial 2026
            </p>
          </div>
        </div>

        {/* Quick User Stats Dashboard */}
        <div className="bg-slate-900/60 rounded-xl p-3 border border-border-subtle space-y-2.5">
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
          {favoriteTeamsData.length > 0 && (
            <div className="pt-2 border-t border-slate-800/60">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Equipos Seguidos ({favoriteTeamsData.length})
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-[48px] overflow-y-auto pr-1">
                {favoriteTeamsData.slice(0, 6).map((team, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center justify-center bg-bg-dark/80 px-1 py-0.5 rounded border border-slate-800"
                    title={translateTeamName(team.name)}
                  >
                    {team.code ? (
                      <img
                        src={getFlagUrl(team.code, 40)}
                        alt={`${team.name} flag`}
                        className="w-5 h-3.5 object-cover rounded-sm"
                      />
                    ) : (
                      <span className="text-xs">⚽</span>
                    )}
                  </span>
                ))}
                {favoriteTeamsData.length > 6 && (
                  <span className="text-[9px] bg-slate-800 px-1.5 py-1 rounded text-slate-300 font-bold self-center">
                    +{favoriteTeamsData.length - 6}
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
            onClick={() => handleNavLinkClick('/')}
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
            onClick={() => handleNavLinkClick('/explorer')}
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
            onClick={() => handleNavLinkClick('/saved')}
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
            onClick={() => handleNavLinkClick('/watched')}
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
            onClick={() => handleNavLinkClick('/settings')}
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

      {/* Footer Info */}
      <div className="pt-3 border-t border-slate-800/60 text-[10px] text-slate-500 text-center font-semibold tracking-wide">
        MY WORLD CUP v1.0
      </div>
    </div>
  );

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-bg-dark text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation - DESKTOP ONLY */}
      <aside className="hidden md:flex w-full md:w-64 bg-bg-card border-r border-border-subtle flex-col shrink-0 p-5">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Drawer (Hamburger Menu) */}
      {/* Backdrop */}
      <div 
        onClick={() => setIsDrawerOpen(false)}
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity duration-300 md:hidden ${
          isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer Panel */}
      <aside 
        className={`fixed inset-y-0 left-0 w-64 bg-bg-card border-r border-border-subtle z-50 p-5 flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close Button inside Drawer */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Cerrar menú de navegación"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Scrollable Container for Drawer Content */}
        <div className="flex-1 overflow-y-auto pr-1">
          {renderSidebarContent()}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-bg-dark overflow-y-auto">
        {/* Header bar */}
        <header className="h-16 border-b border-border-subtle flex justify-between items-center px-6 shrink-0 bg-bg-card/50 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-2">
            {/* Hamburger Menu Button - MOBILE ONLY */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Abrir menú de navegación"
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all cursor-pointer mr-2"
            >
              <Menu className="w-6 h-6" />
            </button>

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
