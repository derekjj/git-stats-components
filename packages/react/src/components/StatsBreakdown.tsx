import React, { useMemo, useEffect, useState } from 'react'
import { useGitStats } from '../hooks/useGitStats'
import {
	calculateYearsExperience,
	type ExperienceEntry,
	type CustomStatCalculator,
	type CustomStatCalculatorParams,
} from '@git-stats-components/core'
import './StatsBreakdown.css'

export interface StatsBreakdownProps {
	dataUrl?: string
	profileIndexes?: number[]
	experienceData?: ExperienceEntry[]
	showCustomStat?: boolean
	customStatCalculator?: CustomStatCalculator | null
	cacheTTL?: number
	children?: React.ReactNode
}

export const StatsBreakdown: React.FC<StatsBreakdownProps> = ({
	dataUrl = '/data/git-stats.json',
	profileIndexes = [],
	experienceData = [],
	showCustomStat = true,
	customStatCalculator = null,
	cacheTTL,
	children,
}) => {
	const { data, loading, dataSourceText, lastUpdatedText } = useGitStats({
		dataUrl,
		cacheTTL,
	})

	const [totalProjects, setTotalProjects] = useState(0)
	const [totalCommits, setTotalCommits] = useState(0)

	useEffect(() => {
		if (!data) return

		if (profileIndexes.length > 0) {
			let projects = 0
			let commits = 0

			profileIndexes.forEach((index) => {
				const profile = data.profiles?.[index]
				if (profile?.stats) {
					projects += profile.stats.projectCount || 0
					commits += profile.stats.commitCount || 0
				}
			})

			setTotalProjects(projects)
			setTotalCommits(commits)
		} else {
			setTotalProjects(data.totals?.projectCount || 0)
			setTotalCommits(data.totals?.commitCount || 0)
		}
	}, [data, profileIndexes])

	const yearsExperience = useMemo(() => {
		const years = calculateYearsExperience(experienceData)
		return years.toFixed(1)
	}, [experienceData])

	const customStatValue = useMemo(() => {
		if (customStatCalculator) {
			const params: CustomStatCalculatorParams = {
				projects: totalProjects,
				commits: totalCommits,
				years: parseFloat(yearsExperience),
			}
			return customStatCalculator(params)
		}

		// Default coffee calculation
		const kA = 1.5
		const kB = 1.2
		const kC = 1.5

		const cups =
			totalProjects * kA +
			totalCommits * kB +
			parseFloat(yearsExperience) * kC

		return cups.toFixed(2)
	}, [totalProjects, totalCommits, yearsExperience, customStatCalculator])

	return (
		<div className="git-stats-breakdown">
			<div className="stats-grid">
				{/* Years Experience */}
				<div className="stat-card">
					<div className="stat-icon">⏱️</div>
					<div className="stat-content">
						<div className="stat-value">{yearsExperience}</div>
						<div className="stat-label">Years Experience</div>
					</div>
				</div>

				{/* Projects */}
				<div className="stat-card">
					<div className="stat-icon">📦</div>
					<div className="stat-content">
						{loading ? (
							<div className="stat-loading">
								<div className="spinner"></div>
							</div>
						) : (
							<div className="stat-value">{totalProjects}</div>
						)}
						<div className="stat-label">Projects</div>
					</div>
				</div>

				{/* Commits */}
				<div className="stat-card">
					<div className="stat-icon">💻</div>
					<div className="stat-content">
						{loading ? (
							<div className="stat-loading">
								<div className="spinner"></div>
							</div>
						) : (
							<div className="stat-value">{totalCommits}</div>
						)}
						<div className="stat-label">Commits</div>
					</div>
				</div>

				{/* Custom Stat */}
				{showCustomStat && (
					<div className="stat-card">
						<div className="stat-icon">☕</div>
						<div className="stat-content">
							{loading ? (
								<div className="stat-loading">
									<div className="spinner"></div>
								</div>
							) : (
								<div className="stat-value">
									{customStatValue}
								</div>
							)}
							<div className="stat-label">Coffee Consumed</div>
						</div>
					</div>
				)}
			</div>

			{/* Footer */}
			<div className="stats-footer">
				{dataSourceText && (
					<small className="data-source">
						{dataSourceText}
						{lastUpdatedText && ` · ${lastUpdatedText}`}
					</small>
				)}
			</div>

			{children}
		</div>
	)
}
