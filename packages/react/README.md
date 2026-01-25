# @git-stats-components/react

> Beautiful contribution graphs for React

[![npm version](https://img.shields.io/npm/v/@git-stats-components/react.svg)](https://www.npmjs.com/package/@git-stats-components/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![Git Stats Components](./../../screenshot-contribution-graph-black.png)
![Git Stats Components](./../../screenshot-stats-breakdown-black.png)

## Demo

[View Live Demo](https://derekjohnston.ca/demo)

## Installation

```bash
npm install @git-stats-components/react
```

## Quick Start

```tsx
import { ContributionGraph, StatsBreakdown } from '@git-stats-components/react'
import '@git-stats-components/react/style.css'

function App() {
  return (
    <div>
      <ContributionGraph
        dataUrl="/data/git-stats.json"
        colorScheme="green"
      />
      <StatsBreakdown dataUrl="/data/git-stats.json" />
    </div>
  )
}
```

## Components

### ContributionGraph

GitHub-style contribution heatmap.

**Props:**

- `dataUrl` (string) - Path to stats JSON file
- `profileIndex` (number) - Which profile to display (default: 0)
- `colorScheme` ('green' | 'blue' | 'purple' | 'orange') - Color theme
- `showSettings` (boolean) - Show color scheme dropdown
- `cacheTTL` (number) - Cache duration in milliseconds
- `onDayClick` ((data: { date: string; count: number }) => void) - Day click handler
- `onColorSchemeChange` ((scheme: ColorScheme) => void) - Color scheme change handler

**Example:**

```tsx
function MyApp() {
  const handleDayClick = (data) => {
    console.log('Clicked:', data)
  }

  const handleColorChange = (scheme) => {
    console.log('Color scheme:', scheme)
  }

  return (
    <ContributionGraph
      dataUrl="/data/git-stats.json"
      profileIndex={0}
      colorScheme="blue"
      showSettings={true}
      onDayClick={handleDayClick}
      onColorSchemeChange={handleColorChange}
    />
  )
}
```

### StatsBreakdown

Project and commit count statistics.

**Props:**

- `dataUrl` (string) - Path to stats JSON file
- `profileIndexes` (number[]) - Which profiles to aggregate
- `experienceData` (ExperienceEntry[]) - Work experience for years calculation
- `showCustomStat` (boolean) - Show custom stat (default: true)
- `customStatCalculator` (function) - Custom stat calculation function

**Example:**

```tsx
const experienceData = [
  {
    startDate: '2020-01-01',
    endDate: null, // current
    skills: ['JavaScript', 'React', 'Node.js']
  }
]

function calculatePizzas({ projects, commits, years }) {
  return (projects * 2 + commits * 0.5 + years * 100).toFixed(0)
}

function MyApp() {
  return (
    <StatsBreakdown
      dataUrl="/data/git-stats.json"
      experienceData={experienceData}
      showCustomStat={true}
      customStatCalculator={calculatePizzas}
    />
  )
}
```

## Hook

Access data and state directly with the `useGitStats` hook:

```tsx
import { useGitStats } from '@git-stats-components/react'

function MyComponent() {
  const { data, loading, error, dataSourceText, lastUpdatedText, isDummy } =
    useGitStats({
      dataUrl: '/data/git-stats.json',
      cacheTTL: 3600000, // 1 hour
      useStaleCache: true,
    })

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <p>{dataSourceText}</p>
      <p>{lastUpdatedText}</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
```

## TypeScript Support

Full TypeScript support with exported types:

```tsx
import type {
  GitStatsData,
  ColorScheme,
  Platform,
  ExperienceEntry,
  CustomStatCalculator,
} from '@git-stats-components/react'

const colorScheme: ColorScheme = 'green'

const experienceData: ExperienceEntry[] = [
  {
    startDate: '2020-01-01',
    endDate: null,
    skills: ['JavaScript', 'React', 'TypeScript']
  }
]

const customCalculator: CustomStatCalculator = ({ projects, commits, years }) => {
  return (projects * 2 + commits * 0.5).toFixed(0)
}
```

## Styling

Override CSS variables for custom theming:

```css
.git-contribution-graph {
  --graph-bg: #0d1117;
  --graph-text: #e6edf3;
  --graph-border: #30363d;
}

/* Or target specific classes */
.contribution-day.level-4.green {
  background-color: #00ff00 !important;
}
```

## Setup

### Quick Setup

Initialize in your project:

```bash
npx @git-stats-components/react init
```

This creates:
- `git-stats.config.js` - Configuration file
- `.github/workflows/update-git-stats.yml` - GitHub Action workflow
- `public/data/` - Directory for stats data

### Configuration

Edit `git-stats.config.js`:

```javascript
export default {
  profiles: [
    {
      username: 'your-github-username',
      platform: 'github',
      tokenSecret: 'GITHUB_TOKEN'
    }
  ],
  dataPath: 'public/data/git-stats.json',
  schedule: '0 2 * * *' // Daily at 2 AM UTC
}
```

### Add Secrets

Go to **Settings → Secrets and variables → Actions** and add your tokens.

That's it! The GitHub Action will fetch your stats daily.

For more details, see the main [git-stats-components](https://github.com/derekjj/git-stats-components) repository.

## License

MIT © [Derek Johnston](https://github.com/derekjj)