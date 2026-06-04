import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Globe, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { SUPPORTED_TEAMS, REGIONS } from '../constants';
import type { UserProfile, Region } from '../types';
import { translateTeamName, translateRegion } from '../utils/translations';
import { getFlagUrl } from '../utils/flagUtils';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);
  
  // Selection states
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<Region[]>([]);
  const [enableHours, setEnableHours] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<string>('18:00');
  const [endTime, setEndTime] = useState<string>('23:00');

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

  const selectAllRegions = () => {
    if (selectedRegions.length === REGIONS.length) {
      setSelectedRegions([]);
    } else {
      setSelectedRegions([...REGIONS]);
    }
  };

  const handleFinish = () => {
    const profile: UserProfile = {
      favoriteTeams: selectedTeams,
      favoriteRegions: selectedRegions.length > 0 ? selectedRegions : [...REGIONS], // Fallback to all if none selected
      preferredStartTime: enableHours ? startTime : undefined,
      preferredEndTime: enableHours ? endTime : undefined,
      setupComplete: true
    };
    onComplete(profile);
    navigate('/');
  };

  return (
    <div className="h-dvh w-screen bg-bg-dark text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Neon Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-brand-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-brand-secondary/5 blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-3xl h-[650px] max-h-[90dvh] glass-panel p-6 md:p-10 rounded-3xl border border-slate-800 shadow-2xl relative z-10 flex flex-col justify-between">
        
        {/* Stepper Header */}
        <div className="flex-none flex justify-between items-center mb-6 pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-primary/20 flex items-center justify-center border border-brand-primary/30">
              <Trophy className="w-4 h-4 text-brand-primary" />
            </div>
            <span className="font-extrabold text-sm tracking-wider uppercase text-slate-300">
              My World Cup
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map(i => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step 
                    ? 'w-8 bg-brand-primary' 
                    : 'w-3 bg-brand-primary/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Welcome & Choose Teams */}
        {step === 1 && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-6 mb-4">
              <div className="space-y-3">
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
                  ¿A qué selecciones apoyás?
                </h2>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                  Los partidos en los que jueguen tus equipos favoritos recibirán un gran impulso en su puntaje de recomendación. Seleccioná todos los que correspondan.
                </p>
              </div>

              {/* Grid of Teams */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {SUPPORTED_TEAMS.map(team => {
                  const isSelected = selectedTeams.includes(team.name);
                  return (
                    <button
                      key={team.name}
                      onClick={() => toggleTeam(team.name)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-brand-primary/10 border-brand-primary text-brand-primary shadow-sm shadow-brand-primary/5'
                          : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/70'
                      }`}
                    >
                      <img
                        src={getFlagUrl(team.code, 40)}
                        alt={translateTeamName(team.name)}
                        className="w-7 h-5 object-cover rounded border border-slate-800 shadow-sm shrink-0 select-none"
                      />
                      <div className="min-w-0">
                        <span className="block font-bold text-xs truncate text-slate-100">{translateTeamName(team.name)}</span>
                        <span className="block text-[9px] text-slate-500 font-semibold">{translateRegion(team.region)}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="flex-none flex justify-end pt-4 border-t border-slate-800/80 w-full">
              <button
                onClick={() => setStep(2)}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-bg-dark rounded-xl font-bold transition-all cursor-pointer shadow-lg hover:shadow-brand-secondary/15 hover:scale-[1.02] whitespace-nowrap shrink-0"
              >
                <span>Continuar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Choose Regions */}
        {step === 2 && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-6 mb-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center gap-4">
                  <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                    ¿Qué regiones te interesan?
                  </h2>
                  <button
                    onClick={selectAllRegions}
                    className="text-xs text-brand-secondary bg-brand-secondary/10 border border-brand-secondary/30 px-3 py-1.5 rounded-lg font-bold transition-all hover:bg-brand-secondary/20 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {selectedRegions.length === REGIONS.length ? 'Desmarcar todas' : 'Seleccionar todas'}
                  </button>
                </div>
                <p className="text-slate-400 text-xs md:text-sm">
                  Mejorá la recomendación de partidos con equipos de las confederaciones que te interesa ver.
                </p>
              </div>

              {/* Grid of Regions */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {REGIONS.map(region => {
                  const isSelected = selectedRegions.includes(region);
                  return (
                    <button
                      key={region}
                      onClick={() => toggleRegion(region)}
                      className={`flex flex-col items-center justify-center p-6 rounded-2xl border text-center transition-all duration-200 cursor-pointer h-32 ${
                        isSelected
                          ? 'bg-brand-secondary/10 border-brand-secondary text-brand-secondary shadow-sm shadow-brand-secondary/5'
                          : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/70'
                      }`}
                    >
                      <Globe className={`w-7 h-7 mb-3 ${isSelected ? 'text-brand-secondary' : 'text-slate-500'}`} />
                      <span className="font-bold text-xs uppercase tracking-wider">{translateRegion(region)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="flex-none flex justify-between items-center gap-3 pt-4 border-t border-slate-800/80 w-full">
              <button
                onClick={() => setStep(1)}
                className="flex items-center justify-center gap-2 px-3 sm:px-5 py-3 bg-transparent hover:bg-slate-900 border border-slate-700 text-slate-300 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Atrás</span>
              </button>

              <button
                onClick={() => setStep(3)}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-bg-dark rounded-xl font-bold transition-all cursor-pointer shadow-lg hover:shadow-brand-secondary/15 hover:scale-[1.02] whitespace-nowrap shrink-0"
              >
                <span>Continuar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Choose Time Preferences */}
        {step === 3 && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-6 mb-4">
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
                  ¿En qué horario solés ver los partidos? <span className="text-slate-400 ml-1.5 whitespace-nowrap">(Opcional)</span>
                </h2>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                  Establecer tu horario habitual nos permite priorizar los partidos que se juegan cuando estás disponible.
                </p>
              </div>

              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="onboardingEnableHours"
                    checked={enableHours}
                    onChange={(e) => setEnableHours(e.target.checked)}
                    className="w-4 h-4 rounded bg-bg-dark border-slate-800 text-brand-primary focus:ring-brand-primary focus:ring-offset-slate-900 transition-all cursor-pointer"
                  />
                  <label htmlFor="onboardingEnableHours" className="font-bold text-xs text-slate-200 cursor-pointer select-none">
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
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="flex-none flex justify-between items-center gap-3 pt-4 border-t border-slate-800/80 w-full">
              <button
                onClick={() => setStep(2)}
                className="flex items-center justify-center gap-2 px-3 sm:px-5 py-3 bg-transparent hover:bg-slate-900 border border-slate-700 text-slate-300 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Atrás</span>
              </button>

              <button
                onClick={handleFinish}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-bg-dark rounded-xl font-bold transition-all cursor-pointer shadow-lg hover:shadow-brand-secondary/15 hover:scale-[1.02] whitespace-nowrap shrink-0"
              >
                <span>Ingresar al Tablero</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Onboarding;
