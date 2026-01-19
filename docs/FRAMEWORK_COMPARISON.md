# Framework Comparison Guide

Side-by-side comparison of how to use git-stats-components in different frameworks.

## Installation

| Framework | Package Name                  | Command                                   |
| --------- | ----------------------------- | ----------------------------------------- |
| Vue 3     | `vue-git-stats`               | `npm install vue-git-stats`               |
| React     | `@git-stats-components/react` | `npm install @git-stats-components/react` |

## Basic Usage

### Vue 3

```vue
<script setup>
import { ContributionGraph, StatsBreakdown } from 'vue-git-stats'
import 'vue-git-stats/style.css'

const handleDayClick = (data) => {
	console.log('Clicked:', data)
}
</script>

<template>
	<div>
		<ContributionGraph
			data-url="/data/git-stats.json"
			color-scheme="green"
			@day-click="handleDayClick"
		/>

		<StatsBreakdown
			data-url="/data/git-stats.json"
			:experience-data="experienceData"
		/>
	</div>
</template>
```

### React

```tsx
import { ContributionGraph, StatsBreakdown } from '@git-stats-components/react'
import '@git-stats-components/react/style.css'

function App() {
	const handleDayClick = (data) => {
		console.log('Clicked:', data)
	}

	return (
		<div>
			<ContributionGraph
				dataUrl="/data/git-stats.json"
				colorScheme="green"
				onDayClick={handleDayClick}
			/>

			<StatsBreakdown
				dataUrl="/data/git-stats.json"
				experienceData={experienceData}
			/>
		</div>
	)
}
```

## Using the Hook/Composable

### Vue 3 (Composable)

```vue
<script setup>
import { useGitStats } from 'vue-git-stats'

const { data, loading, error, dataSourceText, lastUpdatedText, isDummy } =
	useGitStats({
		dataUrl: '/data/git-stats.json',
		cacheTTL: 3600000,
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

### React (Hook)

```tsx
import { useGitStats } from '@git-stats-components/react'

