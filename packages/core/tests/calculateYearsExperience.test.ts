import { describe, it, expect } from 'vitest'
import { calculateYearsExperience } from '../src/index'

const now = new Date('2026-01-01T00:00:00Z')

describe('calculateYearsExperience', () => {
	it('returns 0 with no experience', () => {
		expect(calculateYearsExperience([], now)).toBe(0)
	})

	it('measures a single position', () => {
		const years = calculateYearsExperience(
			[{ startDate: '2020-01-01', endDate: '2022-01-01', skills: ['Vue'] }],
			now
		)
		expect(years).toBeCloseTo(2, 1)
	})

	it('runs an open position to now', () => {
		const years = calculateYearsExperience(
			[{ startDate: '2025-01-01', endDate: null, skills: ['Vue'] }],
			now
		)
		expect(years).toBeCloseTo(1, 1)
	})

	it('counts overlapping positions with the same skill once', () => {
		const years = calculateYearsExperience(
			[
				{ startDate: '2017-05-01', endDate: '2019-04-01', skills: ['Vue'] },
				{ startDate: '2018-04-01', endDate: '2019-09-01', skills: ['Vue'] },
			],
			now
		)
		// 2017-05 to 2019-09, not 1.9 + 1.4 years
		expect(years).toBeCloseTo(2.34, 1)
	})

	it('adds up separate positions with a gap', () => {
		const years = calculateYearsExperience(
			[
				{ startDate: '2018-01-01', endDate: '2019-01-01', skills: ['Vue'] },
				{ startDate: '2020-01-01', endDate: '2021-01-01', skills: ['Vue'] },
			],
			now
		)
		expect(years).toBeCloseTo(2, 1)
	})

	it('uses the skill with the most time', () => {
		const years = calculateYearsExperience(
			[
				{ startDate: '2020-01-01', endDate: '2021-01-01', skills: ['React'] },
				{ startDate: '2021-01-01', endDate: '2024-01-01', skills: ['Vue'] },
			],
			now
		)
		expect(years).toBeCloseTo(3, 1)
	})

	it('skips entries with dates that do not parse', () => {
		const years = calculateYearsExperience(
			[
				{ startDate: 'not a date', endDate: null, skills: ['Vue'] },
				{ startDate: '2020-01-01', endDate: '2021-01-01', skills: ['Vue'] },
			],
			now
		)
		expect(Number.isFinite(years)).toBe(true)
		expect(years).toBeCloseTo(1, 1)
	})

	it('never exceeds the span of the whole career', () => {
		// derekjohnston.ca's real history: overlapping jobs sharing skills
		const exps = [
			{ startDate: '2023-10-01', endDate: null, skills: ['Vue'] },
			{ startDate: '2021-05-01', endDate: '2023-09-01', skills: ['Vue'] },
			{ startDate: '2019-12-01', endDate: '2021-05-01', skills: ['Vue'] },
			{ startDate: '2018-04-01', endDate: '2019-09-01', skills: ['Vue'] },
			{ startDate: '2017-05-01', endDate: '2019-04-01', skills: ['Vue'] },
		]
		const career =
			(now.getTime() - new Date('2017-05-01').getTime()) /
			(1000 * 60 * 60 * 24 * 365.25)
		expect(calculateYearsExperience(exps, now)).toBeLessThanOrEqual(career)
	})
})
