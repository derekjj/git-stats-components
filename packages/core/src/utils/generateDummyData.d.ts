/**
 * Generate realistic dummy data for testing and development
 */
import type { ContributionWeek, GitStatsData, DummyStatsOptions } from '../types';
/**
 * Generate dummy contribution data (53 weeks)
 */
export declare function generateDummyContributions(): ContributionWeek[];
/**
 * Generate complete dummy stats data
 */
export declare function generateDummyStats(options?: DummyStatsOptions): GitStatsData;
/**
 * Generate multiple profiles dummy data
 */
export declare function generateMultiProfileDummyStats(): GitStatsData;
/**
 * Save dummy data to a file (for testing)
 */
export declare function saveDummyDataToFile(filepath?: string): void;
