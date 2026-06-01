import localRankings from '../data/rankings.json';

/**
 * Interface representing a source of FIFA rankings.
 */
export interface RankingProvider {
  getRank(teamName: string): Promise<number>;
  getRankingsMap(): Promise<{ [teamName: string]: number }>;
}

/**
 * A ranking provider that reads rankings from local JSON database.
 */
export class LocalJsonRankingProvider implements RankingProvider {
  async getRank(teamName: string): Promise<number> {
    const rankings = localRankings as { [key: string]: number };
    return rankings[teamName] || 60; // default rank for other teams
  }

  async getRankingsMap(): Promise<{ [teamName: string]: number }> {
    return localRankings as { [teamName: string]: number };
  }
}

/**
 * Service managing ranking retrieval across the application.
 */
export class RankingService {
  private provider: RankingProvider;

  constructor(provider: RankingProvider) {
    this.provider = provider;
  }

  setProvider(provider: RankingProvider): void {
    this.provider = provider;
  }

  async getRanking(teamName: string): Promise<number> {
    try {
      return await this.provider.getRank(teamName);
    } catch {
      return this.getDefaultRank();
    }
  }

  async getRankingsMap(): Promise<{ [teamName: string]: number }> {
    try {
      return await this.provider.getRankingsMap();
    } catch {
      return localRankings as { [teamName: string]: number };
    }
  }

  getDefaultRank(): number {
    return 60;
  }
}

export const rankingService = new RankingService(new LocalJsonRankingProvider());
export default rankingService;
