# Step-by-Step Migration Guide

Follow these steps in order to migrate to the monorepo structure.

## Prerequisites

- Node.js 18+
- npm (comes with Node.js)
- Your git repository cloned

## Step 1: Clean Up (5 minutes)

```bash
# Remove broken packages structure
rm -rf packages/

# Remove old src files we'll move
rm -rf src/types
rm -rf src/components
rm -rf src/composables
rm -rf src/utils

# Clean dist
rm -rf dist/
```

## Step 2: Create Directory Structure (1 minute)

```bash
mkdir -p packages/core/src
mkdir -p packages/vue/src/components
mkdir -p packages/vue/src/composables
mkdir -p packages/vue/src/styles
```

## Step 3: Create Core Package Files (10 minutes)

### Create `packages/core/src/index.ts`

Copy the content from artifact **"Core Package Files"**

### Create `packages/core/package.json`

Copy the content from artifact **"packages/core/package.json"**

### Create `packages/core/tsconfig.json`

Copy the content from artifact **"packages/core/tsconfig.json"**

## Step 4: Create Vue Package Files (15 minutes)

### Create `packages/vue/src/index.ts`

Copy the content from artifact **"packages/vue/src/index.ts"**

### Create `packages/vue/src/composables/useGitStats.ts`

Copy the content from artifact **"packages/vue/src/composables/useGitStats.ts"**

### Create `packages/vue/src/components/ContributionGraph.vue`

Copy the content from artifact **"packages/vue/src/components/ContributionGraph.vue"**

### Create `packages/vue/src/components/StatsBreakdown.vue`

Copy the content from artifact **"packages/vue/src/components/StatsBreakdown.vue"**

### Create `packages/vue/src/styles/index.css`

Copy the content from artifact **"packages/vue/src/styles/index.css"**

### Create `packages/vue/package.json`

Copy the content from artifact **"packages/vue/package.json"**

### Create `packages/vue/vite.config.ts`

Copy the content from artifact **"packages/vue/vite.config.ts"**

### Create `packages/vue/tsconfig.json`

Copy the content from artifact **"packages/vue/tsconfig.json"**

## Step 5: Update Root Package.json (2 minutes)

Replace your root `package.json` with the content from artifact **"package.json (root)"**

## Step 6: Install Dependencies (2 minutes)

```bash
# From the root directory
npm install
```

This will:

- Install all dependencies for all workspaces
- Link the packages together (Vue will use local Core)

## Step 7: Build Packages (2 minutes)

```bash
# Build core first (Vue depends on it)
npm run build:core

# Then build Vue
npm run build:vue
```

You should see:

```
packages/core/dist/
  ├── index.js
  ├── index.d.ts
  └── index.d.ts.map

packages/vue/dist/
  ├── vue-git-stats.es.js
  ├── vue-git-stats.umd.js
  ├── index.d.ts
  └── style.css
```

## Step 8: Update Tests (10 minutes)

Your existing tests need minor updates to import from the new structure.

### Update test imports

**Before:**

```typescript
import { generateDummyStats } from '../../src/utils/generateDummyData'
import { useGitStats } from '../../src/composables/useGitStats'
```

**After:**

```typescript
import { generateDummyStats } from 'vue-git-stats'
import { useGitStats } from 'vue-git-stats'
```

### Run tests

```bash
npm test
```

## Step 9: Update Demo (Optional, 5 minutes)

If you want to update the demo to use the built packages:

**demo/index.html:**

```html
<script type="module">
	// Change from:
	import VueGitStats from '../dist/vue-git-stats.es.js'

	// To:
	import VueGitStats from '../packages/vue/dist/vue-git-stats.es.js'
</script>
```

## Step 10: Verify Everything Works

### Check builds

```bash
ls -la packages/core/dist/
ls -la packages/vue/dist/
```

### Run tests

```bash
npm test
```

### Check types

```bash
npm run type-check
```

### Try the demo

```bash
npm run demo
```

## Troubleshooting

### "Cannot find module '@git-stats-components/core'"

**Solution:** Make sure you've built the core package first:

```bash
npm run build:core
```

### "workspace dependency not found"

**Solution:** Run npm install from the root:

```bash
npm install
```

### Type errors in Vue components

**Solution:** Check that the tsconfig.json references are correct:

```json
"references": [
  { "path": "../core" }
]
```

### Tests failing

**Solution:** Update import paths in test files to use the package names:

```typescript
import { generateDummyStats } from 'vue-git-stats'
```

## What You Now Have

✅ **Clean separation**: Core is framework-agnostic  
✅ **Monorepo structure**: All packages in one repo  
✅ **Workspace setup**: Packages link automatically  
✅ **Type safety**: Full TypeScript support  
✅ **Build system**: Separate builds for each package  
✅ **Backward compatible**: Vue package works exactly as before

## What Files Were Kept

These files remain at the root and unchanged:

- `cli/` - CLI tool
- `templates/` - Config templates
- `demo/` - Demo page
- `data/` - Dummy data
- `.prettierrc.json`
- `.gitignore`
- `README.md` (needs update)
- Other config files

## Next Steps

1. **Update README.md** - Document the new structure
2. **Update CHANGELOG** - Note the restructuring
3. **Test publishing** - Try `npm pack` in packages/vue
4. **Add React package** - Follow similar structure
5. **Add Svelte package** - Follow similar structure

## Publishing (When Ready)

```bash
# Publish core
cd packages/core
npm version patch
npm publish --access public

# Publish Vue
cd packages/vue
npm version patch
npm publish
```

## Rollback Plan

If something goes wrong, you can always:

```bash
git checkout HEAD -- .
```

Your working version is preserved in git history!

---

**Estimated Total Time: 45 minutes**

Take your time with each step and verify as you go. Good luck! 🚀
