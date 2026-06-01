export const TEAM_POPULARITY: { [teamName: string]: number } = {
  'Brazil': 100,
  'Argentina': 95,
  'France': 90,
  'England': 88,
  'Germany': 87,
  'Spain': 86,
  'Portugal': 84,
  'Italy': 82,
  'Netherlands': 80,
  'Uruguay': 78,
  'Mexico': 78,
  'USA': 76,
  'Croatia': 75,
  'Belgium': 74,
  'Morocco': 72,
  'Japan': 70,
  'Colombia': 70,
  'Canada': 68,
  'Senegal': 66,
  'South Korea': 65,
  'Ecuador': 60,
  'Nigeria': 58,
  'Australia': 55,
  'Saudi Arabia': 50
};

export const getTeamPopularity = (teamName: string): number => {
  return TEAM_POPULARITY[teamName] || 45; // Default popularity for unlisted teams
};
