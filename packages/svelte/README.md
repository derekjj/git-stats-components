# @git-stats-components/svelte

> Beautiful contribution graphs for Svelte

[![npm version](https://img.shields.io/npm/v/@git-stats-components/svelte.svg)](https://www.npmjs.com/package/@git-stats-components/svelte)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @git-stats-components/svelte
```

## Quick Start

```svelte
<script>
  import { ContributionGraph, StatsBreakdown } from '@git-stats-components/svelte'
</script>

<ContributionGraph dataUrl="/data/git-stats.json" colorScheme="green" />
<StatsBreakdown dataUrl="/data/git-stats.json" />
```

## Components

### ContributionGraph

GitHub-style contribution heatmap.

**Props:**

- `dataUrl` (string) - Path to stats JSON file (default: `/data/git-stats.json`)
- `profileIndex` (number) - Which profile to display (default: 0)
- `colorScheme` ('green' | 'blue' | 'purple' | 'orange') - Color theme (default: 'green')
- `showSettings` (boolean) - Show color scheme dropdown (default: true)
- `cacheTTL` (number) - Cache duration in milliseconds

**Events:**

- `dayClick` - Dispatched when a day is clicked (detail: `{ date, count }`)
- `colorSchemeChange` - Dispatched when color scheme changes (detail: scheme)

**Example:**

```svelte
<script>
  import { ContributionGraph } from '@git-stats-components/svelte'

  function handleDayClick(event) {
    console.log('Clicked:', event.detail)
  }

  function handleColorChange(event) {
    console.log('Color:', event.detail)
  }
</script>

<svelte:window
  on:dayClick={handleDayClick}
  on:colorSchemeChange={handleColorChange}
/>

<ContributionGraph
  dataUrl="/data/git-stats.json"
  profileIndex={0}
  colorScheme="blue"
  showSettings={true}
/>
```

### StatsBreakdown

Project and commit count statistics.

**Props:**

- `dataUrl` (string) - Path to stats JSON file
- `profileIndexes` (number[]) - Which profiles to aggregate (default: [])
- `experienceData` (ExperienceEntry[]) - Work experience for years calculation (default: [])
- `showCustomStat` (boolean) - Show custom stat (default: true)
- `customStatCalculator` (function) - Custom stat calculation function

**Slots:**

- `icon-experience` - Custom icon for experience stat
- `icon-projects` - Custom icon for projects stat
- `icon-commits` - Custom icon for commits stat
- `icon-custom` - Custom icon for custom stat
- `custom-stat-label` - Custom label for custom stat
- Default slot for additional content

**Example:**

```svelte
<script>
  import { StatsBreakdown } from '@git-stats-components/svelte'

  const experienceData = [
    {
      startDate: '2020-01-01',
      endDate: null, // current
      skills: ['JavaScript', 'Svelte', 'Node.js']
    }
  ]

  function calculatePizzas({ projects, commits, years }) {
    return (projects * 2 + commits * 0.5 + years * 100).toFixed(0)
  }
</script>

<StatsBreakdown
  dataUrl="/data/git-stats.json"
  {experienceData}
  showCustomStat={true}
  customStatCalculator={calculatePizzas}
>
  <div slot="icon-custom">🍕</div>
  <div slot="custom-stat-label">Pizzas Ordered</div>

  <!-- Additional content goes here -->
  <p>Custom footer content</p>
</StatsBreakdown>
```

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import type {
  GitStatsData,
  ColorScheme,
  Platform,
  ExperienceEntry,
  CustomStatCalculator,
} from '@git-stats-components/svelte'

let colorScheme: ColorScheme = 'green'

const experienceData: ExperienceEntry[] = [
  {
    startDate: '2020-01-01',
    endDate: null,
    skills: ['JavaScript', 'Svelte'],
  },
]
```

## SvelteKit

```svelte
<!-- +page.svelte -->
<script lang="ts">
  import { ContributionGraph, StatsBreakdown } from '@git-stats-components/svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<ContributionGraph dataUrl={data.statsUrl} />
<StatsBreakdown dataUrl={data.statsUrl} />
```

## Reactive Props

All props are reactive-update them and the component updates:

```svelte
<script>
  import { ContributionGraph } from '@git-stats-components/svelte'

  let colorScheme = 'green'

  function changeColor() {
    colorScheme = 'blue'
  }
</script>

<button on:click={changeColor}>Change Color</button>
<ContributionGraph {colorScheme} />
```

## Styling

Components use scoped styles but you can override using global styles:

```css
/* In your global CSS */
:global(.git-contribution-graph) {
  /* Custom styles */
}

:global(.contribution-day.level-4.green) {
  background-color: #00ff00 !important;
}
```

## Setup

### Quick Setup

Initialize in your project:

```bash
npx @git-stats-components/svelte init
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