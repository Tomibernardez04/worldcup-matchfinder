import React, { useState } from 'react';
import { Heart, Globe, AlertOctagon, Save, CheckCircle } from 'lucide-react';
import type { UserProfile, Region } from '../types';
import { SUPPORTED_TEAMS, REGIONS } from '../constants';
import { translateTeamName, translateRegion } from '../utils/translations';

interface SettingsProps {
  profile: UserProfile;
  onUpdateFavorites: (teams: string[], regions: Region[]) => void;
  onReset: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  profile,
  onUpdateFavorites,
  onReset
}) => {
  // Local edit states
  const [selectedTeams, setSelectedTeams] = useState<string[]>([...profile.favoriteTeams]);
  const [selectedRegions, setSelectedRegions] = useState<Region[]>([...profile.favoriteRegions]);
  
  // UI indicators
  const [showSavedToast, setShowSavedToast] = useState<boolean>(false);

  const toggleTeam = (teamName: string) => {
    setSelectedTeams(prev =>
      prev.includes(teamName)
        ? prev.filter(t => t !== teamName)
        : [...prev, teamName]
    );
  };

  const toggleRegion = (regionName: Region) => {
    setSelectedRegions(prev =>
      prev.includes(regionName)
        ? prev.filter(r => r !== regionName)
        : [...prev, regionName]
    );
  };

  const handleSavePreferences = () => {
    onUpdateFavorites(selectedTeams, selectedRegions);
    triggerToast();
  };

  const triggerToast = () => {
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
    }, 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      
      {/* Toast Alert */}
      {showSavedToast && (
        <div className="fixed bottom-6 right-6 bg-brand-primary text-bg-dark font-extrabold text-sm py-3 px-5 rounded-2xl shadow-2xl flex items-center gap-2 border border-brand-primary/20 z-50 animate-bounce">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>¡Configuración actualizada con éxito!</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white m-0">
          Configuración de la Aplicación
        </h1>
        <p className="text-slate-400 text-xs md:text-sm mt-1">
          Personalizá tus preferencias de recomendación y restablecé los datos de la aplicación.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {/* PANEL 1: FAVORITE TEAMS */}
        <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800/60">
            <Heart className="w-5 h-5 text-brand-primary" />
            <h3 className="font-extrabold text-base text-slate-100">Equipos Nacionales Favoritos</h3>
          </div>
          <p className="text-xs text-slate-400">
            Los partidos de estos equipos seleccionados reciben una mayor puntuación de recomendación (impulso en el puntaje de Imperdibles).
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[220px] overflow-y-auto pr-2">
            {SUPPORTED_TEAMS.map(team => {
              const isSelected = selectedTeams.includes(team.name);
              return (
                <button
                  key={team.name}
                  onClick={() => toggleTeam(team.name)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-brand-primary/10 border-brand-primary text-brand-primary'
                      : 'bg-bg-dark/40 border-slate-800/80 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xl select-none">{team.flag}</span>
                  <span className="font-bold text-xs truncate text-slate-200">{translateTeamName(team.name)}</span>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSavePreferences}
              className="flex items-center gap-2 py-2.5 px-5 bg-brand-primary text-bg-dark rounded-xl font-bold transition-all hover:scale-102 cursor-pointer shadow-md text-xs"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Equipos Favoritos</span>
            </button>
          </div>
        </div>

        {/* PANEL 2: CONFEDERATIONS & REGIONS */}
        <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800/60">
            <Globe className="w-5 h-5 text-brand-secondary" />
            <h3 className="font-extrabold text-base text-slate-100">Intereses de Confederaciones</h3>
          </div>
          <p className="text-xs text-slate-400">
            Mejorá la recomendación de partidos con equipos de las regiones que seguís (CONMEBOL, UEFA, CONCACAF, etc.).
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {REGIONS.map(region => {
              const isSelected = selectedRegions.includes(region);
              return (
                <button
                  key={region}
                  onClick={() => toggleRegion(region)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-brand-secondary/10 border-brand-secondary text-brand-secondary'
                      : 'bg-bg-dark/40 border-slate-800/80 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Globe className={`w-5 h-5 mb-2 ${isSelected ? 'text-brand-secondary' : 'text-slate-600'}`} />
                  <span className="font-bold text-[10px] tracking-wider uppercase truncate w-full">{translateRegion(region)}</span>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSavePreferences}
              className="flex items-center gap-2 py-2.5 px-5 bg-brand-secondary text-bg-dark rounded-xl font-bold transition-all hover:scale-102 cursor-pointer shadow-md text-xs"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Confederaciones</span>
            </button>
          </div>
        </div>

        {/* PANEL 3: DANGER ZONE */}
        <div className="bg-slate-900/40 border border-red-500/20 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-red-500/10">
            <AlertOctagon className="w-5 h-5 text-red-500" />
            <h3 className="font-extrabold text-base text-red-400">Zona de Peligro</h3>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h4 className="font-bold text-xs text-slate-200">Eliminar base de datos local y configuración de perfil</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">
                Borra todos los partidos guardados, vistos y restablece tus equipos de interés volviendo a la configuración inicial. Esto es permanente.
              </p>
            </div>
            
            <button
              onClick={onReset}
              className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all hover:scale-102 cursor-pointer shrink-0"
            >
              Restablecer Caché de la Aplicación
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
