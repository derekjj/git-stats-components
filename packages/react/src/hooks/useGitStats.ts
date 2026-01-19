import { useState, useEffect, useMemo } from 'react'
import {
	fetchGitStats,
	formatLastUpdated,
	type GitStatsData,
	type DataSource,
} from '@git-stats-components/core'

export interface UseGitStatsOptions {
	dataUrl?: string
	cacheTTL?: number
	cacheKey?: string
	useStaleCache?: boolean
}

export function useGitStats(options: UseGitStatsOptions = {}) {
	const {
		dataUrl = '/data/git-stats.json',
		cacheTTL = 24 * 60 * 60 * 1000,
		cacheKey = 'git_stats_cache',
		useStaleCache = true,
	} = options

	const [data, setData] = useState<GitStatsData | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<Error | null>(null)
	const [dataSource, setDataSource] = useState<DataSource | null>(null)
	const [isDummy, setIsDummy] = useState(false)

	useEffect(() => {
		let mounted = true

		async function loadData() {
			setLoading(true)
			try {
				const result = await fetchGitStats({
					dataUrl,
					cacheTTL,
					cacheKey,
					useStaleCache,
				})

				if (mounted) {
					setData(result.data)
					setError(result.error)
					setDataSource(result.source)
					setIsDummy(result.isDummy)
				}
			} catch (err) {
				if (mounted) {
					setError(
						err instanceof Error
							? err
							: new Error('Failed to load data')
					)
				}
			} finally {
				if (mounted) {
					setLoading(false)
				}
			}
		}

		loadData()

		return () => {
			mounted = false
		}
	}, [dataUrl, cacheTTL, cacheKey, useStaleCache])

	const lastUpdatedText = useMemo(() => {
		if (!data?.lastUpdated) return ''
		return formatLastUpdated(data.lastUpdated)
	}, [data?.lastUpdated])

	const dataSourceText = useMemo(() => {
		if (isDummy) return '⚠️ Using dummy data for testing'

		switch (dataSource) {
			case 'static':
				return 'Real-time data'
			case 'cache':
				return 'Cached data'
			case 'mock':
				return 'Sample data'
			default:
				return ''
		}
	}, [dataSource, isDummy])

	return {
		data,
		loading,
		error,
		dataSource,
		dataSourceText,
		lastUpdatedText,
		isDummy,
	}
}
