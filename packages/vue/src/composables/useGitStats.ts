import { ref, computed, getCurrentInstance, onMounted } from 'vue'
import {
	fetchGitStats,
	formatLastUpdated,
	type GitStatsData,
	type DataSource,
} from '@git-stats-components/core'

export interface UseGitStatsConfig {
	dataUrl?: string
	cacheTTL?: number
	useStaleCache?: boolean
	cacheKey?: string
}

export function useGitStats(config: UseGitStatsConfig = {}) {
	const {
		dataUrl = '/data/git-stats.json',
		cacheTTL = 24 * 60 * 60 * 1000,
		useStaleCache = true,
		cacheKey = 'git_stats_cache',
	} = config

	// Starts true so server-rendered HTML shows the loading state, which also
	// matches the browser's first render before data arrives
	const loading = ref(true)
	const error = ref<Error | null>(null)
	const data = ref<GitStatsData | null>(null)
	const dataSource = ref<DataSource | null>(null)
	const isDummy = ref(false)

	/**
	 * Load data with fallback strategy
	 */
	async function loadData(): Promise<GitStatsData | null> {
		loading.value = true
		error.value = null

		try {
			const result = await fetchGitStats({
				dataUrl,
				cacheTTL,
				cacheKey,
				useStaleCache,
			})

			data.value = result.data
			error.value = result.error
			dataSource.value = result.source
			isDummy.value = result.isDummy

			return result.data
		} catch (err) {
			error.value =
				err instanceof Error ? err : new Error('Failed to load data')
			return null
		} finally {
			loading.value = false
		}
	}

	/**
	 * Format "last updated" text
	 */
	const lastUpdatedText = computed(() => {
		if (!data.value?.lastUpdated) return ''
		return formatLastUpdated(data.value.lastUpdated)
	})

	/**
	 * Computed data source display text
	 */
	const dataSourceText = computed(() => {
		if (isDummy.value) {
			return '⚠️ Using dummy data for testing'
		}

		switch (dataSource.value) {
			case 'static':
				return 'Real-time data'
			case 'cache':
				return 'Cached data'
			case 'mock':
				return 'Sample data'
			default:
				return ''
		}
	})

	// Load in the browser only. On the server a relative dataUrl can't be
	// fetched, and rendering fallback data there would flash wrong numbers.
	// Inside a component wait for mount so hydration matches the server HTML.
	if (typeof window !== 'undefined') {
		if (getCurrentInstance()) onMounted(loadData)
		else loadData()
	}

	return {
		data,
		loading,
		error,
		dataSource,
		dataSourceText,
		lastUpdatedText,
		isDummy,
		loadData,
	}
}
