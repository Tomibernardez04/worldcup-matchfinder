const TEAM_TRANSLATIONS: { [key: string]: string } = {
  // World Cup teams
  'Algeria': 'Argelia',
  'Argentina': 'Argentina',
  'Australia': 'Australia',
  'Austria': 'Austria',
  'Belgium': 'Bélgica',
  'Bosnia & Herzegovina': 'Bosnia y Herzegovina',
  'Brazil': 'Brasil',
  'Canada': 'Canadá',
  'Cape Verde': 'Cabo Verde',
  'Colombia': 'Colombia',
  'Croatia': 'Croacia',
  'Curaçao': 'Curazao',
  'Curaao': 'Curazao',
  'Czech Republic': 'República Checa',
  'DR Congo': 'RD Congo',
  'Ecuador': 'Ecuador',
  'Egypt': 'Egipto',
  'England': 'Inglaterra',
  'France': 'Francia',
  'Germany': 'Alemania',
  'Ghana': 'Ghana',
  'Haiti': 'Haití',
  'Iran': 'Irán',
  'Iraq': 'Irak',
  'Ivory Coast': 'Costa de Marfil',
  'Japan': 'Japón',
  'Jordan': 'Jordania',
  'Mexico': 'México',
  'Morocco': 'Marruecos',
  'Netherlands': 'Países Bajos',
  'New Zealand': 'Nueva Zelanda',
  'Norway': 'Noruega',
  'Panama': 'Panamá',
  'Paraguay': 'Paraguay',
  'Portugal': 'Portugal',
  'Qatar': 'Catar',
  'Saudi Arabia': 'Arabia Saudita',
  'Scotland': 'Escocia',
  'Senegal': 'Senegal',
  'South Africa': 'Sudáfrica',
  'South Korea': 'Corea del Sur',
  'Spain': 'España',
  'Sweden': 'Suecia',
  'Switzerland': 'Suiza',
  'Tunisia': 'Túnez',
  'Turkey': 'Turquía',
  'Uruguay': 'Uruguay',
  'USA': 'Estados Unidos',
  'Uzbekistan': 'Uzbekistán',

  // Playoffs/Qualifiers
  'Albania': 'Albania',
  'Bolivia': 'Bolivia',
  'Denmark': 'Dinamarca',
  'Jamaica': 'Jamaica',
  'Kosovo': 'Kosovo',
  'New Caledonia': 'Nueva Caledonia',
  'North Macedonia': 'Macedonia del Norte',
  'Northern Ireland': 'Irlanda del Norte',
  'Poland': 'Polonia',
  'Republic of Ireland': 'Irlanda',
  'Romania': 'Rumania',
  'Slovakia': 'Eslovaquia',
  'Suriname': 'Surinam',
  'Ukraine': 'Ucrania',
  'Wales': 'Gales'
};

const STAGE_TRANSLATIONS: { [key: string]: string } = {
  'Group Stage': 'Fase de Grupos',
  'Round of 32': 'Dieciseisavos de Final',
  'Round of 16': 'Octavos de Final',
  'Quarter Finals': 'Cuartos de Final',
  'Semi Finals': 'Semifinales',
  'Third Place Match': 'Tercer Puesto',
  'Final': 'Final'
};

const REGION_TRANSLATIONS: { [key: string]: string } = {
  'South America': 'Sudamérica',
  'Europe': 'Europa',
  'North America': 'Norteamérica',
  'Africa': 'África',
  'Asia': 'Asia',
  'Oceania': 'Oceanía'
};

const CATEGORY_TRANSLATIONS: { [key: string]: string } = {
  'Must Watch': 'Imperdibles',
  'Worth Watching': 'Recomendados',
  'Watch Highlights': 'Resumen'
};

/**
 * Translates English team names to Argentine Spanish.
 */
export function translateTeamName(name: string): string {
  if (!name) return '';
  const trimmed = name.trim();
  return TEAM_TRANSLATIONS[trimmed] || trimmed;
}

/**
 * Translates competition stage names to Argentine Spanish.
 */
export function translateStage(stage: string): string {
  if (!stage) return '';
  return STAGE_TRANSLATIONS[stage] || stage;
}

/**
 * Translates geographic region names to Argentine Spanish.
 */
export function translateRegion(region: string): string {
  if (!region) return '';
  return REGION_TRANSLATIONS[region] || region;
}

/**
 * Translates group names (e.g., "Group A" -> "Grupo A").
 */
export function translateGroup(group: string | null): string | null {
  if (!group) return null;
  return group.replace(/Group\s+/i, 'Grupo ');
}

/**
 * Translates recommendation categories to Argentine Spanish.
 */
export function translateCategory(category: string): string {
  if (!category) return '';
  return CATEGORY_TRANSLATIONS[category] || category;
}
