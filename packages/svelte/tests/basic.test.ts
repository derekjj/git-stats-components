import { describe, it, expect } from 'vitest'
import { generateDummyStats } from '@git-stats-components/core'

describe('Svelte Package', () => {
	it('should be able to import core utilities', () => {
		const stats = generateDummyStats()
		expect(stats).toBeDefined()
		expect(stats.profiles).toHaveLength(1)
		expect(stats.profiles[0].platform).toBe('github')
	})

	it('should have core package available', () => {
		expect(generateDummyStats).toBeDefined()
		expect(typeof generateDummyStats).toBe('function')
	})
})