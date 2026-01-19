<script lang="ts">
    import { onMount } from 'svelte'
    import {
      fetchGitStats,
      formatLastUpdated,
      calculateYearsExperience,
      type GitStatsData,
      type ExperienceEntry,
      type CustomStatCalculator
    } from '@git-stats-components/core'
  
    // Props
    export let dataUrl: string = '/data/git-stats.json'
    export let profileIndexes: number[] = []
    export let experienceData: ExperienceEntry[] = []
    export let showCustomStat: boolean = true
    export let customStatCalculator: CustomStatCalculator | null = null
    export let cacheTTL: number = 24 * 60 * 60 * 1000
  
    // State
    let data: GitStatsData | null = null
    let loading = true
    let totalProjects = 0
    let totalCommits = 0
  
    $: dataSourceText = data?.metadata?.isDummy ? '⚠️ Using dummy data for testing' : 'Real-time data'
    $: lastUpdatedText = data?.lastUpdated ? formatLastUpdated(data.lastUpdated) : ''
    
    $: yearsExperience = calculateYearsExperience(experienceData).toFixed(1)
    
    $: customStatValue = customStatCalculator
      ? customStatCalculator({
          projects: totalProjects,
          commits: totalCommits,
          years: parseFloat(yearsExperience)
        })
      : ((totalProjects * 1.5 + totalCommits * 1.2 + parseFloat(yearsExperience) * 1.5).toFixed(2))
  
    onMount(async () => {
      const result = await fetchGitStats({
        dataUrl,
        cacheTTL,
        cacheKey: 'git_stats_cache',
        useStaleCache: true
      })
      
      data = result.data
      loading = false
    })
  
    $: if (data) {
      if (profileIndexes.length > 0) {
        let projects = 0
        let commits = 0
  
        profileIndexes.forEach(index => {
          const profile = data?.profiles?.[index]
          if (profile?.stats) {
            projects += profile.stats.projectCount || 0
            commits += profile.stats.commitCount || 0
          }
        })
  
        totalProjects = projects
        totalCommits = commits
      } else {
        totalProjects = data.totals?.projectCount || 0
        totalCommits = data.totals?.commitCount || 0
      }
    }
  </script>
  
  <div class="git-stats-breakdown">
    <div class="stats-grid">
      <!-- Years Experience -->
      <div class="stat-card">
        <div class="stat-icon">
          <slot name="icon-experience">⏱️</slot>
        </div>
        <div class="stat-content">
          <div class="stat-value">{yearsExperience}</div>
          <div class="stat-label">Years Experience</div>
        </div>
      </div>
  
      <!-- Projects -->
      <div class="stat-card">
        <div class="stat-icon">
          <slot name="icon-projects">📦</slot>
        </div>
        <div class="stat-content">
          {#if loading}
            <div class="stat-loading">
              <div class="spinner"></div>
            </div>
          {:else}
            <div class="stat-value">{totalProjects}</div>
          {/if}
          <div class="stat-label">Projects</div>
        </div>
      </div>
  
      <!-- Commits -->
      <div class="stat-card">
        <div class="stat-icon">
          <slot name="icon-commits">💻</slot>
        </div>
        <div class="stat-content">
          {#if loading}
            <div class="stat-loading">
              <div class="spinner"></div>
            </div>
          {:else}
            <div class="stat-value">{totalCommits}</div>
          {/if}
          <div class="stat-label">Commits</div>
        </div>
      </div>
  
      <!-- Custom Stat -->
      {#if showCustomStat}
        <div class="stat-card">
          <div class="stat-icon">
            <slot name="icon-custom">☕</slot>
          </div>
          <div class="stat-content">
            {#if loading}
              <div class="stat-loading">
                <div class="spinner"></div>
              </div>
            {:else}
              <div class="stat-value">{customStatValue}</div>
            {/if}
            <div class="stat-label">
              <slot name="custom-stat-label">Coffee Consumed</slot>
            </div>
          </div>
        </div>
      {/if}
    </div>
  
    <!-- Footer -->
    <div class="stats-footer">
      {#if dataSourceText}
        <small class="data-source">
          {dataSourceText}
          {#if lastUpdatedText} · {lastUpdatedText}{/if}
        </small>
      {/if}
    </div>
  
    <slot />
  </div>
  
  <style>
    .git-stats-breakdown {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
      padding: 40px 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
  
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-bottom: 24px;
    }
  
    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.3s ease;
    }
  
    .stat-card:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }
  
    .stat-icon {
      font-size: 48px;
      line-height: 1;
      opacity: 0.9;
      flex-shrink: 0;
    }
  
    .stat-content {
      flex: 1;
      min-width: 0;
    }
  
    .stat-value {
      font-size: 32px;
      font-weight: bold;
      line-height: 1.2;
      color: #e6edf3;
      margin-bottom: 4px;
    }
  
    .stat-label {
      font-size: 14px;
      color: #7d8590;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  
    .stat-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 38px;
    }
  
    .spinner {
      width: 24px;
      height: 24px;
      border: 3px solid rgba(255, 255, 255, 0.1);
      border-top-color: #58a6ff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  
    .stats-footer {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
  
    .data-source {
      font-size: 12px;
      color: #7d8590;
      text-align: center;
    }
  
    @media (max-width: 768px) {
      .git-stats-breakdown {
        padding: 20px 12px;
      }
      .stats-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }
    }
  </style>