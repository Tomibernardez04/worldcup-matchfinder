export const FIFA_TO_ISO: { [code: string]: string } = {
  ARG: 'ar',
  BRA: 'br',
  FRA: 'fr',
  ESP: 'es',
  GER: 'de',
  ENG: 'gb-eng',
  POR: 'pt',
  URU: 'uy',
  MEX: 'mx',
  USA: 'us',
  CAN: 'ca',
  ITA: 'it',
  NED: 'nl',
  CRO: 'hr',
  BEL: 'be',
  MAR: 'ma',
  SEN: 'sn',
  JPN: 'jp',
  KOR: 'kr',
  AUS: 'au',
  COL: 'co',
  ECU: 'ec',
  NGA: 'ng',
  KSA: 'sa',
  
  // Additional teams from World Cup 2026 dataset
  RSA: 'za',      // South Africa
  CZE: 'cz',      // Czech Republic
  BIH: 'ba',      // Bosnia & Herzegovina
  QAT: 'qa',      // Qatar
  SUI: 'ch',      // Switzerland
  HAI: 'ht',      // Haiti
  SCO: 'gb-sct',  // Scotland
  PAR: 'py',      // Paraguay
  TUR: 'tr',      // Turkey
  CUW: 'cw',      // Curaçao
  CIV: 'ci',      // Ivory Coast
  SWE: 'se',      // Sweden
  TUN: 'tn',      // Tunisia
  EGY: 'eg',      // Egypt
  IRN: 'ir',      // Iran
  NZL: 'nz',      // New Zealand
  CPV: 'cv',      // Cape Verde
  IRQ: 'iq',      // Iraq
  NOR: 'no',      // Norway
  ALG: 'dz',      // Algeria
  AUT: 'at',      // Austria
  JOR: 'jo',      // Jordan
  COD: 'cd',      // DR Congo
  UZB: 'uz',      // Uzbekistan
  GHA: 'gh',      // Ghana
  PAN: 'pa'       // Panama
};

/**
 * Returns the Flagcdn image URL for a given FIFA country code.
 * @param code 3-letter FIFA code (e.g. ARG, BRA)
 * @param width Requested width of the image in pixels (e.g. 40, 80, 120)
 */
export const getFlagUrl = (code: string, width: number = 40): string => {
  const iso = FIFA_TO_ISO[code.toUpperCase()];
  
  // Coerce width to the closest larger supported Flagcdn width: 20, 40, 80, 160, 320, 640
  let targetWidth = 40;
  if (width <= 20) {
    targetWidth = 20;
  } else if (width <= 40) {
    targetWidth = 40;
  } else if (width <= 80) {
    targetWidth = 80;
  } else if (width <= 160) {
    targetWidth = 160;
  } else if (width <= 320) {
    targetWidth = 320;
  } else {
    targetWidth = 640;
  }

  if (!iso) return `https://flagcdn.com/w${targetWidth}/un.png`;
  return `https://flagcdn.com/w${targetWidth}/${iso}.png`;
};
