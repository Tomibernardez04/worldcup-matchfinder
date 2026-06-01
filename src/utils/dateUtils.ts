import type { Match } from '../types';

/**
 * Parses match date and time (with UTC-X or CET offsets) to a JavaScript Date object.
 */
export function parseMatchDateTime(dateStr: string, timeStr: string): Date {
  const parts = timeStr.split(' ');
  const timeOnly = parts[0]; // "13:00"
  const tz = parts.slice(1).join(' '); // "UTC-6", "CET", etc.
  
  let offset = 'Z'; // Default to UTC
  if (tz === 'UTC-6') offset = '-06:00';
  else if (tz === 'UTC-5') offset = '-05:00';
  else if (tz === 'UTC-4') offset = '-04:00';
  else if (tz === 'UTC-7') offset = '-07:00';
  else if (tz === 'CET') offset = '+01:00';
  else if (tz === 'CEST') offset = '+02:00';
  
  return new Date(`${dateStr}T${timeOnly}${offset}`);
}

/**
 * Formats a Date object in Argentine format: "jue 11 de jun" or "11/06/2026"
 */
export function formatMatchDate(date: Date): string {
  const dFormatter = new Intl.DateTimeFormat('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
  const formatted = dFormatter.format(date);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

/**
 * Formats a Date object to Argentine time format: "21:00 hs"
 */
export function formatMatchTime(date: Date): string {
  const tFormatter = new Intl.DateTimeFormat('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  return `${tFormatter.format(date)} hs`;
}

/**
 * Formats a Date object to long Argentine format: "11 de junio de 2026"
 */
export function formatMatchDateLong(date: Date): string {
  const dFormatter = new Intl.DateTimeFormat('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  return dFormatter.format(date);
}

/**
 * Helper to get a chronological timestamp of a match.
 */
export function getMatchTimestamp(m: Match): number {
  try {
    return parseMatchDateTime(m.date, m.time).getTime();
  } catch {
    return Number.MAX_SAFE_INTEGER;
  }
}
