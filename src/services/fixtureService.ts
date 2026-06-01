import type { Match } from '../types';
import localWorldCupData from '../data/worldCup2026/worldcup.json';
import { mapRawMatch } from './dataMapper';
import rankingService from './rankingService';

// Startup Validation Check
const EXPECTED_MATCH_COUNT = 104;
const actualCount = localWorldCupData?.matches?.length || 0;
if (actualCount !== EXPECTED_MATCH_COUNT) {
  console.warn(`[Startup Validation Warning]: Expected ${EXPECTED_MATCH_COUNT} World Cup fixtures, but found ${actualCount} matches in worldcup.json.`);
} else {
  console.log(`[Startup Validation Success]: Successfully loaded all ${EXPECTED_MATCH_COUNT} World Cup fixtures.`);
}

/**
 * Core interface representing a provider of World Cup fixture data.
 * Allows easy swapping to a future Live API or scraper.
 */
export interface FixtureProvider {
  getFixtures(): Promise<Match[]>;
}

/**
 * Provider reading from the bundled OpenFootball World Cup 2026 JSON dataset.
 */
export class OpenFootballProvider implements FixtureProvider {
  async getFixtures(): Promise<Match[]> {
    const rawData = localWorldCupData;
    const rankingsMap = await rankingService.getRankingsMap();
    const matches: Match[] = [];

    if (!rawData || !Array.isArray(rawData.matches)) {
      console.warn('[OpenFootballProvider]: worldcup.json matches array is missing or invalid.');
      return [];
    }

    for (const rawMatch of rawData.matches) {
      const match = mapRawMatch(rawMatch, rankingsMap);
      matches.push(match);
    }

    return matches;
  }
}

/**
 * Service managing fixture lifecycle and queries.
 */
export class FixtureService {
  private provider: FixtureProvider;

  constructor(provider: FixtureProvider) {
    this.provider = provider;
  }

  /**
   * Swap out the fixture provider source (e.g. for migrating to a future API).
   */
  setProvider(provider: FixtureProvider): void {
    this.provider = provider;
  }

  /**
   * Retrieves all World Cup matches from the active provider.
   */
  async getAllMatches(): Promise<Match[]> {
    try {
      return await this.provider.getFixtures();
    } catch (error) {
      console.error('Failed to retrieve matches from fixture provider', error);
      return [];
    }
  }

  /**
   * Filters matches by kickoff date (YYYY-MM-DD).
   */
  async getMatchesByDate(date: string): Promise<Match[]> {
    const matches = await this.getAllMatches();
    return matches.filter(m => m.date === date);
  }

  /**
   * Filters matches by competition stage.
   */
  async getMatchesByStage(stage: any): Promise<Match[]> {
    const matches = await this.getAllMatches();
    return matches.filter(m => m.stage === stage);
  }

  /**
   * Filters matches involving a specific national team (home or away).
   */
  async getMatchesByTeam(teamName: string): Promise<Match[]> {
    const matches = await this.getAllMatches();
    return matches.filter(m => 
      m.homeTeam.name.toLowerCase() === teamName.toLowerCase() || 
      m.awayTeam.name.toLowerCase() === teamName.toLowerCase()
    );
  }
}

// Instantiate and export service with OpenFootball as default provider
export const fixtureService = new FixtureService(new OpenFootballProvider());
export default fixtureService;
