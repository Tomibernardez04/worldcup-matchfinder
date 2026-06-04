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
  { name: 'Mexico', code: 'MEX', region: 'North America', flag: '🇲🇽' },
  { name: 'South Africa', code: 'RSA', region: 'Africa', flag: '🇿🇦' },
  { name: 'South Korea', code: 'KOR', region: 'Asia', flag: '🇰🇷' },
  { name: 'Czech Republic', code: 'CZE', region: 'Europe', flag: '🇨🇿' },
  { name: 'Canada', code: 'CAN', region: 'North America', flag: '🇨🇦' },
  { name: 'Bosnia & Herzegovina', code: 'BIH', region: 'Europe', flag: '🇧🇦' },
  { name: 'Qatar', code: 'QAT', region: 'Asia', flag: '🇶🇦' },
  { name: 'Switzerland', code: 'SUI', region: 'Europe', flag: '🇨🇭' },
  { name: 'Brazil', code: 'BRA', region: 'South America', flag: '🇧🇷' },
  { name: 'Morocco', code: 'MAR', region: 'Africa', flag: '🇲🇦' },
  { name: 'Haiti', code: 'HAI', region: 'North America', flag: '🇭🇹' },
  { name: 'Scotland', code: 'SCO', region: 'Europe', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  { name: 'USA', code: 'USA', region: 'North America', flag: '🇺🇸' },
  { name: 'Paraguay', code: 'PAR', region: 'South America', flag: '🇵🇾' },
  { name: 'Australia', code: 'AUS', region: 'Oceania', flag: '🇦🇺' },
  { name: 'Turkey', code: 'TUR', region: 'Europe', flag: '🇹🇷' },
  { name: 'Germany', code: 'GER', region: 'Europe', flag: '🇩🇪' },
  { name: 'Curaçao', code: 'CUW', region: 'North America', flag: '🇨🇼' },
  { name: 'Ivory Coast', code: 'CIV', region: 'Africa', flag: '🇨🇮' },
  { name: 'Ecuador', code: 'ECU', region: 'South America', flag: '🇪🇨' },
  { name: 'Netherlands', code: 'NED', region: 'Europe', flag: '🇳🇱' },
  { name: 'Japan', code: 'JPN', region: 'Asia', flag: '🇯🇵' },
  { name: 'Sweden', code: 'SWE', region: 'Europe', flag: '🇸🇪' },
  { name: 'Tunisia', code: 'TUN', region: 'Africa', flag: '🇹🇳' },
  { name: 'Belgium', code: 'BEL', region: 'Europe', flag: '🇧🇪' },
  { name: 'Egypt', code: 'EGY', region: 'Africa', flag: '🇪🇬' },
  { name: 'Iran', code: 'IRN', region: 'Asia', flag: '🇮🇷' },
  { name: 'New Zealand', code: 'NZL', region: 'Oceania', flag: '🇳🇿' },
  { name: 'Spain', code: 'ESP', region: 'Europe', flag: '🇪🇸' },
  { name: 'Cape Verde', code: 'CPV', region: 'Africa', flag: '🇨🇻' },
  { name: 'Saudi Arabia', code: 'KSA', region: 'Asia', flag: '🇸🇦' },
  { name: 'Uruguay', code: 'URU', region: 'South America', flag: '🇺🇾' },
  { name: 'France', code: 'FRA', region: 'Europe', flag: '🇫🇷' },
  { name: 'Senegal', code: 'SEN', region: 'Africa', flag: '🇸🇳' },
  { name: 'Iraq', code: 'IRQ', region: 'Asia', flag: '🇮🇶' },
  { name: 'Norway', code: 'NOR', region: 'Europe', flag: '🇳🇴' },
  { name: 'Argentina', code: 'ARG', region: 'South America', flag: '🇦🇷' },
  { name: 'Algeria', code: 'ALG', region: 'Africa', flag: '🇩🇿' },
  { name: 'Austria', code: 'AUT', region: 'Europe', flag: '🇦🇹' },
  { name: 'Jordan', code: 'JOR', region: 'Asia', flag: '🇯🇴' },
  { name: 'Portugal', code: 'POR', region: 'Europe', flag: '🇵🇹' },
  { name: 'DR Congo', code: 'COD', region: 'Africa', flag: '🇨🇩' },
  { name: 'Uzbekistan', code: 'UZB', region: 'Asia', flag: '🇺🇿' },
  { name: 'Colombia', code: 'COL', region: 'South America', flag: '🇨🇴' },
  { name: 'England', code: 'ENG', region: 'Europe', flag: 'ENG' },
  { name: 'Croatia', code: 'CRO', region: 'Europe', flag: '🇭🇷' },
  { name: 'Ghana', code: 'GHA', region: 'Africa', flag: '🇬🇭' },
  { name: 'Panama', code: 'PAN', region: 'North America', flag: '🇵🇦' }
];
