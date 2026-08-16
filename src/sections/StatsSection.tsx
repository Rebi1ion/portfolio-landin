import { useEffect, useRef } from 'react'
import { createStatsAnimations } from '../animations/gsap/stats'
import { stats } from '../data/stats'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function StatsSection() {
  const rootRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (!rootRef.current) return undefined
    return createStatsAnimations(rootRef.current, { reducedMotion })
  }, [reducedMotion])

  return (
    <section className="stats-section" id="stats" aria-labelledby="stats-title" ref={rootRef}>
      <div className="stats-terminal">
        <div className="stats-terminal__chrome">
          <span><i /> ROOTERS_DEV://SYSTEM_STATS</span>
          <span>{stats.length} RECORDS // READ_ONLY</span>
        </div>
        <div className="stats-terminal__body">
          <h2 id="stats-title">Основные показатели</h2>
          <p className="stats-terminal__command">rooters@portfolio:~$ stats --read</p>
          <p className="stats-terminal__status">SYSTEM_READ // COMPLETE</p>
        </div>
      </div>
      <dl className="stats-grid">
        {stats.map((stat) => (
          <div className="stat-panel" key={stat.label} data-stat-value={stat.value}>
            <dt>{stat.label}</dt>
            <dd aria-label={stat.value}><span className="stat-panel__value" aria-hidden="true">{stat.value}</span></dd>
          </div>
        ))}
      </dl>
      <p className="info-callout">
        <span aria-hidden="true">[!] </span>
        Пишите <strong>сразу с ТЗ</strong> — так мы не теряем время!
      </p>
    </section>
  )
}
