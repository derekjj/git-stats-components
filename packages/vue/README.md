# @git-stats-components/vue

Beautiful GitHub/GitLab/Bitbucket contribution graphs for Vue 3.

## Installation

```bash
npm install @git-stats-components/vue
```

## Quick Start

```vue
<script setup>
import { ContributionGraph, StatsBreakdown } from '@git-stats-components/vue'
import '@git-stats-components/vue/style.css'
</script>

<template>
  <div>
    <ContributionGraph data-url="/data/git-stats.json" color-scheme="green" />
    <StatsBreakdown data-url="/data/git-stats.json" />
  </div>
</template>
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

- `@day-click` - Emitted when a day is clicked (`{ date: string, count: number }`)
- `@color-scheme-change` - Emitted when color scheme changes

**Example:**

```vue
<ContributionGraph
  data-url="/data/git-stats.json"
  :profile-index="0"
  color-scheme="blue"
  :show-settings="true"
  @day-click="handleDayClick"
  @color-scheme-change="handleColorChange"
/>
```

### StatsBreakdown

Project and commit count statistics.

**Props:**

- `dataUrl` (string) - Path to stats JSON file
- `profileIndexes` (number[]) - Which profiles to aggregate (default: [])
- `experienceData` (ExperienceEntry[]) - Work experience for years calculation
- `showCustomStat` (boolean) - Show custom stat (default: true)
- `customStatCalculator` (function) - Custom stat calculation function

**Slots:**

- `icon-experience` - Custom icon for experience stat
- `icon-projects` - Custom icon for projects stat
- `icon-commits` - Custom icon for commits stat
- `icon-custom` - Custom icon for custom stat
- `custom-stat-label` - Custom label for custom stat

**Example:**

```vue
<script setup>
const experienceData = [
  {
    startDate: '2020-01-01',
    endDate: null, // current
    skills: ['JavaScript', 'Vue', 'TypeScript']
  }
]

function calculatePizzas({ projects, commits, years }) {
  return (projects * 2 + commits * 0.5 + years * 100).toFixed(0)
}
</script>

<template>
  <StatsBreakdown
    data-url="/data/git-stats.json"
    :experience-data="experienceData"
    :show-custom-stat="true"
    :custom-stat-calculator="calculatePizzas"
  >
    <template #icon-custom>🍕</template>
    <template #custom-stat-label>Pizzas Ordered</template>
  </StatsBreakdown>
</template>
```

## Using the Composable

```vue
<script setup>
import { useGitStats } from '@git-stats-components/vue'

const { data, loading, error, dataSourceText, lastUpdatedText, isDummy } = useGitStats({
  dataUrl: '/data/git-stats.json',
  cacheTTL: 3600000, // 1 hour
  useStaleCache: true
})
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <div v-else>
    <p>{{ dataSourceText }}</p>
    <p>{{ lastUpdatedText }}</p>
    <pre>{{ JSON.stringify(data, null, 2) }}</pre>
  </div>
</template>
```

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import type {
  GitStatsData,
  ColorScheme,
  Platform,
  ExperienceEntry,
  CustomStatCalculator
} from '@git-stats-components/vue'

const colorScheme: ColorScheme = 'green'

const experienceData: ExperienceEntry[] = [
  {
    startDate: '2020-01-01',
    endDate: null,
    skills: ['JavaScript', 'Vue', 'TypeScript']
  }
]

const customCalculator: CustomStatCalculator = ({ projects, commits, years }) => {
  return (projects * 2 + commits * 0.5).toFixed(0)
}
```

## Plugin Usage

Register globally in your Vue app:

```typescript
import { createApp } from 'vue'
import VueGitStats from '@git-stats-components/vue'
import '@git-stats-components/vue/style.css'
import App from './App.vue'

const app = createApp(App)
app.use(VueGitStats)
app.mount('#app')
```

Then use without imports:

```vue
<template>
  <ContributionGraph data-url="/data/git-stats.json" />
  <StatsBreakdown data-url="/data/git-stats.json" />
</template>
```

## Nuxt 3 Usage

```vue
<!-- pages/index.vue -->
<script setup lang="ts">
import { ContributionGraph, StatsBreakdown } from '@git-stats-components/vue'
import '@git-stats-components/vue/style.css'

const experienceData = [
  {
    startDate: '2020-01-01',
    endDate: null,
    skills: ['JavaScript', 'Vue', 'Nuxt']
  }
]
</script>

<template>
  <div>
    <ContributionGraph data-url="/data/git-stats.json" />
    <StatsBreakdown data-url="/data/git-stats.json" :experience-data="experienceData" />
  </div>
</template>
```

## Custom Styling

Override CSS variables:

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

## Data Setup

## Quick Setup

### 1. Initialize in your project

```bash
npx @git-stats-components/vue init
```

This creates:
- `git-stats.config.js` - Configuration file
- `.github/workflows/update-git-stats.yml` - GitHub Action workflow
- `public/data/` - Directory for stats data

### 2. Configure your profiles

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

### 3. Add GitHub Secrets

Go to **Settings → Secrets and variables → Actions** and add your tokens.

### 4. Done!

The GitHub Action will fetch your stats daily and save them to the JSON file. Your components will load this data automatically.

For more details, see the main [git-stats-components](https://github.com/derekjj/git-stats-components) repository.

## License

MIT © Derek Johnston