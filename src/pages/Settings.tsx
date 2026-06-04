import React, { useState } from 'react';
import { Heart, Globe, AlertOctagon, Save, CheckCircle, Clock } from 'lucide-react';
import type { UserProfile, Region } from '../types';
import { SUPPORTED_TEAMS, REGIONS } from '../constants';
import { translateTeamName, translateRegion } from '../utils/translations';
import { getFlagUrl } from '../utils/flagUtils';

interface SettingsProps {
  profile: UserProfile;
  onUpdateFavorites: (
    teams: string[],
    regions: Region[],
    preferredStartTime?: string,
    preferredEndTime?: string
  ) => void;
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
  const [enableHours, setEnableHours] = useState<boolean>(!!(profile.preferredStartTime && profile.preferredEndTime));
  const [startTime, setStartTime] = useState<string>(profile.preferredStartTime || '18:00');
  const [endTime, setEndTime] = useState<string>(profile.preferredEndTime || '23:00');
  
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
    onUpdateFavorites(
      selectedTeams,
      selectedRegions,
      enableHours ? startTime : undefined,
      enableHours ? endTime : undefined
    );
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
                  <img
                    src={getFlagUrl(team.code, 40)}
                    alt={`${team.name} flag`}
                    className="w-6 h-4.5 object-cover rounded border border-slate-850 shadow-sm shrink-0 select-none"
                  />
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

        {/* PANEL 3: USUAL VIEWING TIMES */}
        <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800/60">
            <Clock className="w-5 h-5 text-brand-primary" />
            <h3 className="font-extrabold text-base text-slate-100">Horario Habitual para Ver Partidos (Opcional)</h3>
          </div>
          <p className="text-xs text-slate-400">
            Definí el rango horario en el que podés ver partidos cómodamente. Esto ajustará levemente la recomendación y agregará indicadores visuales de disponibilidad sin ocultar partidos.
          </p>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="enableHours"
              checked={enableHours}
              onChange={(e) => setEnableHours(e.target.checked)}
              className="w-4 h-4 rounded bg-bg-dark border-slate-800 text-brand-primary focus:ring-brand-primary focus:ring-offset-bg-card transition-all cursor-pointer"
            />
            <label htmlFor="enableHours" className="font-bold text-xs text-slate-200 cursor-pointer select-none">
              Habilitar mi horario habitual de visualización
            </label>
          </div>

          {enableHours && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md pt-2">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Hora de Inicio</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="bg-bg-dark border border-slate-800 focus:border-brand-primary rounded-xl px-4 py-2.5 text-xs focus:outline-none text-slate-300 cursor-pointer transition-all"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Hora de Fin</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="bg-bg-dark border border-slate-800 focus:border-brand-primary rounded-xl px-4 py-2.5 text-xs focus:outline-none text-slate-300 cursor-pointer transition-all"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSavePreferences}
              className="flex items-center gap-2 py-2.5 px-5 bg-brand-primary text-bg-dark rounded-xl font-bold transition-all hover:scale-102 cursor-pointer shadow-md text-xs"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Horarios</span>
            </button>
          </div>
        </div>

        {/* PANEL 4: DANGER ZONE */}
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
