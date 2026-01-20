<template>
	<div class="git-stats-breakdown">
		<div class="stats-grid">
			<!-- Years Experience -->
			<div class="stat-card">
				<div class="stat-icon">
					<slot name="icon-experience">⏱️</slot>
				</div>
				<div class="stat-content">
					<div class="stat-value">{{ yearsExperience }}</div>
					<div class="stat-label">Years Experience</div>
				</div>
			</div>

			<!-- Projects -->
			<div class="stat-card">
				<div class="stat-icon">
					<slot name="icon-projects">📦</slot>
				</div>
				<div class="stat-content">
					<div v-if="loading" class="stat-loading">
						<div class="spinner"></div>
					</div>
					<div v-else class="stat-value">{{ totalProjects }}</div>
					<div class="stat-label">Projects</div>
				</div>
			</div>

			<!-- Commits -->
			<div class="stat-card">
				<div class="stat-icon">
					<slot name="icon-commits">💻</slot>
				</div>
				<div class="stat-content">
					<div v-if="loading" class="stat-loading">
						<div class="spinner"></div>
					</div>
					<div v-else class="stat-value">{{ totalCommits }}</div>
					<div class="stat-label">Commits</div>
				</div>
			</div>

			<!-- Custom Stat -->
			<div class="stat-card" v-if="showCustomStat">
				<div class="stat-icon">
					<slot name="icon-custom">☕</slot>
				</div>
				<div class="stat-content">
					<div v-if="loading" class="stat-loading">
						<div class="spinner"></div>
					</div>
					<div v-else class="stat-value">{{ customStatValue }}</div>
					<div class="stat-label">
						<slot name="custom-stat-label">Coffee Consumed</slot>
					</div>
				</div>
			</div>
		</div>

		<!-- Footer -->
		<div class="stats-footer">
			<small v-if="dataSourceText" class="data-source">
				{{ dataSourceText }}
				<span v-if="lastUpdatedText"> · {{ lastUpdatedText }}</span>
			</small>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useGitStats } from '../composables/useGitStats'
import {
	calculateYearsExperience,
	type ExperienceEntry,
	type CustomStatCalculator,
	type CustomStatCalculatorParams,
} from '@git-stats-components/core'

interface Props {
	dataUrl?: string
	profileIndexes?: number[]
	experienceData?: ExperienceEntry[]
	showCustomStat?: boolean
	customStatCalculator?: CustomStatCalculator | null
	cacheTTL?: number
}

const props = withDefaults(defineProps<Props>(), {
	dataUrl: '/data/git-stats.json',
	profileIndexes: () => [],
	experienceData: () => [],
	showCustomStat: true,
	customStatCalculator: null,
	cacheTTL: 24 * 60 * 60 * 1000,
})

// Use the shared composable
const { data, loading, dataSourceText, lastUpdatedText } = useGitStats({
	dataUrl: props.dataUrl,
	cacheTTL: props.cacheTTL,
})

const totalProjects = ref(0)
const totalCommits = ref(0)

// Calculate totals when data loads
watch(
	data,
	(newData) => {
		if (!newData) return

		// If profileIndexes specified, sum only those profiles
		if (props.profileIndexes.length > 0) {
			let projects = 0
			let commits = 0

			props.profileIndexes.forEach((index) => {
				const profile = newData.profiles?.[index]
				if (profile?.stats) {
					projects += profile.stats.projectCount || 0
					commits += profile.stats.commitCount || 0
				}
			})

			totalProjects.value = projects
			totalCommits.value = commits
		} else {
			// Use totals from data (aggregates all profiles)
			totalProjects.value = newData.totals?.projectCount || 0
			totalCommits.value = newData.totals?.commitCount || 0
		}
	},
	{ immediate: true }
)

// Calculate years of experience using core utility
const yearsExperience = computed(() => {
	const years = calculateYearsExperience(props.experienceData)
	return years.toFixed(1)
})

// Custom stat calculation
const customStatValue = computed(() => {
	if (props.customStatCalculator) {
		const params: CustomStatCalculatorParams = {
			projects: totalProjects.value,
			commits: totalCommits.value,
			years: parseFloat(yearsExperience.value),
		}
		return props.customStatCalculator(params)
	}

	// Default: fun coffee calculation
	const kA = 1.5
	const kB = 1.2
	const kC = 1.5

	const cups =
		totalProjects.value * kA +
		totalCommits.value * kB +
		parseFloat(yearsExperience.value) * kC

	return cups.toFixed(2)
})
</script>

<style scoped>
.git-stats-breakdown {
	font-family:
		-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica,
		Arial, sans-serif;
	padding: 40px 20px;
	max-width: 1200px;
	margin: 0 auto;
}

.stats-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr); /* Always 4 columns on desktop */
	gap: 24px;
	margin-bottom: 24px;
}

.stat-card {
	display: flex;
	align-items: center;
	gap: 16px;
	padding: 24px;
	background: rgba(255, 255, 255, 0.05);
	border-radius: 12px;
	border: 1px solid rgba(255, 255, 255, 0.1);
	transition: all 0.3s ease;
}

.stat-card:hover {
	background: rgba(255, 255, 255, 0.08);
	border-color: rgba(255, 255, 255, 0.2);
	transform: translateY(-2px);
}

.stat-icon {
	font-size: 48px;
	line-height: 1;
	opacity: 0.9;
	flex-shrink: 0;
}

.stat-content {
	flex: 1;
	min-width: 0;
}

.stat-value {
	font-size: 32px;
	font-weight: bold;
	line-height: 1.2;
	color: #e6edf3;
	margin-bottom: 4px;
}

.stat-label {
	font-size: 14px;
	color: #7d8590;
	text-transform: uppercase;
	letter-spacing: 0.5px;
}

.stat-loading {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 38px;
}

.spinner {
	width: 24px;
	height: 24px;
	border: 3px solid rgba(255, 255, 255, 0.1);
	border-top-color: #58a6ff;
	border-radius: 50%;
	animation: spin 1s linear infinite;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

.stats-footer {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
	padding-top: 16px;
	border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.data-source {
	font-size: 12px;
	color: #7d8590;
	text-align: center;
}

/* Responsive */
@media (max-width: 1400px) {
	.git-stats-breakdown {
		padding: 20px 12px;
	}
	.stats-grid {
		grid-template-columns: repeat(2, 1fr); /* 2 columns on tablets */
		gap: 16px;
	}
	.stat-card {
		padding: 16px;
	}
	.stat-icon {
		font-size: 36px;
	}
	.stat-value {
		font-size: 24px;
	}
	.stat-label {
		font-size: 12px;
	}
}

@media (max-width: 480px) {
	.stats-grid {
		grid-template-columns: 1fr; /* 1 column on mobile */
	}
	.stat-card {
		flex-direction: column;
		text-align: center;
	}
	.stat-content {
		width: 100%;
	}
}
</style>