function MyComponent() {
	const { data, loading, error, dataSourceText, lastUpdatedText, isDummy } =
		useGitStats({
			dataUrl: '/data/git-stats.json',
			cacheTTL: 3600000,
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

## Props/Attributes Comparison

### ContributionGraph

| Feature            | Vue 3                            | React                           |
| ------------------ | -------------------------------- | ------------------------------- |
| Data URL           | `data-url="/path"`               | `dataUrl="/path"`               |
| Profile Index      | `:profile-index="0"`             | `profileIndex={0}`              |
| Color Scheme       | `color-scheme="green"`           | `colorScheme="green"`           |
| Show Settings      | `:show-settings="true"`          | `showSettings={true}`           |
| Cache TTL          | `:cache-t-t-l="3600000"`         | `cacheTTL={3600000}`            |
| Day Click Event    | `@day-click="handler"`           | `onDayClick={handler}`          |
| Color Change Event | `@color-scheme-change="handler"` | `onColorSchemeChange={handler}` |

### StatsBreakdown

| Feature           | Vue 3                          | React                       |
| ----------------- | ------------------------------ | --------------------------- |
| Data URL          | `data-url="/path"`             | `dataUrl="/path"`           |
| Profile Indexes   | `:profile-indexes="[0,1]"`     | `profileIndexes={[0,1]}`    |
| Experience Data   | `:experience-data="data"`      | `experienceData={data}`     |
| Show Custom Stat  | `:show-custom-stat="true"`     | `showCustomStat={true}`     |
| Custom Calculator | `:custom-stat-calculator="fn"` | `customStatCalculator={fn}` |

## TypeScript Usage

### Vue 3

```typescript
import type {
	GitStatsData,
	ColorScheme,
	ExperienceEntry,
	CustomStatCalculator,
} from 'vue-git-stats'

const colorScheme: ColorScheme = 'green'

const experienceData: ExperienceEntry[] = [
	{
		startDate: '2020-01-01',
		endDate: null,
		skills: ['JavaScript', 'Vue', 'TypeScript'],
	},
]

const customCalculator: CustomStatCalculator = ({
	projects,
	commits,
	years,
}) => {
	return (projects * 2 + commits * 0.5).toFixed(0)
}
```

### React

```typescript
import type {
	GitStatsData,
	ColorScheme,
	ExperienceEntry,
	CustomStatCalculator,
} from '@git-stats-components/react'

const colorScheme: ColorScheme = 'green'

const experienceData: ExperienceEntry[] = [
	{
		startDate: '2020-01-01',
		endDate: null,
		skills: ['JavaScript', 'React', 'TypeScript'],
	},
]

const customCalculator: CustomStatCalculator = ({
	projects,
	commits,
	years,
}) => {
	return (projects * 2 + commits * 0.5).toFixed(0)
}
```

## Plugin/Global Registration

### Vue 3

```typescript
import { createApp } from 'vue'
import VueGitStats from 'vue-git-stats'
import 'vue-git-stats/style.css'
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

### React

React doesn't have a plugin system, so you always import components directly:

```tsx
import { ContributionGraph, StatsBreakdown } from '@git-stats-components/react'
```

## Custom Styling

### Both Frameworks (Same CSS)

```css
/* Override CSS variables */
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

## SSR/SSG Support

### Vue 3 (Nuxt)

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
	modules: ['vue-git-stats/nuxt'], // If you create a Nuxt module

	// Or manual import
	build: {
		transpile: ['vue-git-stats'],
	},
})
```

### React (Next.js)

```tsx
// app/page.tsx
'use client' // Mark as client component

import { ContributionGraph } from '@git-stats-components/react'
```

## Key Differences

| Aspect              | Vue 3         | React                |
| ------------------- | ------------- | -------------------- |
| **Prop naming**     | kebab-case    | camelCase            |
| **Events**          | `@event-name` | `onEventName`        |
| **Refs**            | `ref()`       | `useState()`         |
| **Computed**        | `computed()`  | `useMemo()`          |
| **Effects**         | `watch()`     | `useEffect()`        |
| **Lifecycle**       | `onMounted()` | `useEffect()`        |
| **Slots**           | `<slot>`      | `children` prop      |
| **Two-way binding** | `v-model`     | `value` + `onChange` |

## Migration from Vue to React

If you're switching frameworks:

**Vue:**

```vue
<ContributionGraph
	data-url="/data/git-stats.json"
	:profile-index="0"
	color-scheme="green"
	@day-click="handleDayClick"
/>
```

**React equivalent:**

```tsx
<ContributionGraph
	dataUrl="/data/git-stats.json"
	profileIndex={0}
	colorScheme="green"
	onDayClick={handleDayClick}
/>
```

Just change:

1. ✅ `data-url` → `dataUrl`
2. ✅ `:profile-index` → `profileIndex`
3. ✅ `color-scheme` → `colorScheme`
4. ✅ `@day-click` → `onDayClick`

## Core Package (Framework-Agnostic)

Both Vue and React use the same core:

```typescript
import {
	generateDummyStats,
	fetchGitStats,
	formatLastUpdated,
	getContributionLevel,
	calculateYearsExperience,
} from 'vue-git-stats' // or '@git-stats-components/react'

// These utilities work the same in both frameworks
const dummyData = generateDummyStats()
const level = getContributionLevel(5)
const years = calculateYearsExperience(experienceData)
```

## Best Practices

### Vue 3

- Use `<script setup>` for cleaner code
- Leverage `v-model` for two-way binding
- Use `computed()` for derived state
- Prefer `ref()` over `reactive()` for primitives

### React

- Use hooks (`useState`, `useEffect`, `useMemo`)
- Memoize expensive computations with `useMemo`
- Memoize callbacks with `useCallback`
- Use TypeScript for better DX

## Performance

Both implementations:

- ✅ Use the same efficient core logic
- ✅ Lazy load data on mount
- ✅ Cache results in localStorage
- ✅ Minimize re-renders/re-computations
- ✅ Handle large datasets (53 weeks \* 365 days)

---

**The API is intentionally similar across frameworks to make switching easy!**
