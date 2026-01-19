// packages/core/src/index.ts
// Framework-agnostic core logic

// Re-export everything from types
export type {
	ColorScheme,
	ContributionDay,
	ContributionWeek,
	Profile,
	GitStatsData,
	ExperienceEntry,
	DataSource,
	Platform,
	ProfileStats,
	StatsTotals,
	StatsMetadata,
	CustomStatCalculator,
	CustomStatCalculatorParams,
} from './types/index.js'

// Export API functions
export { fetchGitStats as fetchGitStatsAPI } from './api/fetchGitStats.js'

// Export utility functions with explicit imports
export {
	generateDummyStats,
	generateDummyContributions,
	generateMultiProfileDummyStats,
	saveDummyDataToFile,
} from './utils/generateDummyData.js'

// Core data fetching (framework-agnostic)
import type { GitStatsData } from './types/index.js'

export interface FetchOptions {
	dataUrl: string
	cacheTTL?: number
	cacheKey?: string
	useStaleCache?: boolean
}

export interface DataResult<T> {
	data: T | null
	error: Error | null
	source: 'static' | 'cache' | 'mock' | 'dummy' | null
	isDummy: boolean
}

/**
 * Framework-agnostic data fetcher
 */
export async function fetchGitStats(
	options: FetchOptions
): Promise<DataResult<GitStatsData>> {
	const { dataUrl, cacheKey = 'git_stats_cache', useStaleCache = true } = options

	try {
		// Try static file first
		const response = await fetch(dataUrl)
		if (response.ok) {
			const data = await response.json()
			// Cache the data
			if (typeof window !== 'undefined') {
				localStorage.setItem(
					cacheKey,
					JSON.stringify({
						...data,
						cachedAt: Date.now(),
					})
				)
			}
			return {
				data,
				error: null,
				source: 'static',
				isDummy: data.metadata?.isDummy === true,
			}
		}
	} catch (err) {
		console.warn('Failed to fetch from static file:', err)
	}

	// Try cache
	if (useStaleCache && typeof window !== 'undefined') {
		try {
			const cached = localStorage.getItem(cacheKey)
			if (cached) {
				const data = JSON.parse(cached)
				return {
					data,
					error: null,
					source: 'cache',
					isDummy: data.metadata?.isDummy === true,
				}
			}
		} catch (err) {
			console.warn('Failed to load from cache:', err)
		}
	}

	// Fallback to mock
	const mockData = generateMockData()
	return {
		data: mockData,
		error: null,
		source: 'mock',
		isDummy: false,
	}
}

/**
 * Format last updated time
 */
export function formatLastUpdated(dateString: string): string {
	const date = new Date(dateString)
	const now = new Date()
	const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

	if (diffHours < 1) return 'just now'
	if (diffHours < 24) return `${diffHours} hours ago`

	const diffDays = Math.floor(diffHours / 24)
	if (diffDays === 1) return 'yesterday'
	if (diffDays < 7) return `${diffDays} days ago`

	return date.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
	})
}

/**
 * Get contribution level (0-4)
 */
export function getContributionLevel(count: number): number {
	if (count === 0) return 0
	if (count <= 3) return 1
	if (count <= 6) return 2
	if (count <= 9) return 3
	return 4
}

/**
 * Calculate years of experience
 */
export function calculateYearsExperience(
	experienceData: { startDate: string; endDate: string | null; skills?: string[] }[]
): number {
	if (experienceData.length === 0) return 0

	const skillExperience: Record<string, number> = {}

	experienceData.forEach((exp) => {
		const end = exp.endDate ? new Date(exp.endDate) : new Date()
		const start = new Date(exp.startDate)
		const years = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25)

		exp.skills?.forEach((skill) => {
			if (!skillExperience[skill]) {
				skillExperience[skill] = 0
			}
			skillExperience[skill] += years
		})
	})

	return Math.max(...Object.values(skillExperience), 0)
}

// Mock data generator
function generateMockData(): GitStatsData {
	return {
		lastUpdated: new Date().toISOString(),
		profiles: [
			{
				username: 'mockuser',
				platform: 'github',
				stats: {
					projectCount: 30,
					commitCount: 2500,
					contributions: [],
				},
			},
		],
		totals: {
			projectCount: 30,
			commitCount: 2500,
		},
		metadata: {
			source: 'mock',
			fetchedAt: Date.now(),
		},
	}
}