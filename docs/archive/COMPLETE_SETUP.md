# Complete Multi-Framework Setup Guide

This guide will help you set up the complete monorepo with Core, Vue, and React packages.

## Directory Structure to Create

```
packages/
├── core/
│   ├── src/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── vue/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ContributionGraph.vue
│   │   │   └── StatsBreakdown.vue
│   │   ├── composables/
│   │   │   └── useGitStats.ts
│   │   ├── styles/
│   │   │   └── index.css
│   │   └── index.ts
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── react/
    ├── src/
    │   ├── components/
    │   │   ├── ContributionGraph.tsx
    │   │   ├── ContributionGraph.css
    │   │   ├── StatsBreakdown.tsx
    │   │   ├── StatsBreakdown.css
    │   │   └── styles.css
    │   ├── hooks/
    │   │   └── useGitStats.ts
    │   └── index.ts
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    └── README.md
```

## Step 1: Clean Up (1 minute)

```bash
# Remove old structure
rm -rf packages/ dist/ src/{types,components,composables,utils}

# Create new structure
mkdir -p packages/core/src
mkdir -p packages/vue/src/{components,composables,styles}
mkdir -p packages/react/src/{components,hooks}
```

## Step 2: Core Package (10 minutes)

### Create files:

1. `packages/core/src/index.ts` - Copy from artifact "Core Package Files"
2. `packages/core/package.json` - Copy from artifact "packages/core/package.json"
3. `packages/core/tsconfig.json` - Copy from artifact "packages/core/tsconfig.json"

## Step 3: Vue Package (15 minutes)

### Create files:

1. `packages/vue/src/index.ts` - Copy from "packages/vue/src/index.ts"
2. `packages/vue/src/composables/useGitStats.ts` - Copy from composable artifact
3. `packages/vue/src/components/ContributionGraph.vue` - Copy from component artifact
4. `packages/vue/src/components/StatsBreakdown.vue` - Copy from component artifact
5. `packages/vue/src/styles/index.css` - Copy from styles artifact
6. `packages/vue/package.json` - Copy from "packages/vue/package.json"
7. `packages/vue/vite.config.ts` - Copy from "packages/vue/vite.config.ts"
8. `packages/vue/tsconfig.json` - Copy from "packages/vue/tsconfig.json"

## Step 4: React Package (15 minutes)

### Create files:

1. `packages/react/src/index.ts` - Copy from "packages/react/src/index.ts"
2. `packages/react/src/hooks/useGitStats.ts` - Copy from hook artifact
3. `packages/react/src/components/ContributionGraph.tsx` - Copy from component artifact
4. `packages/react/src/components/ContributionGraph.css` - Copy from CSS artifact
5. `packages/react/src/components/StatsBreakdown.tsx` - Copy from component artifact
6. `packages/react/src/components/StatsBreakdown.css` - Copy from CSS artifact
7. `packages/react/src/components/styles.css` - Copy from styles artifact
8. `packages/react/package.json` - Copy from "packages/react/package.json"
9. `packages/react/vite.config.ts` - Copy from "packages/react/vite.config.ts"
10. `packages/react/tsconfig.json` - Copy from "packages/react/tsconfig.json"
11. `packages/react/README.md` - Copy from "packages/react/README.md"

## Step 5: Root Configuration (2 minutes)

Update root `package.json` with the artifact "package.json (root)"

## Step 6: Install Dependencies (3 minutes)

```bash
# From root directory
npm install
```

This will:

- Install all workspace dependencies
- Link packages together (Vue and React will use local Core)
- Set up the monorepo structure

## Step 7: Build All Packages (5 minutes)

```bash
# Build in order (Core first, then others)
npm run build:core
npm run build:vue
npm run build:react

# Or build all at once
npm run build
```

You should see:

```
packages/core/dist/
packages/vue/dist/
packages/react/dist/
```

## Step 8: Verify Builds

```bash
# Check each dist folder
ls -la packages/core/dist/
ls -la packages/vue/dist/
ls -la packages/react/dist/
```

## Step 9: Test (Optional)

Update test imports and run:

```bash
npm test
```

## Quick Artifact Reference

