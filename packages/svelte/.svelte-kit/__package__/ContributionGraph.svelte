<script lang="ts">
    import { onMount } from 'svelte'
    import { createEventDispatcher } from 'svelte'
    import {
      fetchGitStats,
      formatLastUpdated,
      getContributionLevel,
      type GitStatsData,
      type ColorScheme,
      type ContributionWeek
    } from '@git-stats-components/core'
  
    const dispatch = createEventDispatcher()
  
    // Props
    export let dataUrl: string = '/data/git-stats.json'
    export let profileIndex: number = 0
    export let colorScheme: ColorScheme = 'green'
    export let showSettings: boolean = true
    export let cacheTTL: number = 24 * 60 * 60 * 1000
  
    // State
    let data: GitStatsData | null = null
    let loading = true
    let settingsOpen = false
    let contributionData: ProcessedWeek[] = []
    let monthLabels: MonthLabel[] = []
  
    interface ProcessedWeek {
      weekStart: string
      days: ProcessedDay[]
    }
  
    interface ProcessedDay {
      date: string
      count: number
      weekday: number
    }
  
    interface MonthLabel {
      week: number
      month: number
      year: number
      label: string
    }
  
    const colorSchemes: ColorScheme[] = ['green', 'blue', 'purple', 'orange']
  
    $: dataSourceText = data?.metadata?.isDummy ? '⚠️ Using dummy data for testing' : 'Real-time data'
    $: lastUpdatedText = data?.lastUpdated ? formatLastUpdated(data.lastUpdated) : ''
    
    $: totalContributions = contributionData.reduce((total, week) => {
      return total + week.days.reduce((sum, day) => sum + day.count, 0)
    }, 0)
  
    onMount(async () => {
      const result = await fetchGitStats({
        dataUrl,
        cacheTTL,
        cacheKey: 'git_stats_cache',
        useStaleCache: true
      })
      
      data = result.data
      loading = false
  
      if (data?.profiles?.[profileIndex]?.stats?.contributions) {
        processContributions(data.profiles[profileIndex].stats.contributions)
      }
    })
  
    function processContributions(contributions: ContributionWeek[]) {
      contributionData = contributions.map(week => ({
        weekStart: week.firstDay || '',
        days: week.contributionDays.map(day => ({
          date: day.date || '',
          count: day.contributionCount ?? 0,
          weekday: day.weekday || 0
        }))
      }))
  
      generateMonthLabels()
    }
  
    function generateMonthLabels() {
      const positions: MonthLabel[] = []
      let lastMonth = -1
      let lastYear = -1
  
      contributionData.forEach((week, weekIndex) => {
        if (!week.days || week.days.length === 0) return
  
        const firstDay = week.days[0].date
        if (!firstDay) return
  
        const [year, month] = firstDay.split('-').map(Number)
        if (isNaN(year) || isNaN(month)) return
  
        if (month !== lastMonth || year !== lastYear) {
          const date = new Date(year, month - 1, 1)
          positions.push({
            week: weekIndex,
            month: month - 1,
            year: year,
            label: date.toLocaleDateString('en-US', { month: 'short' })
          })
          lastMonth = month
          lastYear = year
        }
      })
  
      monthLabels = positions
    }
  
    function getContributionClass(count: number): string {
      const level = getContributionLevel(count)
      return `level-${level} ${colorScheme}`
    }
  
    function getTooltipText(day: ProcessedDay): string {
      if (!day.date) return ''
      const [year, month, dayNum] = day.date.split('-').map(Number)
      const date = new Date(year, month - 1, dayNum)
      const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
      const contributionText = day.count === 1 ? 'contribution' : 'contributions'
      return `${day.count} ${contributionText} on ${formattedDate}`
    }
  
    function handleDayClick(day: ProcessedDay) {
      dispatch('dayClick', { date: day.date, count: day.count })
    }
  
    function toggleSettings() {
      settingsOpen = !settingsOpen
    }
  
    function changeColorScheme(scheme: ColorScheme) {
      colorScheme = scheme
      settingsOpen = false
      dispatch('colorSchemeChange', scheme)
    }
  </script>
  
  <div class="git-contribution-graph">
    <!-- Header -->
    <div class="graph-header">
      <div class="header-info">
        <h5 class="contribution-count">
          {totalContributions.toLocaleString()} contributions in the last year
        </h5>
        <small class="data-source-text" class:is-dummy={data?.metadata?.isDummy}>
          {dataSourceText}
        </small>
      </div>
  
      {#if showSettings}
        <div class="header-actions">
          <button class="settings-btn" type="button" on:click={toggleSettings}>
            <slot name="settings-icon">⚙️</slot>
            Settings
          </button>
          {#if settingsOpen}
            <div class="settings-dropdown">
              {#each colorSchemes as scheme}
                <button on:click={() => changeColorScheme(scheme)} class="settings-item">
                  {scheme} theme
                </button>
              {/each}
            </div>
          {/if}
        </div>
      {/if}
    </div>
  
    <!-- Loading state -->
    {#if loading}
      <div class="loading-state">
        <div class="spinner"></div>
        <span>Loading contributions...</span>
      </div>
    {:else}
      <!-- Contribution grid -->
      <div class="graph-container">
        <div class="graph-content-wrapper">
          <!-- Month labels -->
          <div class="months-row">
            <div class="month-spacer"></div>
            <div class="months-container">
              {#each monthLabels as month}
                <div
                  class="month-label"
                  style="grid-column: {month.week + 1} / span 1"
                >
                  {month.label}
                </div>
              {/each}
            </div>
          </div>
  
          <!-- Grid with day labels -->
          <div class="grid-container">
            <!-- Day labels -->
            <div class="day-labels">
              <div class="day-label">Mon</div>
              <div class="day-label"></div>
              <div class="day-label">Wed</div>
              <div class="day-label"></div>
              <div class="day-label">Fri</div>
              <div class="day-label"></div>
              <div class="day-label"></div>
            </div>
  
            <!-- Contribution squares -->
            <div class="contribution-grid">
              {#each contributionData as week}
                <div class="contribution-week">
                  {#each week.days as day}
                    <div
                      class="contribution-day {getContributionClass(day.count)}"
                      title={getTooltipText(day)}
                      on:click={() => handleDayClick(day)}
                    ></div>
                  {/each}
                </div>
              {/each}
            </div>
          </div>
        </div>
  
        <!-- Legend -->
        <div class="graph-footer">
          {#if lastUpdatedText}
            <small class="last-updated">Last updated: {lastUpdatedText}</small>
          {/if}
          <div class="legend">
            <small class="legend-label">Less</small>
            <div class="legend-squares">
              {#each [0, 1, 2, 3, 4] as level}
                <div class="contribution-day level-{level} {colorScheme}"></div>
              {/each}
            </div>
            <small class="legend-label">More</small>
          </div>
        </div>
      </div>
    {/if}
  </div>
  
  <style>
    .git-contribution-graph {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
      font-size: 12px;
      background: transparent;
      color: #e6edf3;
      padding: 16px;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
    }
  
    .graph-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
  
    .contribution-count {
      margin: 0 0 4px 0;
      font-size: 16px;
      font-weight: 600;
    }
  
    .data-source-text {
      color: #7d8590;
    }
  
    .data-source-text.is-dummy {
      color: #f85149;
      font-weight: 600;
      background: rgba(248, 81, 73, 0.1);
      padding: 2px 8px;
      border-radius: 4px;
    }
  
    .settings-btn {
      background: transparent;
      border: 1px solid #30363d;
      color: #7d8590;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
    }
  
    .settings-btn:hover {
      background: #21262d;
      color: #e6edf3;
    }
  
    .header-actions {
      position: relative;
    }
  
    .settings-dropdown {
      position: absolute;
      right: 0;
      top: 100%;
      margin-top: 4px;
      background: #21262d;
      border: 1px solid #30363d;
      border-radius: 6px;
      padding: 4px;
      z-index: 10;
      min-width: 150px;
    }
  
    .settings-item {
      display: block;
      width: 100%;
      background: transparent;
      border: none;
      color: #e6edf3;
      padding: 8px 12px;
      text-align: left;
      cursor: pointer;
      border-radius: 4px;
    }
  
    .settings-item:hover {
      background: #30363d;
    }
  
    .loading-state {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 40px;
      color: #7d8590;
    }
  
    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid #30363d;
      border-top-color: #58a6ff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  
    .months-row {
      display: flex;
      margin-bottom: 4px;
    }
  
    .month-spacer {
      width: 27px;
      flex-shrink: 0;
    }
  
    .months-container {
      display: grid;
      grid-template-columns: repeat(53, 11px);
      gap: 2px;
      flex: 1;
      margin-left: 3px;
      min-width: 0;
    }
  
    .month-label {
      font-size: 11px;
      color: #7d8590;
      text-align: left;
    }
  
    .grid-container {
      display: flex;
      gap: 3px;
      min-width: fit-content;
    }
  
    .day-labels {
      display: flex;
      flex-direction: column;
      width: 24px;
      gap: 2px;
      flex-shrink: 0;
    }
  
    .day-label {
      height: 11px;
      font-size: 9px;
      color: #7d8590;
      display: flex;
      align-items: center;
    }
  
    .contribution-grid {
      display: flex;
      gap: 2px;
      flex: 1;
      min-width: 0;
    }
  
    .contribution-week {
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex-shrink: 0;
    }
  
    .contribution-day {
      width: 11px;
      height: 11px;
      border-radius: 2px;
      cursor: pointer;
      outline: 1px solid rgba(27, 31, 36, 0.06);
      outline-offset: -1px;
      flex-shrink: 0;
    }
  
    /* Color schemes */
    .contribution-day.level-0.green { background-color: #161b22; }
    .contribution-day.level-1.green { background-color: #0e4429; }
    .contribution-day.level-2.green { background-color: #006d32; }
    .contribution-day.level-3.green { background-color: #26a641; }
    .contribution-day.level-4.green { background-color: #39d353; }
  
    .contribution-day.level-0.blue { background-color: #161b22; }
    .contribution-day.level-1.blue { background-color: #0a3069; }
    .contribution-day.level-2.blue { background-color: #1f6feb; }
    .contribution-day.level-3.blue { background-color: #58a6ff; }
    .contribution-day.level-4.blue { background-color: #79c0ff; }
  
    .contribution-day.level-0.purple { background-color: #161b22; }
    .contribution-day.level-1.purple { background-color: #3b1e6d; }
    .contribution-day.level-2.purple { background-color: #8250df; }
    .contribution-day.level-3.purple { background-color: #a475f9; }
    .contribution-day.level-4.purple { background-color: #d2a8ff; }
  
    .contribution-day.level-0.orange { background-color: #161b22; }
    .contribution-day.level-1.orange { background-color: #7d2d00; }
    .contribution-day.level-2.orange { background-color: #da7b00; }
    .contribution-day.level-3.orange { background-color: #ffa348; }
    .contribution-day.level-4.orange { background-color: #ffb366; }
  
    .contribution-day:hover {
      outline: 1px solid #c9d1d9;
      outline-offset: -1px;
    }
  
    .graph-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px;
    }
  
    .last-updated {
      color: #7d8590;
    }
  
    .legend {
      display: flex;
      align-items: center;
      gap: 4px;
    }
  
    .legend-label {
      color: #7d8590;
    }
  
    .legend-squares {
      display: flex;
      gap: 2px;
    }
  
    .legend-squares .contribution-day {
      cursor: default;
    }
  
    .legend-squares .contribution-day:hover {
      outline: none;
    }
  
    @media (max-width: 768px) {
      .git-contribution-graph {
        padding: 12px;
        font-size: 11px;
        overflow-x: auto;
      }
    }
  </style>