import type { Ref, ComputedRef } from 'vue'
import type { GitStatsData, DataSource } from '@git-stats-components/core'

export interface UseGitStatsReturn {
	data: Ref<GitStatsData | null>
	loading: Ref<boolean>
	error: Ref<Error | null>
	dataSource: Ref<DataSource | null>
	dataSourceText: ComputedRef<string>
	lastUpdatedText: ComputedRef<string>
	isDummy: Ref<boolean>
	loadData: () => Promise<GitStatsData | null>
	cacheData: (data: GitStatsData) => void
}
