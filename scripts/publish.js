#!/usr/bin/env node

/**
 * Publish script for @git-stats-components monorepo
 * 
 * This script:
 * 1. Validates all packages are built
 * 2. Temporarily replaces workspace:* with actual versions
 * 3. Publishes to npm with correct access levels
 * 4. Restores workspace:* references
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');

// Package configuration
const PACKAGES = [
  { name: 'core', path: 'packages/core', access: 'public' },
  { name: 'vue', path: 'packages/vue', access: 'public' },
  { name: 'react', path: 'packages/react', access: 'public' },
  { name: 'svelte', path: 'packages/svelte', access: 'public' }
];

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

function exec(cmd, cwd = ROOT_DIR) {
  try {
    return execSync(cmd, { cwd, encoding: 'utf8', stdio: 'pipe' });
  } catch (error) {
    return null;
  }
}

function readPackageJson(pkgPath) {
  const pkgJsonPath = join(ROOT_DIR, pkgPath, 'package.json');
  return JSON.parse(readFileSync(pkgJsonPath, 'utf8'));
}

function writePackageJson(pkgPath, pkgJson) {
  const pkgJsonPath = join(ROOT_DIR, pkgPath, 'package.json');
  writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, '\t') + '\n');
}

// Check if user is logged in to npm
function checkNpmAuth() {
  log('\n📋 Checking npm authentication...', 'cyan');
  const whoami = exec('npm whoami');
  
  if (!whoami) {
    log('❌ Not logged in to npm. Please run: npm login', 'red');
    process.exit(1);
  }
  
  log(`✅ Logged in as: ${whoami.trim()}`, 'green');
}

// Validate all packages are built
function validateBuilds() {
  log('\n🔍 Validating package builds...', 'cyan');
  let hasErrors = false;

  for (const pkg of PACKAGES) {
    const distPath = join(ROOT_DIR, pkg.path, 'dist');
    
    if (!existsSync(distPath)) {
      log(`❌ ${pkg.name}: dist/ folder not found`, 'red');
      hasErrors = true;
    } else {
      log(`✅ ${pkg.name}: build found`, 'green');
    }
  }

  if (hasErrors) {
    log('\n❌ Some packages are not built. Run: pnpm build', 'red');
    process.exit(1);
  }
}

// Get the version we're publishing
function getPublishVersion() {
  const corePkg = readPackageJson('packages/core');
  return corePkg.version;
}

// Replace workspace:* with actual version
function replaceWorkspaceDeps(pkgJson, version) {
  const modified = { ...pkgJson };
  
  if (modified.dependencies) {
    for (const [dep, ver] of Object.entries(modified.dependencies)) {
      if (ver === 'workspace:*') {
        modified.dependencies[dep] = `^${version}`;
      }
    }
  }
  
  if (modified.devDependencies) {
    for (const [dep, ver] of Object.entries(modified.devDependencies)) {
      if (ver === 'workspace:*') {
        modified.devDependencies[dep] = `^${version}`;
      }
    }
  }
  
  return modified;
}

// Publish a single package
function publishPackage(pkg, version, dryRun = false, otp = null) {
  const pkgPath = join(ROOT_DIR, pkg.path);
  const originalPkg = readPackageJson(pkg.path);
  
  try {
    // Replace workspace deps
    const modifiedPkg = replaceWorkspaceDeps(originalPkg, version);
    writePackageJson(pkg.path, modifiedPkg);
    
    // Publish command
    let publishCmd = dryRun
      ? `npm publish --access ${pkg.access} --dry-run`
      : `npm publish --access ${pkg.access}`;
    
    // Add OTP if provided
    if (otp && !dryRun) {
      publishCmd += ` --otp=${otp}`;
    }
    
    log(`\n📦 ${dryRun ? '[DRY RUN] ' : ''}Publishing ${pkg.name}@${version}...`, 'blue');
    
    const output = execSync(publishCmd, { 
      cwd: pkgPath, 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    if (dryRun) {
      log(`✅ Dry run successful for ${pkg.name}`, 'green');
    } else {
      log(`✅ Published ${pkg.name}@${version}`, 'green');
    }
    
    return true;
  } catch (error) {
    const errorMsg = error.stderr || error.message || '';
    
    // Check if it's an OTP error
    if (errorMsg.includes('EOTP') || errorMsg.includes('one-time password')) {
      log(`❌ Failed to publish ${pkg.name}: OTP required or invalid`, 'red');
      throw new Error('OTP_REQUIRED');
    }
    
    log(`❌ Failed to publish ${pkg.name}`, 'red');
    console.error(errorMsg);
    return false;
  } finally {
    // Always restore original package.json
    writePackageJson(pkg.path, originalPkg);
  }
}

// Check if version already exists on npm
function checkVersionExists(pkgName, version) {
  const result = exec(`npm view ${pkgName}@${version} version`);
  return result !== null;
}

// Main publish function
async function publish(options = {}) {
  const { dryRun = false, force = false, otp = null } = options;
  
  log('\n🚀 Git Stats Components Publisher', 'bright');
  log('====================================\n', 'bright');
  
  // Pre-flight checks
  checkNpmAuth();
  validateBuilds();
  
  const version = getPublishVersion();
  log(`\n📌 Publishing version: ${version}`, 'yellow');
  
  if (otp) {
    log(`🔐 Using OTP: ${otp.substring(0, 2)}****`, 'cyan');
  }
  
  // Check if versions already exist
  if (!force && !dryRun) {
    log('\n🔍 Checking for existing versions...', 'cyan');
    let alreadyPublished = false;
    
    for (const pkg of PACKAGES) {
      const fullName = `@git-stats-components/${pkg.name}`;
      if (checkVersionExists(fullName, version)) {
        log(`⚠️  ${fullName}@${version} already exists on npm`, 'yellow');
        alreadyPublished = true;
      }
    }
    
    if (alreadyPublished) {
      log('\n❌ Some packages are already published at this version.', 'red');
      log('Options:', 'yellow');
      log('  1. Update version in package.json files', 'yellow');
      log('  2. Run with --force to republish', 'yellow');
      process.exit(1);
    }
  }
  
  // Publish packages
  log('\n📤 Publishing packages...', 'cyan');
  let successCount = 0;
  
  try {
    for (const pkg of PACKAGES) {
      if (publishPackage(pkg, version, dryRun, otp)) {
        successCount++;
      } else {
        log(`\n❌ Publishing failed. Stopping.`, 'red');
        process.exit(1);
      }
    }
  } catch (error) {
    if (error.message === 'OTP_REQUIRED') {
      log('\n❌ OTP (One-Time Password) required!', 'red');
      log('\n🔐 Your npm account has 2FA enabled. Please run:', 'yellow');
      log('   pnpm publish:npm --otp=YOUR_CODE', 'cyan');
      log('\nGet your OTP from your authenticator app (Google Authenticator, Authy, etc.)', 'yellow');
      process.exit(1);
    }
    throw error;
  }
  
  // Summary
  log('\n' + '='.repeat(50), 'bright');
  if (dryRun) {
    log(`✅ Dry run complete! ${successCount}/${PACKAGES.length} packages ready`, 'green');
    log('\nTo publish for real, run: pnpm publish:npm', 'yellow');
    log('If you have 2FA enabled, run: pnpm publish:npm --otp=YOUR_CODE', 'cyan');
  } else {
    log(`✅ Successfully published ${successCount}/${PACKAGES.length} packages!`, 'green');
    log(`\n🎉 All packages published at version ${version}`, 'bright');
    log('\nNext steps:', 'cyan');
    log('  1. git tag v' + version, 'yellow');
    log('  2. git push --tags', 'yellow');
    log('  3. Create GitHub release', 'yellow');
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  dryRun: args.includes('--dry-run') || args.includes('-d'),
  force: args.includes('--force') || args.includes('-f'),
  otp: null
};

// Extract OTP from command line
const otpArg = args.find(arg => arg.startsWith('--otp='));
if (otpArg) {
  options.otp = otpArg.split('=')[1];
}

// Show help
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: node scripts/publish.js [options]

Options:
  --dry-run, -d         Test the publish process without actually publishing
  --force, -f           Force publish even if version exists
  --otp=CODE            Provide one-time password for 2FA
  --help, -h            Show this help message

Examples:
  node scripts/publish.js --dry-run              # Test publish
  node scripts/publish.js                        # Publish to npm
  node scripts/publish.js --otp=123456           # Publish with 2FA
  node scripts/publish.js --force --otp=123456   # Force republish with 2FA

Using pnpm scripts:
  pnpm publish:dry                               # Test publish
  pnpm publish:npm                               # Publish to npm
  pnpm publish:npm --otp=123456                  # Publish with 2FA
  `);
  process.exit(0);
}

// Run the publisher
publish(options).catch(error => {
  log('\n❌ Publish failed:', 'red');
  console.error(error);
  process.exit(1);
});