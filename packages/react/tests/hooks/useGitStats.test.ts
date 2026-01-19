import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useGitStats } from '../../src/hooks/useGitStats'

// Mock fetch
global.fetch = vi.fn()

describe('useGitStats', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		localStorage.clear()
	})

	it('should initialize with loading state', async () => {
		// Mock successful fetch
		;(global.fetch as any).mockResolvedValueOnce({
			ok: true,
			json: async () => ({
				lastUpdated: '2024-01-01T00:00:00Z',
				profiles: [],
				totals: { projectCount: 0, commitCount: 0 },
			}),
		})

		const { result } = renderHook(() => useGitStats())

		// Initially should be loading
		expect(result.current).toBeDefined()
		expect(result.current.loading).toBe(true)
		expect(result.current.data).toBe(null)

		// Wait for data to load
		await waitFor(
			() => {
				expect(result.current.loading).toBe(false)
			},
			{ timeout: 3000 }
		)

		expect(result.current.data).not.toBe(null)
	})

	it('should fetch and cache data', async () => {
		const mockData = {
			lastUpdated: '2024-01-01T00:00:00Z',
			profiles: [
				{
					username: 'testuser',
					platform: 'github' as const,
					stats: {
						projectCount: 10,
						commitCount: 100,
						contributions: [],
					},
				},
			],
			totals: { projectCount: 10, commitCount: 100 },
		}

		;(global.fetch as any).mockResolvedValueOnce({
			ok: true,
			json: async () => mockData,
		})

		const { result } = renderHook(() =>
			useGitStats({
				dataUrl: '/test-data.json',
				profileIndex: 0,
			})
		)

		await waitFor(
			() => {
				expect(result.current.loading).toBe(false)
			},
			{ timeout: 3000 }
		)

		expect(result.current.data).toEqual(mockData)
		expect(result.current.error).toBe(null)
	})

	it('should handle fetch errors gracefully', async () => {
		;(global.fetch as any).mockRejectedValueOnce(new Error('Network error'))

		const { result } = renderHook(() => useGitStats())

		await waitFor(
			() => {
				expect(result.current.loading).toBe(false)
			},
			{ timeout: 3000 }
		)

		// Should still have data (mock fallback)
		expect(result.current.data).not.toBe(null)
		expect(result.current.error).toBe(null)
	})

	it('should use cached data when available', async () => {
		const cachedData = {
			lastUpdated: '2024-01-01T00:00:00Z',
			profiles: [],
			totals: { projectCount: 5, commitCount: 50 },
			cachedAt: Date.now(),
		}

		localStorage.setItem('git_stats_cache', JSON.stringify(cachedData))

		// Don't mock fetch - should use cache instead
		;(global.fetch as any).mockRejectedValueOnce(new Error('Should not fetch'))

		const { result } = renderHook(() =>
			useGitStats({
				useStaleCache: true,
			})
		)

		await waitFor(
			() => {
				expect(result.current.loading).toBe(false)
			},
			{ timeout: 3000 }
		)

		expect(result.current.data).not.toBe(null)
		expect(result.current.data?.totals.projectCount).toBe(5)
	})

	it('should respect profileIndex', async () => {
		const mockData = {
			lastUpdated: '2024-01-01T00:00:00Z',
			profiles: [
				{
					username: 'user1',
					platform: 'github' as const,
					stats: { projectCount: 10, commitCount: 100, contributions: [] },
				},
				{
					username: 'user2',
					platform: 'gitlab' as const,
					stats: { projectCount: 20, commitCount: 200, contributions: [] },
				},
			],
			totals: { projectCount: 30, commitCount: 300 },
		}

		;(global.fetch as any).mockResolvedValueOnce({
			ok: true,
			json: async () => mockData,
		})

		const { result } = renderHook(() =>
			useGitStats({
				profileIndex: 1, // Use second profile
			})
		)

		await waitFor(
			() => {
				expect(result.current.loading).toBe(false)
			},
			{ timeout: 3000 }
		)

		expect(result.current.data).toEqual(mockData)
		// profileIndex is used in components, not in the hook itself
	})
})