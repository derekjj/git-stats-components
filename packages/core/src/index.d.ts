export type { ColorScheme, ContributionDay, ContributionWeek, Profile, GitStatsData, ExperienceEntry, DataSource, Platform, ProfileStats, StatsTotals, StatsMetadata, CustomStatCalculator, CustomStatCalculatorParams, } from './types/index.js';
export { fetchGitStats as fetchGitStatsAPI } from './api/fetchGitStats.js';
export { generateDummyStats, generateDummyContributions, generateMultiProfileDummyStats, saveDummyDataToFile, } from './utils/generateDummyData.js';
import type { GitStatsData } from './types/index.js';
export interface FetchOptions {
    dataUrl: string;
    cacheTTL?: number;
    cacheKey?: string;
    useStaleCache?: boolean;
}
export interface DataResult<T> {
    data: T | null;
    error: Error | null;
    source: 'static' | 'cache' | 'mock' | 'dummy' | null;
    isDummy: boolean;
}
/**
 * Framework-agnostic data fetcher
 */
export declare function fetchGitStats(options: FetchOptions): Promise<DataResult<GitStatsData>>;
/**
 * Format last updated time
 */
export declare function formatLastUpdated(dateString: string): string;
/**
 * Get contribution level (0-4)
 */
export declare function getContributionLevel(count: number): number;
/**
 * Calculate years of experience
 */
export declare function calculateYearsExperience(experienceData: {
    startDate: string;
    endDate: string | null;
    skills?: string[];
}[]): number;
