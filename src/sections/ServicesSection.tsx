import { useEffect, useRef, useState } from 'react'
import { createServicesAnimations } from '../animations/gsap/services'
import { TerminalList } from '../components/ui/TerminalList'
import { SectionHeading } from '../components/ui/SectionHeading'
import { serviceGroups } from '../data/services'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function ServicesSection() {
  const rootRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const [activeCardId, setActiveCardId] = useState<string | null>(null)

  useEffect(() => {
    const root = rootRef.current

    if (!root) {
      return
    }

    return createServicesAnimations(root, { reducedMotion: prefersReducedMotion })
  }, [prefersReducedMotion])

  return (
    <section
      ref={rootRef}
      className={`content-section services-section${activeCardId ? ' services-section--has-active' : ''}`}
      id="services"
      aria-labelledby="services-title"
    >
      <SectionHeading id="services-title" title="УСЛУГИ" description="// что я разработаю для вас" />
      <div className="services-terminal-meta" aria-hidden="true">
        <span>&gt; services --check-policy</span>
        <span className="services-terminal-meta__status"><i /> {String(serviceGroups.length).padStart(2, '0')}_RULES LOADED</span>
      </div>
      <div className="services-grid">
        {serviceGroups.map((group, groupIndex) => {
          const headingId = `service-card-${group.id}`
          const isActive = activeCardId === group.id
          const marker = group.tone === 'positive' ? '+' : 'x'
          const status = group.tone === 'positive' ? 'READY' : 'FILTERED'

          return (
            <article
              className={`service-card service-card--${group.tone}`}
              data-active={isActive}
              key={group.id}
              tabIndex={0}
              aria-labelledby={headingId}
              onFocus={() => setActiveCardId(group.id)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setActiveCardId(null)
                }
              }}
              onPointerDown={(event) => {
                if (event.pointerType === 'touch') {
                  setActiveCardId(group.id)
                }
              }}
              onPointerEnter={(event) => {
                if (event.pointerType !== 'touch') {
                  setActiveCardId(group.id)
                }
              }}
              onPointerLeave={(event) => {
                if (event.pointerType !== 'touch' && document.activeElement !== event.currentTarget) {
                  setActiveCardId(null)
                }
              }}
            >
              <div className="service-card__header">
                <div className="service-card__title-line">
                  <span className="service-card__index" aria-hidden="true">{String(groupIndex + 1).padStart(2, '0')}</span>
                  <h3 id={headingId}>{group.title}</h3>
                </div>
                <span className="service-card__status"><i aria-hidden="true" /> {status}</span>
              </div>
              <div className="service-card__body">
                <TerminalList
                  items={group.items.map((item) => <span className="service-item__text" key={item}>{item}</span>)}
                  marker={marker}
                />
              </div>
              <div className="service-card__footer" aria-hidden="true">
                <span>&gt; policy_{group.id}</span>
                <span className="service-card__cursor" />
              </div>
            </article>
          )
        })}
      </div>
      <div className="services-section__tail" aria-hidden="true">
        <span>// policy check complete</span>
        <span className="services-section__tail-caret" />
      </div>
    </section>
  )
}
