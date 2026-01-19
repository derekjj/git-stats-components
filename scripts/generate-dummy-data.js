import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Generate dummy contributions for the past year
function generateContributions() {
  const contributions = [];
  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);
  
  // Start from a Sunday
  const startDate = new Date(oneYearAgo);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  
  // Generate 53 weeks
  for (let week = 0; week < 53; week++) {
    const weekStart = new Date(startDate);
    weekStart.setDate(startDate.getDate() + (week * 7));
    
    const contributionDays = [];
    
    // Generate 7 days
    for (let day = 0; day < 7; day++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + day);
      
      // Random contributions (0-15)
      const count = Math.floor(Math.random() * 16);
      
      contributionDays.push({
        date: date.toISOString().split('T')[0],
        contributionCount: count,
        weekday: day
      });
    }
    
    contributions.push({
      firstDay: contributionDays[0].date,
      contributionDays
    });
  }
  
  return contributions;
}

const data = {
  lastUpdated: new Date().toISOString(),
  profiles: [
    {
      username: 'demouser',
      platform: 'github',
      stats: {
        projectCount: 42,
        commitCount: 3847,
        contributions: generateContributions()
      }
    }
  ],
  totals: {
    projectCount: 42,
    commitCount: 3847
  },
  metadata: {
    isDummy: true,
    source: 'demo',
    fetchedAt: Date.now()
  }
};

// Write to both locations
const publicPath = resolve(__dirname, '../public/data/dummy-git-stats.json');
const dataPath = resolve(__dirname, '../data/dummy-git-stats.json');

writeFileSync(publicPath, JSON.stringify(data, null, 2));
writeFileSync(dataPath, JSON.stringify(data, null, 2));

console.log('✓ Generated dummy data');
console.log(`  ${publicPath}`);
console.log(`  ${dataPath}`);