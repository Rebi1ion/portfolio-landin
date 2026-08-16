import { useEffect, useRef, useState } from 'react'
import { createStackAnimations } from '../animations/gsap/stack'
import { SectionHeading } from '../components/ui/SectionHeading'
import { stackGroups } from '../data/stack'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function StackSection() {
  const rootRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const [activeCardId, setActiveCardId] = useState<string | null>(null)

  useEffect(() => {
    const root = rootRef.current

    if (!root) {
      return
    }

    return createStackAnimations(root, { reducedMotion: prefersReducedMotion })
  }, [prefersReducedMotion])

  return (
    <section
      ref={rootRef}
      className={`content-section stack-section${activeCardId ? ' stack-section--has-active' : ''}`}
      id="stack"
      aria-labelledby="stack-title"
    >
      <SectionHeading id="stack-title" title="СТЕК_ТЕХНОЛОГИЙ" description="// инструменты, которые я использую" />
      <div className="stack-terminal-meta" aria-hidden="true">
        <span>&gt; stack --list --verbose</span>
        <span className="stack-terminal-meta__status"><i /> {String(stackGroups.length).padStart(2, '0')}_MODULES ONLINE</span>
      </div>
      <div className="stack-grid">
        {stackGroups.map((group, groupIndex) => {
          const headingId = `stack-card-${group.id}`
          const isActive = activeCardId === group.id

          return (
            <article
              className="stack-card"
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
              <div className="stack-card__header">
                <div className="stack-card__title-line">
                  <span className="stack-card__index" aria-hidden="true">{String(groupIndex + 1).padStart(2, '0')}</span>
                  <h3 id={headingId}>{group.title}</h3>
                </div>
                <span className="stack-card__status"><i aria-hidden="true" /> READY</span>
              </div>
              <ul className="stack-card__list">
                {group.items.map((item) => (
                  <li className="stack-item" key={item.name}>
                    <span className={`stack-item__marker stack-item__marker--${item.marker}`} aria-hidden="true">[{item.marker}]</span>
                    <span>{item.name}</span>
                  </li>
                ))}
              </ul>
              <div className="stack-card__footer" aria-hidden="true">
                <span>&gt; verify_{group.id}</span>
                <span className="stack-card__cursor" />
              </div>
            </article>
          )
        })}
      </div>
      <div className="stack-section__tail" aria-hidden="true">
        <span>// all modules indexed</span>
        <span className="stack-section__tail-caret" />
      </div>
    </section>
  )
}
