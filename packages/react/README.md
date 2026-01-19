# @git-stats-components/react

Beautiful GitHub/GitLab/Bitbucket contribution graphs for React.

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
<ContributionGraph
	dataUrl="/data/git-stats.json"
	profileIndex={0}
	colorScheme="blue"
	showSettings={true}
	onDayClick={(data) => console.log('Clicked:', data)}
	onColorSchemeChange={(scheme) => console.log('Color:', scheme)}
/>
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

<StatsBreakdown
  dataUrl="/data/git-stats.json"
  experienceData={experienceData}
  showCustomStat={true}
/>
```

## Using the Hook

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
```

## Styling

Override CSS variables:

```css
.git-contribution-graph {
	--graph-bg: #0d1117;
	--graph-text: #e6edf3;
	--graph-border: #30363d;
}
```

## Data Setup

See the main [vue-git-stats](https://github.com/derekjj/git-stats-components) repository for setup instructions on generating the data file via GitHub Actions.

## License

MIT © Derek Johnston
