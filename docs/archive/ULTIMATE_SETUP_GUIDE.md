# 🚀 Ultimate Multi-Framework Setup Guide

Complete guide to setting up Vue, React, and Svelte packages from scratch.

## 📦 What You're Building

A complete monorepo with **4 packages**:

1. **@git-stats-components/core** - Framework-agnostic logic
2. **vue-git-stats** - Vue 3 components
3. **@git-stats-components/react** - React components
4. **@git-stats-components/svelte** - Svelte components

## 🎯 Final Structure

```
git-stats-components/
├── packages/
│   ├── core/                  ← Framework-agnostic
│   ├── vue/                   ← Vue 3
│   ├── react/                 ← React
│   └── svelte/                ← Svelte
├── examples/
│   ├── vue-example/           ← Vue demo app
│   └── react-example/         ← React demo app
├── cli/                       ← CLI tool (unchanged)
├── templates/                 ← Config templates (unchanged)
└── package.json               ← Root monorepo config
```

## ⚡ Quick Start (30 commands)

```bash
# 1. Clean up
rm -rf packages/ dist/

# 2. Create all directories
mkdir -p packages/core/src
mkdir -p packages/vue/src/{components,composables,styles}
mkdir -p packages/react/src/{components,hooks}
mkdir -p packages/svelte/src
mkdir -p examples/{vue-example,react-example}

# 3. Copy ALL artifact files (see detailed guide below)

# 4. Install & build
npm install
npm run build

# 5. Done! 🎉
```

## 📋 Complete File List

### Core Package (3 files)

- [ ] `packages/core/src/index.ts` → Artifact: "Core Package Files"
- [ ] `packages/core/package.json` → Artifact: "packages/core/package.json"
- [ ] `packages/core/tsconfig.json` → Artifact: "packages/core/tsconfig.json"

### Vue Package (8 files)

- [ ] `packages/vue/src/index.ts` → Artifact: "packages/vue/src/index.ts"
- [ ] `packages/vue/src/composables/useGitStats.ts` → Artifact: "packages/vue/src/composables/useGitStats.ts"
- [ ] `packages/vue/src/components/ContributionGraph.vue` → Artifact: "packages/vue/src/components/ContributionGraph.vue"
- [ ] `packages/vue/src/components/StatsBreakdown.vue` → Artifact: "packages/vue/src/components/StatsBreakdown.vue"
- [ ] `packages/vue/src/styles/index.css` → Artifact: "packages/vue/src/styles/index.css"
- [ ] `packages/vue/package.json` → Artifact: "packages/vue/package.json"
- [ ] `packages/vue/vite.config.ts` → Artifact: "packages/vue/vite.config.ts"
- [ ] `packages/vue/tsconfig.json` → Artifact: "packages/vue/tsconfig.json"

### React Package (11 files)

- [ ] `packages/react/src/index.ts` → Artifact: "packages/react/src/index.ts"
- [ ] `packages/react/src/hooks/useGitStats.ts` → Artifact: "packages/react/src/hooks/useGitStats.ts"
- [ ] `packages/react/src/components/ContributionGraph.tsx` → Artifact: "packages/react/src/components/ContributionGraph.tsx"
- [ ] `packages/react/src/components/ContributionGraph.css` → Artifact: "packages/react/src/components/ContributionGraph.css"
- [ ] `packages/react/src/components/StatsBreakdown.tsx` → Artifact: "packages/react/src/components/StatsBreakdown.tsx"
- [ ] `packages/react/src/components/StatsBreakdown.css` → Artifact: "packages/react/src/components/StatsBreakdown.css"
- [ ] `packages/react/src/components/styles.css` → Artifact: "packages/react/src/components/styles.css"
- [ ] `packages/react/package.json` → Artifact: "packages/react/package.json"
- [ ] `packages/react/vite.config.ts` → Artifact: "packages/react/vite.config.ts"
- [ ] `packages/react/tsconfig.json` → Artifact: "packages/react/tsconfig.json"
- [ ] `packages/react/README.md` → Artifact: "packages/react/README.md"

### Svelte Package (6 files)

- [ ] `packages/svelte/src/index.ts` → Artifact: "packages/svelte/src/index.ts"
- [ ] `packages/svelte/src/ContributionGraph.svelte` → Artifact: "packages/svelte/src/ContributionGraph.svelte"
- [ ] `packages/svelte/src/StatsBreakdown.svelte` → Artifact: "packages/svelte/src/StatsBreakdown.svelte"
- [ ] `packages/svelte/package.json` → Artifact: "packages/svelte/package.json"
- [ ] `packages/svelte/vite.config.ts` → Artifact: "packages/svelte/vite.config.ts"
- [ ] `packages/svelte/tsconfig.json` → Artifact: "packages/svelte/tsconfig.json"
- [ ] `packages/svelte/README.md` → Artifact: "packages/svelte/README.md"

### Root Config (1 file)

- [ ] `package.json` → Artifact: "package.json (root)" (UPDATED with Svelte)

### Examples (2 files - optional but recommended)

- [ ] `examples/vue-example/App.vue` → Artifact: "examples/vue-example/App.vue"
- [ ] `examples/react-example/App.tsx` → Artifact: "examples/react-example/App.tsx"
- [ ] `examples/react-example/App.css` → Artifact: "examples/react-example/App.css"

**Total: 34 files to create**

## 🔨 Build Order