| Package | File                                 | Artifact Name                                         |
| ------- | ------------------------------------ | ----------------------------------------------------- |
| Core    | src/index.ts                         | "Core Package Files"                                  |
| Core    | package.json                         | "packages/core/package.json"                          |
| Core    | tsconfig.json                        | "packages/core/tsconfig.json"                         |
| Vue     | src/index.ts                         | "packages/vue/src/index.ts"                           |
| Vue     | src/composables/useGitStats.ts       | "packages/vue/src/composables/useGitStats.ts"         |
| Vue     | src/components/ContributionGraph.vue | "packages/vue/src/components/ContributionGraph.vue"   |
| Vue     | src/components/StatsBreakdown.vue    | "packages/vue/src/components/StatsBreakdown.vue"      |
| Vue     | src/styles/index.css                 | "packages/vue/src/styles/index.css"                   |
| Vue     | package.json                         | "packages/vue/package.json"                           |
| Vue     | vite.config.ts                       | "packages/vue/vite.config.ts"                         |
| Vue     | tsconfig.json                        | "packages/vue/tsconfig.json"                          |
| React   | src/index.ts                         | "packages/react/src/index.ts"                         |
| React   | src/hooks/useGitStats.ts             | "packages/react/src/hooks/useGitStats.ts"             |
| React   | src/components/ContributionGraph.tsx | "packages/react/src/components/ContributionGraph.tsx" |
| React   | src/components/ContributionGraph.css | "packages/react/src/components/ContributionGraph.css" |
| React   | src/components/StatsBreakdown.tsx    | "packages/react/src/components/StatsBreakdown.tsx"    |
| React   | src/components/StatsBreakdown.css    | "packages/react/src/components/StatsBreakdown.css"    |
| React   | src/components/styles.css            | "packages/react/src/components/styles.css"            |
| React   | package.json                         | "packages/react/package.json"                         |
| React   | vite.config.ts                       | "packages/react/vite.config.ts"                       |
| React   | tsconfig.json                        | "packages/react/tsconfig.json"                        |
| React   | README.md                            | "packages/react/README.md"                            |
| Root    | package.json                         | "package.json (root)"                                 |

## Usage Examples

### Vue

```vue
<script setup>
import { ContributionGraph, StatsBreakdown } from 'vue-git-stats'
import 'vue-git-stats/style.css'
</script>

<template>
	<ContributionGraph data-url="/data/git-stats.json" />
	<StatsBreakdown data-url="/data/git-stats.json" />
</template>
```

### React

```tsx
import { ContributionGraph, StatsBreakdown } from '@git-stats-components/react'
import '@git-stats-components/react/style.css'

function App() {
	return (
		<>
			<ContributionGraph dataUrl="/data/git-stats.json" />
			<StatsBreakdown dataUrl="/data/git-stats.json" />
		</>
	)
}
```

## Publishing (When Ready)

```bash
# Publish core
cd packages/core
npm version patch
npm publish --access public

# Publish Vue
cd ../vue
npm version patch
npm publish

# Publish React
cd ../react
npm version patch
npm publish --access public
```

## What You Now Have

✅ **3 packages**: Core (framework-agnostic), Vue, React  
✅ **Monorepo structure**: All packages in one repo  
✅ **Shared core logic**: No duplication  
✅ **Independent builds**: Each package builds separately  
✅ **Type safety**: Full TypeScript support  
✅ **Ready to publish**: Proper package structure

## Next Steps

1. **Add Svelte** (optional) - Follow similar pattern
2. **Update main README** - Document all packages
3. **Add examples** - Create example projects
4. **Test publishing** - `npm pack` in each package
5. **CI/CD** - Add GitHub Actions for automated publishing

## Troubleshooting

### "Cannot find module '@git-stats-components/core'"

Build core first: `npm run build:core`

### Workspace dependency errors

Run: `npm install` from root

### Type errors

Check tsconfig.json references are correct

### Build fails

1. Clean: `npm run clean`
2. Rebuild core: `npm run build:core`
3. Rebuild others: `npm run build:vue && npm run build:react`

---

**Total time: ~50 minutes**

Good luck! 🚀
