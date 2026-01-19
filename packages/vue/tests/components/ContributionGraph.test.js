import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ContributionGraph from '../../src/components/ContributionGraph.vue'

// Mock the core module - must be at top level without external references
vi.mock('@git-stats-components/core', async () => {
	const actual = await vi.importActual('@git-stats-components/core')
	return {
		...actual,
		fetchGitStats: vi.fn().mockResolvedValue({
			data: {
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
										{
											date: '2025-01-06',
											contributionCount: 5,
											weekday: 0,
										},
										{
											date: '2025-01-07',
											contributionCount: 10,
											weekday: 1,
										},
										{
											date: '2025-01-08',
											contributionCount: 3,
											weekday: 2,
										},
										{
											date: '2025-01-09',
											contributionCount: 0,
											weekday: 3,
										},
										{
											date: '2025-01-10',
											contributionCount: 7,
											weekday: 4,
										},
										{
											date: '2025-01-11',
											contributionCount: 12,
											weekday: 5,
										},
										{
											date: '2025-01-12',
											contributionCount: 2,
											weekday: 6,
										},
									],
								},
							],
						},
					},
				],
				totals: {
					projectCount: 25,
					commitCount: 1500,
				},
				metadata: {
					fetchedAt: Date.now(),
					source: 'static',
				},
			},
			error: null,
			source: 'static',
			isDummy: false,
		}),
		formatLastUpdated: vi.fn().mockReturnValue('Updated 2 days ago'),
	}
})

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
							{
								date: '2025-01-06',
								contributionCount: 5,
								weekday: 0,
							},
							{
								date: '2025-01-07',
								contributionCount: 10,
								weekday: 1,
							},
							{
								date: '2025-01-08',
								contributionCount: 3,
								weekday: 2,
							},
							{
								date: '2025-01-09',
								contributionCount: 0,
								weekday: 3,
							},
							{
								date: '2025-01-10',
								contributionCount: 7,
								weekday: 4,
							},
							{
								date: '2025-01-11',
								contributionCount: 12,
								weekday: 5,
							},
							{
								date: '2025-01-12',
								contributionCount: 2,
								weekday: 6,
							},
						],
					},
				],
			},
		},
	],
	totals: {
		projectCount: 25,
		commitCount: 1500,
	},
	metadata: {
		fetchedAt: Date.now(),
		source: 'static',
	},
}

