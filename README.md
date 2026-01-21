# git-stats-components

> Beautiful contribution graphs for Vue 3, React, and Svelte-powered by GitHub, GitLab, and Bitbucket

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![Git Stats Components](./screenshot-black.png)

## Features

- 🎨 **Multi-Platform** - GitHub, GitLab, and Bitbucket support
- ⚡ **Zero Runtime API Calls** - Static data via GitHub Actions
- 🛡️ **Always Works** - Multi-tier fallback system (static → cache → mock)
- 📱 **Responsive** - Mobile-friendly with touch support
- 🎯 **Framework-Agnostic Core** - Shared logic across all packages
- 🎨 **Customizable** - Multiple color schemes and component slots
- 🔧 **Type Safe** - Full TypeScript support
- 🧪 **Well Tested** - Comprehensive test coverage

## Packages

| Package | Framework | Status |
|---------|-----------|--------|
| [@git-stats-components/vue](./packages/vue) | Vue 3 | [![npm](https://img.shields.io/npm/v/@git-stats-components/vue.svg)](https://www.npmjs.com/package/@git-stats-components/vue) |
| [@git-stats-components/react](./packages/react) | React | [![npm](https://img.shields.io/npm/v/@git-stats-components/react.svg)](https://www.npmjs.com/package/@git-stats-components/react) |
| [@git-stats-components/svelte](./packages/svelte) | Svelte | [![npm](https://img.shields.io/npm/v/@git-stats-components/svelte.svg)](https://www.npmjs.com/package/@git-stats-components/svelte) |
| [@git-stats-components/core](./packages/core) | Agnostic | [![npm](https://img.shields.io/npm/v/@git-stats-components/core.svg)](https://www.npmjs.com/package/@git-stats-components/core) |

## Quick Start

### Vue 3

```bash
npm install @git-stats-components/vue
```

```vue
<script setup>
import { ContributionGraph, StatsBreakdown } from '@git-stats-components/vue'
import '@git-stats-components/vue/style.css'
</script>

<template>
  <ContributionGraph data-url="/data/git-stats.json" />
  <StatsBreakdown data-url="/data/git-stats.json" />
</template>
```

[📖 Vue Documentation](./packages/vue/README.md)

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

[📖 React Documentation](./packages/react/README.md)

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

[📖 Svelte Documentation](./packages/svelte/README.md)

## How It Works

1. **GitHub Actions** fetches your stats daily (or on-demand)
2. **Static JSON file** is generated and committed to your repo
3. **Components load** from the static file (fast & reliable)
4. **Fallback system** ensures it always works (cache → mock data)

### Why This Approach?

- ✅ **No runtime API calls** - Visitors never hit rate limits
- ✅ **Fast loading** - Static file loads instantly
- ✅ **Never breaks** - Always has fallback data
- ✅ **Free tier friendly** - One API call per day vs thousands
- ✅ **Works offline** - Can develop with cached/mock data

## Setup

The easiest way to get started is using the CLI tool:

```bash
# Install your framework package
npm install @git-stats-components/vue

# Initialize config and GitHub Actions
npx @git-stats-components/vue init
```

This creates:
- `git-stats.config.js` - Configuration file
- `.github/workflows/update-git-stats.yml` - GitHub Actions workflow
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

Go to **Settings → Secrets and variables → Actions** and add:
- `GITHUB_TOKEN` - Your GitHub Personal Access Token
- `GITLAB_TOKEN` - (Optional) Your GitLab access token
- `BITBUCKET_TOKEN` - (Optional) Your Bitbucket app password

That's it! The GitHub Action will fetch your stats daily.

## Live Demo

Want to see it in action? Clone this repo and run:

```bash
pnpm install
pnpm build
pnpm demo
```

Then visit http://localhost:3000

## Platform Support

| Platform | Contribution Graph | Stats |
|----------|-------------------|-------|
| GitHub | ✅ | ✅ |
| GitLab | ❌* | ✅ |
| Bitbucket | ❌* | ✅ |

*GitLab and Bitbucket APIs don't provide contribution graph data

## Development

### Prerequisites

- Node.js 18+
- pnpm 8+

### Setup

```bash
git clone https://github.com/derekjj/git-stats-components.git
cd git-stats-components
pnpm install
pnpm build
```

### Commands

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

# Run tests
pnpm test
```

## Contributing

Contributions are welcome! Please see our [Contributing Guide](./CONTRIBUTING.md).

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `pnpm test`
5. Build packages: `pnpm build`
6. Commit: `git commit -m 'feat: add amazing feature'`
7. Push: `git push origin feature/amazing-feature`
8. Open a Pull Request

## License

MIT © [Derek Johnston](https://derekjohnston.ca/)

## Links

- [GitHub Repository](https://github.com/derekjj/git-stats-components)
- [Report a Bug](https://github.com/derekjj/git-stats-components/issues/new?labels=bug)
- [Request a Feature](https://github.com/derekjj/git-stats-components/issues/new?labels=enhancement)

---

Made with ❤️ by developers, for developers