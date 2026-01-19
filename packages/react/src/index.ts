// Main entry point for @git-stats-components/react

// Re-export everything from core
export * from '@git-stats-components/core'

// Export React-specific components and hooks
export { ContributionGraph } from './components/ContributionGraph'
export { StatsBreakdown } from './components/StatsBreakdown'
export { useGitStats } from './hooks/useGitStats'

// Export types
export type { ContributionGraphProps } from './components/ContributionGraph'
export type { StatsBreakdownProps } from './components/StatsBreakdown'
export type { UseGitStatsOptions } from './hooks/useGitStats'

// Auto-import styles
import './components/styles.css'
