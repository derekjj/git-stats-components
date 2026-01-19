# Migration Checklist

Print this and check off as you go!

## Phase 1: Cleanup ☐

- [ ] Run `rm -rf packages/`
- [ ] Run `rm -rf src/types src/components src/composables src/utils`
- [ ] Run `rm -rf dist/`

## Phase 2: Create Structure ☐

- [ ] Run `mkdir -p packages/core/src`
- [ ] Run `mkdir -p packages/vue/src/{components,composables,styles}`

## Phase 3: Core Package ☐

- [ ] Create `packages/core/src/index.ts`
- [ ] Create `packages/core/package.json`
- [ ] Create `packages/core/tsconfig.json`

## Phase 4: Vue Package ☐

- [ ] Create `packages/vue/src/index.ts`
- [ ] Create `packages/vue/src/composables/useGitStats.ts`
- [ ] Create `packages/vue/src/components/ContributionGraph.vue`
- [ ] Create `packages/vue/src/components/StatsBreakdown.vue`
- [ ] Create `packages/vue/src/styles/index.css`
- [ ] Create `packages/vue/package.json`
- [ ] Create `packages/vue/vite.config.ts`
- [ ] Create `packages/vue/tsconfig.json`

## Phase 5: Root Config ☐

- [ ] Update root `package.json`

## Phase 6: Build ☐

- [ ] Run `npm install`
- [ ] Run `npm run build:core`
- [ ] Run `npm run build:vue`
- [ ] Verify `packages/core/dist/` exists
- [ ] Verify `packages/vue/dist/` exists

## Phase 7: Test ☐

- [ ] Run `npm test` (may need to update imports first)
- [ ] All tests passing

## Phase 8: Commit ☐

- [ ] `git add .`
- [ ] `git commit -m "refactor: migrate to monorepo structure"`
- [ ] `git push`

## Success Criteria ✓

- [ ] Core package builds successfully
- [ ] Vue package builds successfully
- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] Demo works
- [ ] CLI still works

## Files to Create (Quick Reference)

```
packages/
├── core/
│   ├── src/
│   │   └── index.ts          ← Artifact: "Core Package Files"
│   ├── package.json          ← Artifact: "packages/core/package.json"
│   └── tsconfig.json         ← Artifact: "packages/core/tsconfig.json"
│
└── vue/
    ├── src/
    │   ├── components/
    │   │   ├── ContributionGraph.vue  ← Artifact: "packages/vue/src/components/ContributionGraph.vue"
    │   │   └── StatsBreakdown.vue     ← Artifact: "packages/vue/src/components/StatsBreakdown.vue"
    │   ├── composables/
    │   │   └── useGitStats.ts         ← Artifact: "packages/vue/src/composables/useGitStats.ts"
    │   ├── styles/
    │   │   └── index.css              ← Artifact: "packages/vue/src/styles/index.css"
    │   └── index.ts                   ← Artifact: "packages/vue/src/index.ts"
    ├── package.json                   ← Artifact: "packages/vue/package.json"
    ├── vite.config.ts                 ← Artifact: "packages/vue/vite.config.ts"
    └── tsconfig.json                  ← Artifact: "packages/vue/tsconfig.json"

package.json (root)                    ← Artifact: "package.json (root)"
```

## Artifact Map

| File                                              | Artifact Name                                       |
| ------------------------------------------------- | --------------------------------------------------- |
| packages/core/src/index.ts                        | "Core Package Files"                                |
| packages/core/package.json                        | "packages/core/package.json"                        |
| packages/core/tsconfig.json                       | "packages/core/tsconfig.json"                       |
| packages/vue/src/index.ts                         | "packages/vue/src/index.ts"                         |
| packages/vue/src/composables/useGitStats.ts       | "packages/vue/src/composables/useGitStats.ts"       |
| packages/vue/src/components/ContributionGraph.vue | "packages/vue/src/components/ContributionGraph.vue" |
| packages/vue/src/components/StatsBreakdown.vue    | "packages/vue/src/components/StatsBreakdown.vue"    |
| packages/vue/src/styles/index.css                 | "packages/vue/src/styles/index.css"                 |
| packages/vue/package.json                         | "packages/vue/package.json"                         |
| packages/vue/vite.config.ts                       | "packages/vue/vite.config.ts"                       |
| packages/vue/tsconfig.json                        | "packages/vue/tsconfig.json"                        |
| package.json                                      | "package.json (root)"                               |

---

**Estimated time: 45 minutes**

Good luck! 🍀
