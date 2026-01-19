// Main entry point for git-stats-components

import type { App } from 'vue'
import ContributionGraph from './components/ContributionGraph.vue'
import StatsBreakdown from './components/StatsBreakdown.vue'
import { useGitStats } from './composables/useGitStats'

// Re-export everything from core
export * from '@git-stats-components/core'

// Export Vue-specific components and composables
export { ContributionGraph, StatsBreakdown, useGitStats }

// Auto-import styles
import './styles/index.css'

// Plugin for Vue.use()
export interface VueGitStatsPlugin {
	install: (app: App) => void
}

const VueGitStats: VueGitStatsPlugin = {
	install(app: App) {
		app.component('ContributionGraph', ContributionGraph)
		app.component('StatsBreakdown', StatsBreakdown)
	},
}

// Export as default for Vue.use()
export default VueGitStats
