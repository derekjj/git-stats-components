# Quick Setup & Cleanup Steps

## 🎯 Goal
Clean up old single-package structure and get working demos for all frameworks.

## ⚡ Fast Track (10 minutes)

### Step 1: Cleanup Old Files (2 min)

```bash
# Make cleanup script executable
chmod +x scripts/cleanup.sh scripts/serve-demos.js

# Run cleanup
./scripts/cleanup.sh

# What this removes:
# - src/ (moved to packages/)
# - tests/ (now per-package)
# - demo/ (replaced by examples/)
# - Old config files (vite.config.ts, vitest.config.js, etc.)
```

### Step 2: Update Files (3 min)

Copy the following files from the artifacts I provided:

**New Files:**
1. `examples/index.html` - Demo homepage
2. `examples/vue-demo/index.html` - Vue demo
3. `examples/react-demo/index.html` - React demo
4. `scripts/serve-demos.js` - Demo server
5. `scripts/cleanup.sh` - Cleanup script

**Updated Files:**
1. `package.json` - Root package.json with demo scripts
2. `README.md` - Updated main README

### Step 3: Build Everything (3 min)

```bash
# Install dependencies (if needed)
pnpm install

# Build all packages
pnpm build
```

Expected output:
```
✓ Built @git-stats-components/core
✓ Built @git-stats-components/vue
✓ Built @git-stats-components/react
✓ Built @git-stats-components/svelte
```

### Step 4: Test Demos (2 min)

```bash
# Start demo server
pnpm demo

# Should see:
# 🚀 Git Stats Components Demo Server
# Running at: http://localhost:3000
```

Open in browser:
- http://localhost:3000 - Homepage with all demos
- http://localhost:3000/examples/vue-demo/ - Vue demo
- http://localhost:3000/examples/react-demo/ - React demo

## ✅ Verification Checklist

After setup, verify:

- [ ] Old files removed (src/, tests/, demo/)
- [ ] All packages build successfully
- [ ] Demo server starts without errors
- [ ] Vue demo works in browser
- [ ] React demo works in browser
- [ ] Homepage shows all three frameworks
- [ ] Contribution graphs render
- [ ] Stats show numbers (not loading spinners)

## 🎨 What Each Demo Should Show

### Vue Demo
- ✅ Contribution heatmap (53 weeks)
- ✅ Stats cards (years, projects, commits, coffee)
- ✅ Clickable days (alerts on click)
- ✅ Settings dropdown (color scheme)
- ✅ "⚠️ Using dummy data for testing" badge

### React Demo
- ✅ Same features as Vue
- ✅ React-style prop names (camelCase)
- ✅ Event handlers work (onDayClick)

## 🐛 Troubleshooting

### Demo shows blank page
**Problem:** Packages not built  
**Solution:** `pnpm build`

### "Cannot find module" errors
**Problem:** Dependencies not installed  
**Solution:** `pnpm install`

### Demo shows "404 Not Found"
**Problem:** Wrong URL or server not started  
**Solution:** Make sure to use http://localhost:3000 (not file://)

### Components show "Using sample data"
**Expected!** The demos use dummy data. This is normal.

### React demo shows console errors
**Check:** Make sure react.umd.js exists in packages/react/dist/

### Styles not applied
**Problem:** CSS not loading  
**Solution:** Check that style.css exists in dist/ folders

## 📁 File Locations Reference

```
git-stats-components/
├── examples/
│   ├── index.html              ← Homepage
│   ├── vue-demo/
│   │   └── index.html          ← Vue demo
│   └── react-demo/
│       └── index.html          ← React demo
│
├── scripts/
│   ├── serve-demos.js          ← Demo server
│   └── cleanup.sh              ← Cleanup script
│
├── packages/
│   ├── core/dist/
│   │   └── index.js            ← Should exist after build
│   ├── vue/dist/
│   │   ├── vue/vue.es.js ← Vue bundle
│   │   └── style.css           ← Vue styles
│   ├── react/dist/
│   │   ├── react.es.js         ← React ESM bundle
│   │   ├── react.umd.js        ← React UMD bundle (for demos)
│   │   └── style.css           ← React styles
│   └── svelte/dist/
│       └── index.js            ← Svelte bundle
│
└── data/
    └── dummy-git-stats.json    ← Demo data
```

## 🚀 Next Steps

After demos work:

1. **Update package versions** for initial publish
   ```bash
   # Update version in each package.json to 1.0.0
   # This will be your first official release
   ```

2. **Publish to npm** (when ready)
   ```bash
   cd packages/core
   npm version 1.0.0
   npm publish --access public
   
   cd ../vue
   npm version 1.0.0
   npm publish
   
   cd ../react
   npm version 1.0.0
   npm publish --access public
   
   cd ../svelte
   npm version 1.0.0
   npm publish --access public
   ```

3. **Update documentation**
   - Add screenshots to README
   - Record demo GIF/video
   - Update CHANGELOG

## 💡 Tips

- **Hot reload during dev:** Use `pnpm dev:vue` or `pnpm dev:react`
- **Clean everything:** `pnpm cleanup:deep` (removes node_modules too)
- **Test production build:** `pnpm build && pnpm demo`
- **Check bundle sizes:** `ls -lh packages/*/dist/*.js`

## 📊 Expected Bundle Sizes

After build:

```
core:   ~15 KB (index.js)
vue:    ~25 KB (vue/vue.es.js)
react:  ~25 KB (react.es.js)
svelte: ~20 KB (index.js)
```

Plus ~8 KB for each style.css

## 🎉 Success!

If all demos work, you're ready to:
- ✅ Commit changes
- ✅ Push to GitHub
- ✅ Publish packages
- ✅ Share with the world!

---

**Need help?** Open an issue or check the full documentation in `/docs`