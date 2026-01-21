# @git-stats-components/core

> Framework-agnostic core logic for git-stats-components

[![npm version](https://img.shields.io/npm/v/@git-stats-components/core.svg)](https://www.npmjs.com/package/@git-stats-components/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This package provides the shared functionality used by Vue, React, and Svelte implementations.

## Installation

```bash
npm install @git-stats-components/core
```

## What's Included

- **Type definitions** - TypeScript types for all data structures
- **Data fetching utilities** - Multi-tier fallback system (static → cache → mock)
- **Helper functions** - Date formatting, contribution level calculation, etc.
- **Dummy data generators** - For testing and development

## Usage

### Data Fetching

```typescript
import { fetchGitStats } from '@git-stats-components/core'

const result = await fetchGitStats({
  dataUrl: '/data/git-stats.json',
  cacheTTL: 24 * 60 * 60 * 1000, // 24 hours
  useStaleCache: true
})

console.log(result.data)       // GitStatsData | null
console.log(result.source)     // 'static' | 'cache' | 'mock'
console.log(result.isDummy)    // boolean
```

### Helper Functions

```typescript
import { 
  formatLastUpdated, 
  getContributionLevel,
  calculateYearsExperience 
} from '@git-stats-components/core'

// Format timestamps
const formatted = formatLastUpdated('2024-01-15T10:00:00Z')
// Returns: "2 days ago", "just now", etc.

// Get contribution level (0-4)
const level = getContributionLevel(8)
// Returns: 3

// Calculate years of experience
const years = calculateYearsExperience([
  {
    startDate: '2020-01-01',
    endDate: null,
    skills: ['JavaScript', 'TypeScript']
  }
])
```

### Generate Dummy Data

Perfect for testing and development:

```typescript
import { generateDummyStats } from '@git-stats-components/core'

const dummyData = generateDummyStats({
  username: 'testuser',
  platform: 'github',
  projectCount: 30,
  commitCount: 2500
})

// Includes 53 weeks of realistic contribution data
console.log(dummyData.profiles[0].stats.contributions)
```

## API Reference

### fetchGitStats(options)

Fetches git stats data with multi-tier fallback.

**Parameters:**
- `dataUrl` (string) - Path to stats JSON file
- `cacheTTL` (number, optional) - Cache duration in milliseconds
- `cacheKey` (string, optional) - LocalStorage key for cache
- `useStaleCache` (boolean, optional) - Use stale cache as fallback

**Returns:** `Promise<DataResult<GitStatsData>>`

```typescript
interface DataResult<T> {
  data: T | null
  error: Error | null
  source: 'static' | 'cache' | 'mock' | 'dummy' | null
  isDummy: boolean
}
```

### formatLastUpdated(dateString)

Formats an ISO 8601 timestamp into human-readable relative time.

**Returns:** `string` - "just now", "2 hours ago", "3 days ago", etc.

### getContributionLevel(count)

Converts contribution count to level (0-4) for color coding.

**Levels:**
- 0: No contributions
- 1: 1-3 contributions
- 2: 4-6 contributions
- 3: 7-9 contributions
- 4: 10+ contributions

### calculateYearsExperience(experienceData)

Calculates total years of experience from experience entries.

**Parameters:**
- `experienceData` (ExperienceEntry[]) - Array of experience periods

**Returns:** `number` - Years of experience (max across all skills)

```typescript
interface ExperienceEntry {
  startDate: string              // YYYY-MM-DD
  endDate: string | null         // YYYY-MM-DD or null for present
  skills?: string[]              // Optional skill tags
}
```

### generateDummyStats(options?)

Generates realistic dummy data for testing.

**Parameters:**
- `username` (string, optional) - Default: 'demo-user'
- `platform` (Platform, optional) - Default: 'github'
- `projectCount` (number, optional) - Default: 30
- `commitCount` (number, optional) - Default: 2500

**Returns:** `GitStatsData`

## TypeScript Types

All types are exported and fully documented:

```typescript
import type {
  GitStatsData,
  Profile,
  ContributionWeek,
  ContributionDay,
  ColorScheme,
  Platform,
  ExperienceEntry,
  CustomStatCalculator
} from '@git-stats-components/core'
```

### GitStatsData

```typescript
interface GitStatsData {
  lastUpdated: string                // ISO 8601 timestamp
  profiles: Profile[]                // Array of user profiles
  totals: StatsTotals               // Aggregated totals
  metadata: StatsMetadata           // Fetch metadata
  cachedAt?: number                 // Cache timestamp
}
```

### Profile

```typescript
interface Profile {
  username: string
  platform: Platform
  stats: ProfileStats
}

interface ProfileStats {
  projectCount: number
  commitCount: number
  contributions?: ContributionWeek[]  // GitHub only
}
```

### ContributionWeek

```typescript
interface ContributionWeek {
  firstDay: string                    // YYYY-MM-DD
  contributionDays: ContributionDay[]
}

interface ContributionDay {
  date: string                        // YYYY-MM-DD
  contributionCount: number
  weekday: number                     // 0-6 (Sunday-Saturday)
}
```

## Framework Packages

This is a core package. For actual UI components, use the framework-specific packages:

- **Vue 3**: [@git-stats-components/vue](https://www.npmjs.com/package/@git-stats-components/vue)
- **React**: [@git-stats-components/react](https://www.npmjs.com/package/@git-stats-components/react)
- **Svelte**: [@git-stats-components/svelte](https://www.npmjs.com/package/@git-stats-components/svelte)

## Build Your Own Component

```typescript
import { 
  fetchGitStats, 
  formatLastUpdated,
  getContributionLevel,
  type GitStatsData 
} from '@git-stats-components/core'

class GitStatsWidget {
  private data: GitStatsData | null = null
  
  async load(dataUrl: string) {
    const result = await fetchGitStats({ dataUrl })
    this.data = result.data
    
    if (result.isDummy) {
      console.warn('Using dummy data')
    }
    
    return this.data
  }
  
  getLastUpdated(): string {
    if (!this.data) return ''
    return formatLastUpdated(this.data.lastUpdated)
  }
  
  getTotalContributions(): number {
    if (!this.data?.profiles[0]?.stats?.contributions) return 0
    
    return this.data.profiles[0].stats.contributions.reduce((total, week) => {
      return total + week.contributionDays.reduce((sum, day) => {
        return sum + day.contributionCount
      }, 0)
    }, 0)
  }
  
  getContributionColor(count: number): string {
    const level = getContributionLevel(count)
    const colors = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353']
    return colors[level]
  }
}

// Usage
const widget = new GitStatsWidget()
await widget.load('/data/git-stats.json')
console.log(widget.getLastUpdated())
console.log(widget.getTotalContributions())
```

## License

MIT © [Derek Johnston](https://github.com/derekjj)

## Links

- [GitHub Repository](https://github.com/derekjj/git-stats-components)
- [Documentation](https://github.com/derekjj/git-stats-components#readme)
- [Issues](https://github.com/derekjj/git-stats-components/issues)