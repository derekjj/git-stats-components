import React, { useState, useMemo } from 'react'
import { useGitStats } from '../hooks/useGitStats'
import {
  getContributionLevel,
  type ColorScheme,
  type ContributionWeek
} from '@git-stats-components/core'
import './ContributionGraph.css'

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

export interface ContributionGraphProps {
  dataUrl?: string
  profileIndex?: number
  colorScheme?: ColorScheme
  showSettings?: boolean
  cacheTTL?: number
  onDayClick?: (data: { date: string; count: number }) => void
  onColorSchemeChange?: (scheme: ColorScheme) => void
}

export const ContributionGraph: React.FC<ContributionGraphProps> = ({
  dataUrl = '/data/git-stats.json',
  profileIndex = 0,
  colorScheme: initialColorScheme = 'green',
  showSettings = true,
  cacheTTL,
  onDayClick,
  onColorSchemeChange
}) => {
  const { data, loading, dataSourceText, lastUpdatedText, isDummy } = useGitStats({
    dataUrl,
    cacheTTL
  })

  const [currentColorScheme, setCurrentColorScheme] = useState<ColorScheme>(initialColorScheme)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const colorSchemes: ColorScheme[] = ['green', 'blue', 'purple', 'orange']

  const { contributionData, monthLabels } = useMemo(() => {
    if (!data?.profiles?.[profileIndex]?.stats?.contributions) {
      return { contributionData: [], monthLabels: [] }
    }

    const contributions = data.profiles[profileIndex].stats.contributions
    const weeks = processContributions(contributions)
    const months = generateMonthLabels(weeks)

    return { contributionData: weeks, monthLabels: months }
  }, [data, profileIndex])

  const totalContributions = useMemo(() => {
    return contributionData.reduce((total, week) => {
      return total + week.days.reduce((sum, day) => sum + day.count, 0)
    }, 0)
  }, [contributionData])

  function processContributions(contributions: ContributionWeek[]): ProcessedWeek[] {
    return contributions.map(week => ({
      weekStart: week.firstDay || '',
      days: week.contributionDays.map(day => ({
        date: day.date || '',
        count: day.contributionCount ?? 0,
        weekday: day.weekday || 0
      }))
    }))
  }

  function generateMonthLabels(weeks: ProcessedWeek[]): MonthLabel[] {
    const monthPositions: MonthLabel[] = []
    let lastMonth = -1
    let lastYear = -1

    weeks.forEach((week, weekIndex) => {
      if (!week.days || week.days.length === 0) return

      const firstDay = week.days[0].date
      if (!firstDay) return

      const [year, month] = firstDay.split('-').map(Number)
      if (isNaN(year) || isNaN(month)) return

      if (month !== lastMonth || year !== lastYear) {
        const date = new Date(year, month - 1, 1)
        monthPositions.push({
          week: weekIndex,
          month: month - 1,
          year: year,
          label: date.toLocaleDateString('en-US', { month: 'short' })
        })
        lastMonth = month
        lastYear = year
      }
    })

    return monthPositions
  }

  const handleColorSchemeChange = (scheme: ColorScheme) => {
    setCurrentColorScheme(scheme)
    setSettingsOpen(false)
    onColorSchemeChange?.(scheme)
  }

  const handleDayClick = (day: ProcessedDay) => {
    onDayClick?.({ date: day.date, count: day.count })
  }

  const getTooltipText = (day: ProcessedDay): string => {
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

  if (loading) {
    return (
      <div className="git-contribution-graph">
        <div className="loading-state">
          <div className="spinner" />
          <span>Loading contributions...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="git-contribution-graph">
      {/* Header */}
      <div className="graph-header">
        <div className="header-info">
          <h5 className="contribution-count">
            {totalContributions.toLocaleString()} contributions in the last year
          </h5>
          <small className={`data-source-text ${isDummy ? 'is-dummy' : ''}`}>
            {dataSourceText}
          </small>
        </div>

        {showSettings && (
          <div className="header-actions">
            <button
              className="settings-btn"
              type="button"
              onClick={() => setSettingsOpen(!settingsOpen)}
            >
              ⚙️ Settings
            </button>
            {settingsOpen && (
              <div className="settings-dropdown">
                {colorSchemes.map(scheme => (
                  <button
                    key={scheme}
                    onClick={() => handleColorSchemeChange(scheme)}
                    className="settings-item"
                  >
                    {scheme} theme
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Contribution Grid */}
      <div className="graph-container">
        <div className="graph-content-wrapper">
          {/* Month labels */}
          <div className="months-row">
            <div className="month-spacer"></div>
            <div className="months-container">
              {monthLabels.map(month => (
                <div
                  key={`${month.year}-${month.month}`}
                  className="month-label"
                  style={{ gridColumn: `${month.week + 1} / span 1` }}
                >
                  {month.label}
                </div>
              ))}
            </div>
          </div>

          {/* Grid with day labels */}
          <div className="grid-container">
            {/* Day labels */}
            <div className="day-labels">
              <div className="day-label">Mon</div>
              <div className="day-label"></div>
              <div className="day-label">Wed</div>
              <div className="day-label"></div>
              <div className="day-label">Fri</div>
              <div className="day-label"></div>
              <div className="day-label"></div>
            </div>

            {/* Contribution squares */}
            <div className="contribution-grid">
              {contributionData.map((week, weekIndex) => (
                <div key={`${week.weekStart}-${weekIndex}`} className="contribution-week">
                  {week.days.map((day, dayIndex) => (
                    <div
                      key={`${day.date}-${dayIndex}`}
                      className={`contribution-day level-${getContributionLevel(day.count)} ${currentColorScheme}`}
                      title={getTooltipText(day)}
                      onClick={() => handleDayClick(day)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="graph-footer">
          {lastUpdatedText && (
            <small className="last-updated">Last updated: {lastUpdatedText}</small>
          )}
          <div className="legend">
            <small className="legend-label">Less</small>
            <div className="legend-squares">
              {[0, 1, 2, 3, 4].map(level => (
                <div
                  key={level}
                  className={`contribution-day level-${level} ${currentColorScheme}`}
                />
              ))}
            </div>
            <small className="legend-label">More</small>
          </div>
        </div>
      </div>
    </div>
  )
}