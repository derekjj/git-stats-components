# git-stats-components

> Beautiful GitHub/GitLab/Bitbucket contribution graphs for Vue 3, React, and Svelte

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎯 Multi-Framework Support

This is a **monorepo** containing framework-specific packages:

| Package | Framework | Status |
|---------|-----------|--------|
| **vue-git-stats** | Vue 3 | ✅ Ready |
| **@git-stats-components/react** | React | ✅ Ready |
| **@git-stats-components/svelte** | Svelte | ✅ Ready |
| **@git-stats-components/core** | Agnostic | ✅ Ready |

## ✨ Features

- 🎨 **Multiple Platforms** - GitHub, GitLab, Bitbucket
- 🎯 **Framework-Agnostic Core** - Shared logic across all packages
- ⚡ **Zero Runtime API Calls** - Static data via GitHub Actions
- 🛡️ **Multi-Tier Fallback** - Static → Cache → Mock data
- 📱 **Responsive** - Mobile-friendly with touch support
- 🎨 **Customizable** - Multiple color schemes and slots
- 🔧 **Type Safe** - Full TypeScript support
- 🧪 **Well Tested** - Comprehensive test coverage

## 🚀 Quick Start

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

[Full Vue Documentation →](./packages/vue/README.md)

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

[Full React Documentation →](./packages/react/README.md)

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

[Full Svelte Documentation →](./packages/svelte/README.md)

## 🎨 Live Demos

Want to see it in action? Clone this repo and run:

```bash
pnpm install
pnpm build
pnpm demo
```

Then visit http://localhost:3000 to see demos for all frameworks!

## 📦 Monorepo Structure

```
git-stats-components/
├── packages/
│   ├── core/           # Framework-agnostic logic
│   ├── vue/            # Vue 3 components
│   ├── react/          # React components
│   └── svelte/         # Svelte components
├── examples/           # Live demos
│   ├── vue-demo/
│   ├── react-demo/
│   └── svelte-demo/
├── cli/                # CLI initialization tool
└── templates/          # Config templates
```

## 🔧 Development

### Prerequisites

- Node.js 18+
- pnpm 8+

### Setup

```bash
# Clone the repo
git clone https://github.com/derekjj/git-stats-components.git
cd vue-git-stats

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Start demo server
pnpm demo
```

### Build Commands

```bash
# Build all packages
pnpm build

# Build specific package
pnpm build:core
pnpm build:vue
pnpm build:react
pnpm build:svelte

# Development (watch mode)
pnpm dev:vue
pnpm dev:react
pnpm dev:svelte
```

### Testing

```bash
# Run all tests
pnpm test

# Run specific package tests
pnpm test:core
pnpm test:vue
pnpm test:react
pnpm test:svelte
```

## 📚 Documentation

- [Framework Comparison Guide](./docs/FRAMEWORK_COMPARISON.md) - Detailed comparison of Vue, React, and Svelte usage
- [Testing Guide](./docs/guides/TESTING.md) - How to test with dummy data
- [TypeScript Guide](./docs/guides/typescript.md) - Full TypeScript usage

## 🎯 How It Works

1. **GitHub Actions** fetches your stats daily (or on-demand)
2. **Static JSON file** is generated and committed to your repo
3. **Components load** from the static file (fast, reliable)
4. **Fallback system** ensures it always works (cache → mock data)

### Why This Approach?

- ✅ **No runtime API calls** - Visitors never hit rate limits
- ✅ **Fast loading** - Static file loads instantly
- ✅ **Never breaks** - Always has fallback data
- ✅ **Free tier friendly** - One API call per day vs thousands
- ✅ **Works offline** - Can develop with cached/mock data

## 🛠️ CLI Tool

Initialize in your project:

```bash
npx vue-git-stats init
```

This creates:
- `git-stats.config.js` - Configuration file
- `.github/workflows/update-git-stats.yml` - GitHub Actions workflow
- `public/data/` - Directory for stats data

## 🔑 Platform Support

| Platform | Contribution Graph | Project Count | Commit Count |
|----------|-------------------|---------------|--------------|
| GitHub | ✅ | ✅ | ✅ |
| GitLab | ❌* | ✅ | ✅ |
| Bitbucket | ❌* | ✅ | ✅ |

*GitLab and Bitbucket APIs don't provide contribution graph data

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md).

### Code of Conduct

Be respectful, inclusive, and constructive.

## 📄 License

MIT © Derek Johnston

## 🙏 Support

- 🐛 [Report a bug](https://github.com/derekjj/git-stats-components/issues)
- 💡 [Request a feature](https://github.com/derekjj/git-stats-components/issues)
- ⭐ [Star the repo](https://github.com/derekjj/git-stats-components)

---

Made with ❤️ for developers, by developers