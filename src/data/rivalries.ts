import type { Rivalry } from '../types';

export const RIVALRIES: Rivalry[] = [
  {
    teams: ['Argentina', 'Brazil'],
    description: 'Superclásico de las Américas: una de las rivalidades internacionales más intensas de la historia del fútbol.',
    bonus: 30
  },
  {
    teams: ['England', 'Germany'],
    description: 'Un choque histórico de gigantes que se remonta a 1966. Emoción y drama siempre garantizados.',
    bonus: 25
  },
  {
    teams: ['England', 'France'],
    description: 'Una rivalidad tradicional a través del Canal de la Mancha que despierta un orgullo enorme.',
    bonus: 20
  },
  {
    teams: ['Portugal', 'Spain'],
    description: 'El Derbi Ibérico: dos vecinos con planteles de clase mundial cara a cara.',
    bonus: 22
  },
  {
    teams: ['Argentina', 'Uruguay'],
    description: 'Clásico del Río de la Plata: el enfrentamiento internacional más antiguo fuera de las Islas Británicas.',
    bonus: 22
  },
  {
    teams: ['Brazil', 'Uruguay'],
    description: 'Rivalidad histórica revivida, famosa por el Maracanazo de 1950.',
    bonus: 20
  },
  {
    teams: ['Mexico', 'USA'],
    description: 'El Clásico de la CONCACAF: una intensa batalla por el dominio continental.',
    bonus: 25
  },
  {
    teams: ['Germany', 'Netherlands'],
    description: 'Una de las rivalidades clásicas de Europa, llena de historia y cruces picantes.',
    bonus: 20
  },
  {
    teams: ['Croatia', 'Italy'],
    description: 'Vecinos del Mediterráneo luchando por la supremacía; partidos siempre muy cerrados.',
    bonus: 15
  }
];

export const getRivalry = (teamA: string, teamB: string): Rivalry | null => {
  const sorted = [teamA, teamB].sort();
  return RIVALRIES.find(r => r.teams[0] === sorted[0] && r.teams[1] === sorted[1]) || null;
};
