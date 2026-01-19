### TODO

- [X]add demo data or way to generate it
- [X]Bitbucket
- [X]add tests
- [X]TypeScript
- [ ]Get feedback

## Notes

### Completed

- ✅ Demo data generation with `generateDummyStats()` utility
- ✅ Bitbucket support added with full API integration
    - Username/App Password authentication
    - Repository and commit counting
    - Workflow generation in CLI
- ✅ Comprehensive test suite with Vitest
    - 3 component tests (ContributionGraph, StatsBreakdown)
    - 1 composable test (useGitStats)
    - 1 utility test (generateDummyData)
    - Coverage reporting configured
    - Test UI support
- ✅ Full TypeScript conversion
    - All source files converted to .ts/.vue with <script setup lang="ts">
    - Comprehensive type definitions exported
    - Type declarations generated on build
    - Type-safe props, emits, and composables
    - vue-tsc integration for type checking

### Next Steps

1. **Get Feedback** - Publish v0.2.0 with:
    - Bitbucket support
    - Full test coverage
    - TypeScript types
    - Updated documentation
2. **CI/CD** - Add GitHub Actions for automated testing and type checking
3. **Marketing** - Share on Reddit, Dev.to, Twitter, etc.


TODO:
new conversion
sync with the repo and show the source repo

prompt:
trying to make my new project git-stats-components
support many langs when I started with my repo vue-git-stats
https://github.com/derekjj/vue-git-stats that is also an npm lib

I am not sure what has broken full
- I just know the demos aren't showing any working components for each language
- there probably has been many errors
(with the mass replacement of files during the move)

the goal is to make everything work and make everything feel the same and look with same for each language
- where code duplication is low and the new npm is almost as easy to use

I think there still maybe artifacts sticking around

the project will still need to be able to be published to npm, so I am wondering if my use of pnpm will break anything or bloat the code