describe('ContributionGraph', () => {
	it('should render without crashing', () => {
		const wrapper = mount(ContributionGraph)
		expect(wrapper.exists()).toBe(true)
	})

	it('should show loading state initially', () => {
		const wrapper = mount(ContributionGraph)
		expect(wrapper.find('.loading-state').exists()).toBe(true)
	})

	it('should display contribution count after loading', async () => {
		const wrapper = mount(ContributionGraph)

		await vi.waitFor(() => {
			expect(wrapper.find('.contribution-count').exists()).toBe(true)
		})

		const contributionText = wrapper.find('.contribution-count').text()
		expect(contributionText).toContain('contributions')
	})

	it('should apply correct color scheme class', async () => {
		const wrapper = mount(ContributionGraph, {
			props: {
				colorScheme: 'blue',
			},
		})

		await vi.waitFor(() => {
			expect(wrapper.find('.contribution-day.blue').exists()).toBe(true)
		})
	})

	it('should show settings button when showSettings is true', async () => {
		const wrapper = mount(ContributionGraph, {
			props: {
				showSettings: true,
			},
		})

		await vi.waitFor(() => {
			expect(wrapper.find('.settings-btn').exists()).toBe(true)
		})
	})

	it('should hide settings button when showSettings is false', async () => {
		const wrapper = mount(ContributionGraph, {
			props: {
				showSettings: false,
			},
		})

		await vi.waitFor(() => {
			expect(wrapper.find('.settings-btn').exists()).toBe(false)
		})
	})

	it('should emit day-click event when day is clicked', async () => {
		const wrapper = mount(ContributionGraph)

		await vi.waitFor(() => {
			expect(wrapper.find('.contribution-day').exists()).toBe(true)
		})

		await wrapper.find('.contribution-day').trigger('click')

		expect(wrapper.emitted('day-click')).toBeTruthy()
		expect(wrapper.emitted('day-click')[0][0]).toHaveProperty('date')
		expect(wrapper.emitted('day-click')[0][0]).toHaveProperty('count')
	})

	it('should toggle settings dropdown', async () => {
		const wrapper = mount(ContributionGraph, {
			props: {
				showSettings: true,
			},
		})

		await vi.waitFor(() => {
			expect(wrapper.find('.settings-btn').exists()).toBe(true)
		})

		expect(wrapper.find('.settings-dropdown').exists()).toBe(false)

		await wrapper.find('.settings-btn').trigger('click')
		expect(wrapper.find('.settings-dropdown').exists()).toBe(true)

		await wrapper.find('.settings-btn').trigger('click')
		expect(wrapper.find('.settings-dropdown').exists()).toBe(false)
	})

	it('should emit color-scheme-change event', async () => {
		const wrapper = mount(ContributionGraph, {
			props: {
				showSettings: true,
			},
		})

		await vi.waitFor(() => {
			expect(wrapper.find('.settings-btn').exists()).toBe(true)
		})

		await wrapper.find('.settings-btn').trigger('click')

		const blueOption = wrapper
			.findAll('.settings-item')
			.find((item) => item.text().includes('blue'))
		await blueOption.trigger('click')

		expect(wrapper.emitted('color-scheme-change')).toBeTruthy()
		expect(wrapper.emitted('color-scheme-change')[0][0]).toBe('blue')
	})

	it('should display data source text', async () => {
		const wrapper = mount(ContributionGraph)

		await vi.waitFor(() => {
			const dataSourceEl = wrapper.find('.data-source-text')
			expect(dataSourceEl.exists()).toBe(true)
			expect(dataSourceEl.text().length).toBeGreaterThan(0)
		})

		const dataSourceText = wrapper.find('.data-source-text').text()
		expect(dataSourceText).toBe('Real-time data')
	})

	it('should highlight dummy data warning', async () => {
		const { fetchGitStats } = await import('@git-stats-components/core')
		
		// Override the mock for this specific test
		vi.mocked(fetchGitStats).mockResolvedValueOnce({
			data: {
				...mockData,
				metadata: {
					...mockData.metadata,
					isDummy: true,
				},
			},
			error: null,
			source: 'mock',
			isDummy: true,
		})

		const wrapper = mount(ContributionGraph)

		await vi.waitFor(() => {
			const dataSource = wrapper.find('.data-source-text')
			expect(dataSource.exists()).toBe(true)
			expect(dataSource.classes()).toContain('is-dummy')
		})
	})

	it('should render month labels', async () => {
		const wrapper = mount(ContributionGraph)

		await vi.waitFor(() => {
			expect(wrapper.find('.month-label').exists()).toBe(true)
		})
	})

	it('should render day labels', async () => {
		const wrapper = mount(ContributionGraph)

		await vi.waitFor(() => {
			const dayLabels = wrapper.findAll('.day-label')
			expect(dayLabels.length).toBe(7) // Mon, Wed, Fri + 4 empty
		})
	})

	it('should render legend', async () => {
		const wrapper = mount(ContributionGraph)

		await vi.waitFor(() => {
			expect(wrapper.find('.legend').exists()).toBe(true)
			expect(wrapper.find('.legend-squares').exists()).toBe(true)
		})
	})

	it('should show last updated text', async () => {
		const wrapper = mount(ContributionGraph)

		await vi.waitFor(() => {
			expect(wrapper.find('.last-updated').exists()).toBe(true)
		})
	})

	it('should use custom dataUrl prop', async () => {
		const { fetchGitStats } = await import('@git-stats-components/core')
		const customUrl = '/custom/path/data.json'

		// Clear previous calls
		vi.mocked(fetchGitStats).mockClear()

		mount(ContributionGraph, {
			props: {
				dataUrl: customUrl,
			},
		})

		await vi.waitFor(() => {
			expect(fetchGitStats).toHaveBeenCalledWith(
				expect.objectContaining({
					dataUrl: customUrl,
				})
			)
		})
	})

	it('should display correct profile when profileIndex is set', async () => {
		const multiProfileData = {
			...mockData,
			profiles: [
				mockData.profiles[0],
				{
					username: 'seconduser',
					platform: 'gitlab',
					stats: {
						projectCount: 10,
						commitCount: 500,
						contributions: [],
					},
				},
			],
		}

		const { fetchGitStats } = await import('@git-stats-components/core')
		
		vi.mocked(fetchGitStats).mockResolvedValueOnce({
			data: multiProfileData,
			error: null,
			source: 'static',
			isDummy: false,
		})

		const wrapper = mount(ContributionGraph, {
			props: {
				profileIndex: 1,
			},
		})

		await vi.waitFor(() => {
			expect(wrapper.find('.contribution-count').exists()).toBe(true)
		})
	})
})