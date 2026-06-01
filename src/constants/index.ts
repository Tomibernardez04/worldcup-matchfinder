import type { Region, CompetitionStage } from '../types';

export const REGIONS: Region[] = [
  'South America',
  'Europe',
  'North America',
  'Africa',
  'Asia',
  'Oceania'
];

export const COMPETITION_STAGES: CompetitionStage[] = [
  'Group Stage',
  'Round of 32',
  'Round of 16',
  'Quarter Finals',
  'Semi Finals',
  'Third Place Match',
  'Final'
];

export interface TeamOption {
  name: string;
  code: string;
  region: Region;
  flag: string;
}

export const SUPPORTED_TEAMS: TeamOption[] = [
  { name: 'Argentina', code: 'ARG', region: 'South America', flag: '🇦🇷' },
  { name: 'Brazil', code: 'BRA', region: 'South America', flag: '🇧🇷' },
  { name: 'France', code: 'FRA', region: 'Europe', flag: '🇫🇷' },
  { name: 'Spain', code: 'ESP', region: 'Europe', flag: '🇪🇸' },
  { name: 'Germany', code: 'GER', region: 'Europe', flag: '🇩🇪' },
  { name: 'England', code: 'ENG', region: 'Europe', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Portugal', code: 'POR', region: 'Europe', flag: '🇵🇹' },
  { name: 'Uruguay', code: 'URU', region: 'South America', flag: '🇺🇾' },
  { name: 'Mexico', code: 'MEX', region: 'North America', flag: '🇲🇽' },
  { name: 'USA', code: 'USA', region: 'North America', flag: '🇺🇸' },
  { name: 'Canada', code: 'CAN', region: 'North America', flag: '🇨🇦' },
  { name: 'Italy', code: 'ITA', region: 'Europe', flag: '🇮🇹' },
  { name: 'Netherlands', code: 'NED', region: 'Europe', flag: '🇳🇱' },
  { name: 'Croatia', code: 'CRO', region: 'Europe', flag: '🇭🇷' },
  { name: 'Belgium', code: 'BEL', region: 'Europe', flag: '🇧🇪' },
  { name: 'Morocco', code: 'MAR', region: 'Africa', flag: '🇲🇦' },
  { name: 'Senegal', code: 'SEN', region: 'Africa', flag: '🇸🇳' },
  { name: 'Japan', code: 'JPN', region: 'Asia', flag: '🇯🇵' },
  { name: 'South Korea', code: 'KOR', region: 'Asia', flag: '🇰🇷' },
  { name: 'Australia', code: 'AUS', region: 'Oceania', flag: '🇦🇺' },
  { name: 'Colombia', code: 'COL', region: 'South America', flag: '🇨🇴' },
  { name: 'Ecuador', code: 'ECU', region: 'South America', flag: '🇪🇨' },
  { name: 'Nigeria', code: 'NGA', region: 'Africa', flag: '🇳🇬' },
  { name: 'Saudi Arabia', code: 'KSA', region: 'Asia', flag: '🇸🇦' }
];
