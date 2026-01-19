import type { GitStatsData } from '../types'

export async function fetchGitStats(url: string): Promise<GitStatsData> {
	const response = await fetch(url)
	if (!response.ok) {
		throw new Error(`Failed to fetch git stats: ${response.statusText}`)
	}
	return response.json()
}
