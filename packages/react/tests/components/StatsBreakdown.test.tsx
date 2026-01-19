import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { StatsBreakdown } from '../../src/components/StatsBreakdown'
import React from 'react'

describe('StatsBreakdown', () => {
	const mockData = {
		lastUpdated: '2026-01-14T10:00:00Z',
		profiles: [
			{
				username: 'testuser',
				platform: 'github',
				stats: { projectCount: 25, commitCount: 1500 },
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

	it('should render without crashing', () => {
		render(<StatsBreakdown />)
		expect(screen.getByText(/Projects/i)).toBeDefined()
	})

	it('should display project count after loading', async () => {
		render(<StatsBreakdown />)

		await waitFor(() => {
			expect(screen.getByText('25')).toBeDefined()
			expect(screen.getByText(/Projects/i)).toBeDefined()
		})
	})

	it('should display commit count after loading', async () => {
		render(<StatsBreakdown />)

		await waitFor(() => {
			expect(screen.getByText('1500')).toBeDefined()
			expect(screen.getByText(/Commits/i)).toBeDefined()
		})
	})

	it('should calculate years of experience', async () => {
		const experienceData = [
			{
				startDate: '2020-01-01',
				endDate: null,
				skills: ['JavaScript', 'React'],
			},
		]

		render(<StatsBreakdown experienceData={experienceData} />)

		await waitFor(() => {
			expect(screen.getByText(/Years Experience/i)).toBeDefined()
		})
	})
})