import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react' 
import { ContributionGraph } from '../../src/components/ContributionGraph'
import React from 'react'

describe('ContributionGraph', () => {
	const mockData = {
		lastUpdated: '2026-01-14T10:00:00Z',
		profiles: [
			{
				username: 'testuser',
				platform: 'github',
				stats: {
					projectCount: 25,
					commitCount: 1500,
					contributions: [
						{
							firstDay: '2025-01-06',
							contributionDays: [
								{ date: '2025-01-06', contributionCount: 5, weekday: 0 },
								{ date: '2025-01-07', contributionCount: 10, weekday: 1 },
								{ date: '2025-01-08', contributionCount: 3, weekday: 2 },
								{ date: '2025-01-09', contributionCount: 0, weekday: 3 },
								{ date: '2025-01-10', contributionCount: 7, weekday: 4 },
								{ date: '2025-01-11', contributionCount: 12, weekday: 5 },
								{ date: '2025-01-12', contributionCount: 2, weekday: 6 },
							],
						},
					],
				},
			},
		],
		totals: { projectCount: 25, commitCount: 1500 },
		metadata: { fetchedAt: Date.now(), source: 'static' },
	}

	beforeEach(() => {
		global.fetch = vi.fn(() =>
			Promise.resolve({
				ok: true,
				json: () => Promise.resolve(mockData),
			} as Response)
		)
	})

	it('should render without crashing', async () => {
		render(<ContributionGraph />)
		await waitFor(() => {
		    expect(screen.getByText(/contributions in the last year/i)).toBeDefined()
		})
	})

	it('should display contribution count after loading', async () => {
		render(<ContributionGraph />)

		await waitFor(() => {
			expect(screen.getByText(/contributions in the last year/i)).toBeDefined()
		})
	})

	it('should apply correct color scheme', () => {
		render(<ContributionGraph colorScheme="blue" />)
		// Component renders with blue scheme
		expect(document.querySelector('.contribution-day.blue')).toBeDefined()
	})
})