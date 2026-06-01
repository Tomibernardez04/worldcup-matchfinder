import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Globe, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { SUPPORTED_TEAMS, REGIONS } from '../constants';
import type { UserProfile, Region } from '../types';
import { translateTeamName, translateRegion } from '../utils/translations';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);
  
  // Selection states
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<Region[]>([]);

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
      setupComplete: true
    };
    onComplete(profile);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-bg-dark text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background Neon Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-brand-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-brand-secondary/5 blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-3xl glass-panel p-8 md:p-12 rounded-3xl border border-slate-800 shadow-2xl relative z-10">
        
        {/* Stepper Header */}
        <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-primary/20 flex items-center justify-center border border-brand-primary/30">
              <Trophy className="w-4 h-4 text-brand-primary" />
            </div>
            <span className="font-extrabold text-sm tracking-wider uppercase text-slate-300">
              Buscador de Partidos del Mundial
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {[1, 2].map(i => (
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
          <div className="space-y-6">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-primary/10 border border-brand-primary/25 text-brand-primary">
                <Sparkles className="w-3.5 h-3.5" /> ¡Presentamos puntajes recomendados!
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
                ¿A qué selecciones apoyás?
              </h2>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                Los partidos en los que jueguen tus equipos favoritos recibirán un gran impulso en su puntaje de recomendación. Seleccioná todos los que correspondan.
              </p>
            </div>

            {/* Grid of Teams */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto pr-2">
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
                    <span className="text-2xl select-none" role="img" aria-label={translateTeamName(team.name)}>
                      {team.flag}
                    </span>
                    <div className="min-w-0">
                      <span className="block font-bold text-xs truncate text-slate-100">{translateTeamName(team.name)}</span>
                      <span className="block text-[9px] text-slate-500 font-semibold">{translateRegion(team.region)}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800/80">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-6 py-3 bg-brand-primary hover:bg-brand-primary/95 text-bg-dark rounded-xl font-bold transition-all cursor-pointer shadow-lg hover:shadow-brand-primary/10"
              >
                <span>Continuar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Choose Regions */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                  ¿Qué regiones te interesan?
                </h2>
                <button
                  onClick={selectAllRegions}
                  className="text-xs text-brand-secondary font-bold hover:underline cursor-pointer"
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

            <div className="flex justify-between items-center pt-4 border-t border-slate-800/80">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 px-5 py-2.5 bg-transparent hover:bg-slate-900 border border-slate-700 text-slate-300 rounded-xl font-bold transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Atrás</span>
              </button>

              <button
                onClick={handleFinish}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-brand-primary to-brand-secondary text-bg-dark rounded-xl font-bold transition-all cursor-pointer shadow-lg hover:shadow-brand-secondary/15 hover:scale-[1.02]"
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
