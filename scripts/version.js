#!/usr/bin/env node

/**
 * Version bumper for @git-stats-components monorepo
 * 
 * Updates version in all package.json files simultaneously
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');

const PACKAGES = [
  'packages/core',
  'packages/vue',
  'packages/react',
  'packages/svelte'
];

function readPackageJson(pkgPath) {
  const pkgJsonPath = join(ROOT_DIR, pkgPath, 'package.json');
  return JSON.parse(readFileSync(pkgJsonPath, 'utf8'));
}

function writePackageJson(pkgPath, pkgJson) {
  const pkgJsonPath = join(ROOT_DIR, pkgPath, 'package.json');
  writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, '\t') + '\n');
}

function parseVersion(version) {
  const [major, minor, patch] = version.split('.').map(Number);
  return { major, minor, patch };
}

function bumpVersion(version, type) {
  const v = parseVersion(version);
  
  switch (type) {
    case 'major':
      return `${v.major + 1}.0.0`;
    case 'minor':
      return `${v.major}.${v.minor + 1}.0`;
    case 'patch':
      return `${v.major}.${v.minor}.${v.patch + 1}`;
    default:
      throw new Error(`Invalid bump type: ${type}`);
  }
}

function updateVersions(bumpType) {
  // Get current version from core package
  const corePkg = readPackageJson('packages/core');
  const currentVersion = corePkg.version;
  const newVersion = bumpType === 'set' 
    ? process.argv[3] 
    : bumpVersion(currentVersion, bumpType);
  
  console.log(`\n📦 Updating versions: ${currentVersion} → ${newVersion}\n`);
  
  // Update all packages
  for (const pkgPath of PACKAGES) {
    const pkgJson = readPackageJson(pkgPath);
    const pkgName = pkgJson.name;
    
    pkgJson.version = newVersion;
    writePackageJson(pkgPath, pkgJson);
    
    console.log(`✅ ${pkgName}: ${newVersion}`);
  }
  
  console.log(`\n✨ All packages updated to v${newVersion}`);
  console.log('\nNext steps:');
  console.log('  1. pnpm build           # Rebuild packages');
  console.log('  2. pnpm publish:dry     # Test publish');
  console.log('  3. pnpm publish:npm     # Publish to npm');
  console.log(`  4. git tag v${newVersion}     # Tag release`);
  console.log('  5. git push --tags      # Push tags\n');
}

// Parse command line
const bumpType = process.argv[2];

if (!bumpType || ['--help', '-h'].includes(bumpType)) {
  console.log(`
Usage: node scripts/version.js <type> [version]

Bump types:
  patch    Bump patch version (1.0.0 → 1.0.1)
  minor    Bump minor version (1.0.0 → 1.1.0)
  major    Bump major version (1.0.0 → 2.0.0)
  set      Set specific version (requires version argument)

Examples:
  node scripts/version.js patch       # 1.0.0 → 1.0.1
  node scripts/version.js minor       # 1.0.0 → 1.1.0
  node scripts/version.js major       # 1.0.0 → 2.0.0
  node scripts/version.js set 2.0.0   # Set to 2.0.0

Or use npm scripts:
  pnpm version:patch
  pnpm version:minor
  pnpm version:major
  `);
  process.exit(0);
}

if (!['patch', 'minor', 'major', 'set'].includes(bumpType)) {
  console.error(`❌ Invalid bump type: ${bumpType}`);
  console.error('Valid types: patch, minor, major, set');
  process.exit(1);
}

if (bumpType === 'set' && !process.argv[3]) {
  console.error('❌ Please provide a version number');
  console.error('Example: node scripts/version.js set 2.0.0');
  process.exit(1);
}

updateVersions(bumpType);