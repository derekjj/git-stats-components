// packages/core/scripts/post-build.js
// Ensures TypeScript outputs are properly structured

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const distPath = resolve(__dirname, '../dist');

console.log('✓ Core package built successfully');
console.log(`  Output: ${distPath}`);

// Create a types/index.js re-export if it doesn't exist
import { existsSync, mkdirSync } from 'fs';

const typesDir = resolve(distPath, 'types');
const typesIndexJs = resolve(typesDir, 'index.js');

// Check if types directory exists, create it if needed
if (!existsSync(typesDir)) {
  console.log('  Types directory not found, creating...');
  mkdirSync(typesDir, { recursive: true });
}

if (!existsSync(typesIndexJs)) {
  console.log('  Creating types/index.js re-export...');
  const content = `// Re-export all types
export * from './index.js';
`;
  writeFileSync(typesIndexJs, content);
  console.log('  ✓ Created types/index.js');
}

console.log('✓ Post-build complete');