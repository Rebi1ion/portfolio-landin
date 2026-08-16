import { lazy, Suspense, useEffect, useRef } from 'react'
import { createHeroIntro } from '../animations/gsap/hero'
import { heroContent, heroDescription } from '../data/hero'
import { useHeroPointer } from '../hooks/useHeroPointer'
import { useMagnetic } from '../hooks/useMagnetic'

const LazyHeroScene = lazy(() => import('../three/HeroScene').then(({ HeroScene }) => ({ default: HeroScene })))

type HeroSectionProps = {
  active: boolean
  prefersReducedMotion: boolean
}

export function HeroSection({ active, prefersReducedMotion }: HeroSectionProps) {
  const rootRef = useRef<HTMLElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLSpanElement>(null)
  const caretRef = useRef<HTMLSpanElement>(null)
  const roleRef = useRef<HTMLSpanElement>(null)
  const tickerRef = useRef<HTMLDivElement>(null)
  const coreRef = useRef<HTMLDivElement>(null)
  const descriptionLineRefs = useRef<Array<HTMLSpanElement | null>>([])
  const actionRefs = useRef<Array<HTMLAnchorElement | HTMLButtonElement | null>>([])
  const pointerRef = useHeroPointer(rootRef, !active || prefersReducedMotion)

  useMagnetic(rootRef, !active || prefersReducedMotion)

  useEffect(() => {
    const root = rootRef.current
    const status = statusRef.current
    const title = titleRef.current
    const caret = caretRef.current
    const role = roleRef.current
    const ticker = tickerRef.current
    const core = coreRef.current
    const descriptionLines = descriptionLineRefs.current.filter((line): line is HTMLSpanElement => line !== null)
    const actions = actionRefs.current.filter((action): action is HTMLAnchorElement | HTMLButtonElement => action !== null)

    if (!root || !status || !title || !caret || !role || !ticker || !core || !active) {
      return
    }

    return createHeroIntro({
      actions,
      caret,
      core,
      descriptionLines,
      reducedMotion: prefersReducedMotion,
      role,
      root,
      status,
      ticker,
      title,
      titleText: heroContent.title,
    })
  }, [active, prefersReducedMotion])

  const title = active && !prefersReducedMotion ? '' : heroContent.title
  const sectionClassName = prefersReducedMotion ? 'hero-section hero-section--reduced' : 'hero-section'

  return (
    <section ref={rootRef} className={sectionClassName} id="home" aria-labelledby="hero-title">
      <div className="hero-mouse-glow" aria-hidden="true" />

      <div ref={coreRef} className="hero-visual-field" data-hero-depth="7" aria-hidden="true">
        <div className="hero-core-fallback">
          <span className="hero-core-fallback__ring hero-core-fallback__ring--outer" />
          <span className="hero-core-fallback__ring hero-core-fallback__ring--inner" />
          <span className="hero-core-fallback__cross hero-core-fallback__cross--horizontal" />
          <span className="hero-core-fallback__cross hero-core-fallback__cross--vertical" />
          <span className="hero-core-fallback__node hero-core-fallback__node--one" />
          <span className="hero-core-fallback__node hero-core-fallback__node--two" />
          <span className="hero-core-fallback__node hero-core-fallback__node--three" />
          {active && !prefersReducedMotion ? <Suspense fallback={null}><LazyHeroScene pointerRef={pointerRef} /></Suspense> : null}
        </div>
      </div>

      <div ref={statusRef} className="availability-status" data-hero-depth="2">
        <span className="status-led" aria-hidden="true" />
        ПЛАТНАЯ РАЗРАБОТКА · OPEN FOR PROJECTS
      </div>

      <div className="hero-copy-stage" data-hero-depth="3">
        <div className="hero-copy">
          <h1 id="hero-title" aria-label={heroContent.title}>
            <span className="hero-title-shell" aria-hidden="true">
              <span ref={titleRef}>{title}</span>
              <span ref={caretRef} className="hero-caret" />
            </span>
          </h1>

          <p className="hero-role" aria-label={heroContent.role}>
            <span aria-hidden="true">&gt; </span>
            <span className="hero-reveal-clip" aria-hidden="true">
              <span ref={roleRef}>{heroContent.role}</span>
            </span>
          </p>

          <p className="hero-description" aria-label={heroDescription}>
            {/* <span className="hero-reveal-clip" aria-hidden="true">
              <span ref={(element) => { descriptionLineRefs.current[0] = element }}>
                <strong>FULLSTACK & PYTHON DEVELOPER</strong>.
              </span>
            </span> */}
            <span className="hero-reveal-clip" aria-hidden="true">
              <span ref={(element) => { descriptionLineRefs.current[1] = element }}>
                {heroDescription}
              </span>
            </span>
            {/* <span className="hero-reveal-clip" aria-hidden="true">
              <span ref={(element) => { descriptionLineRefs.current[2] = element }}>
                Работаю по согласованному объёму и требованиям проекта.
              </span>
            </span> */}
          </p>

          <div ref={tickerRef} className="hero-tech-ticker" aria-label="Технологии: Python, React, Playwright, PostgreSQL, Docker">
            <span className="sr-only">{heroContent.technologies.join(' · ')}</span>
            <div className="hero-tech-ticker__viewport" aria-hidden="true">
              <div className="hero-tech-ticker__track">
                {[0, 1].map((group) => (
                  <span className="hero-tech-ticker__group" key={group}>
                    {heroContent.technologies.map((technology) => (
                      <span className="hero-tech-ticker__item" key={`${group}-${technology}`}>
                        {technology}
                        <b aria-hidden="true">·</b>
                      </span>
                    ))}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="hero-actions" aria-label="Основные действия">
            <a
              ref={(element) => { actionRefs.current[0] = element }}
              className="terminal-button terminal-button--primary"
              data-magnetic="true"
              href="https://t.me/rooters_dev"
              target="_blank"
              rel="noreferrer"
            >
              <span aria-hidden="true">▶ </span>
              Написать в Telegram
            </a>
            <a
              ref={(element) => { actionRefs.current[1] = element }}
              className="terminal-button terminal-button--secondary"
              href="#projects"
            >
              Смотреть проекты
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