```bash
# ALWAYS build in this order (dependencies matter!)
npm run build:core      # Must be first
npm run build:vue       # Depends on core
npm run build:react     # Depends on core
npm run build:svelte    # Depends on core

# Or build all at once
npm run build
```

## ✅ Verification Steps

After building, verify each package:

### Core Package

```bash
ls packages/core/dist/
# Should see: index.js, index.d.ts, index.d.ts.map
```

### Vue Package

```bash
ls packages/vue/dist/
# Should see: vue-git-stats.es.js, vue-git-stats.umd.js, index.d.ts, style.css
```

### React Package

```bash
ls packages/react/dist/
# Should see: react.es.js, react.umd.js, index.d.ts, style.css
```

### Svelte Package

```bash
ls packages/svelte/dist/
# Should see: index.js, index.d.ts, ContributionGraph.svelte, StatsBreakdown.svelte
```

## 📚 Usage Examples

### Vue 3

```bash
npm install vue-git-stats
```

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

```bash
npm install @git-stats-components/react
```

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

### Svelte

```bash
npm install @git-stats-components/svelte
```

```svelte
<script>
  import { ContributionGraph, StatsBreakdown } from '@git-stats-components/svelte'
</script>

<ContributionGraph dataUrl="/data/git-stats.json" />
<StatsBreakdown dataUrl="/data/git-stats.json" />
```

## 🎨 Key Differences Between Frameworks

| Feature       | Vue           | React         | Svelte      |
| ------------- | ------------- | ------------- | ----------- |
| **Props**     | kebab-case    | camelCase     | camelCase   |
| **Events**    | `@event`      | `onEvent`     | `on:event`  |
| **State**     | `ref()`       | `useState()`  | `let`       |
| **Computed**  | `computed()`  | `useMemo()`   | `$:`        |
| **Lifecycle** | `onMounted()` | `useEffect()` | `onMount()` |
| **Slots**     | `<slot>`      | `children`    | `<slot>`    |

## 🚀 Publishing to npm

When ready to publish:

```bash
# 1. Build all packages
npm run build

# 2. Test with npm pack
cd packages/core && npm pack
cd ../vue && npm pack
cd ../react && npm pack
cd ../svelte && npm pack

# 3. Publish (when ready)
cd packages/core && npm publish --access public
cd ../vue && npm publish
cd ../react && npm publish --access public
cd ../svelte && npm publish --access public
```

## 📊 Package Sizes (Estimated)

| Package | Size (gzipped) |
| ------- | -------------- |
| Core    | ~5 KB          |
| Vue     | ~8 KB          |
| React   | ~8 KB          |
| Svelte  | ~7 KB          |

## 🎯 Features Comparison

All packages support:

- ✅ TypeScript
- ✅ Contribution heatmap
- ✅ Stats breakdown
- ✅ Multiple color schemes
- ✅ Custom styling
- ✅ Multiple platforms (GitHub, GitLab, Bitbucket)
- ✅ Offline fallback
- ✅ Browser caching
- ✅ Responsive design
- ✅ SSR compatible

## 🐛 Troubleshooting

### "Cannot find module '@git-stats-components/core'"

**Solution:** Build core first: `npm run build:core`

### Workspace dependency errors

**Solution:** `npm install` from root

### Type errors

**Solution:** Check tsconfig.json references

### Svelte package errors

**Solution:** Make sure `@sveltejs/package` is installed

### Build fails

1. `npm run clean`
2. `npm run build:core`
3. `npm run build` (all others)

## 📈 Next Steps

1. ✅ **Test locally** - Use `npm link` in each package
2. ✅ **Create examples** - Vue, React, Svelte demos
3. ✅ **Write docs** - Update main README
4. ✅ **Add CI/CD** - GitHub Actions for automated publishing
5. ✅ **Publish v1.0.0** - To npm registry

## 🎉 Success Criteria

You're done when:

- [ ] All 4 packages build without errors
- [ ] All dist folders exist with expected files
- [ ] No TypeScript errors: `npm run type-check`
- [ ] Tests pass (after updating imports): `npm test`
- [ ] Can import from each package in examples
- [ ] Components render in browser

## 💡 Pro Tips

1. **Development:** Run `npm run dev:core` + `npm run dev:vue` simultaneously for hot reload

2. **Testing:** Link packages locally before publishing:

    ```bash
    cd packages/vue
    npm link
    cd ~/my-test-project
    npm link vue-git-stats
    ```

3. **Versioning:** Use [Changesets](https://github.com/changesets/changesets) for managing versions across packages

4. **Documentation:** Add JSDoc comments to exported functions for better IDE autocomplete

5. **Bundle size:** Check with `npm run build && ls -lh packages/*/dist/*.js`

## 🌟 What You've Accomplished

You now have:

- ✅ **4 production-ready packages**
- ✅ **Framework-agnostic core**
- ✅ **Full TypeScript support**
- ✅ **Professional monorepo structure**
- ✅ **Example projects**
- ✅ **Comprehensive documentation**
- ✅ **Ready to publish to npm**

## 📞 Need Help?

- 📖 Check other markdown files (FRAMEWORK_COMPARISON.md, etc.)
- 🐛 Review troubleshooting section above
- 💬 Open an issue on GitHub

---

**Estimated setup time: 1-2 hours** (most of it is copy-pasting!)

Good luck! You're building something awesome! 🚀
