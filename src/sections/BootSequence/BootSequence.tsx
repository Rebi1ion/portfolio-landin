import { useCallback, useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { gsap } from 'gsap'
import { bootMessages } from '../../data/boot'

type BootSequenceProps = {
  onComplete: () => void
  terminalRef: RefObject<HTMLDivElement | null>
}

export function BootSequence({ onComplete, terminalRef }: BootSequenceProps) {
  const rootRef = useRef<HTMLElement>(null)
  const flashRef = useRef<HTMLDivElement>(null)
  const progressFillRef = useRef<HTMLDivElement>(null)
  const progressLabelRef = useRef<HTMLSpanElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const skipButtonRef = useRef<HTMLButtonElement>(null)
  const logLineRefs = useRef<Array<HTMLLIElement | null>>([])
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const completedRef = useRef(false)

  const completeBoot = useCallback(
    (focusMain: boolean) => {
      if (completedRef.current) {
        return
      }

      completedRef.current = true
      onComplete()

      if (focusMain) {
        requestAnimationFrame(() => document.getElementById('main-content')?.focus({ preventScroll: true }))
      }
    },
    [onComplete],
  )

  const skipBoot = useCallback(() => {
    const root = rootRef.current
    const terminal = terminalRef.current

    if (!root || !terminal || completedRef.current) {
      return
    }

    timelineRef.current?.kill()
    timelineRef.current = gsap
      .timeline({ onComplete: () => completeBoot(true) })
      .to(root, { autoAlpha: 0, duration: 0.16, ease: 'power2.out' })
      .to(terminal, { autoAlpha: 1, y: 0, scale: 1, duration: 0.24, ease: 'power2.out' }, '<')
  }, [completeBoot, terminalRef])

  useEffect(() => {
    const root = rootRef.current
    const flash = flashRef.current
    const progressFill = progressFillRef.current
    const progressLabel = progressLabelRef.current
    const progress = progressRef.current
    const terminal = terminalRef.current
    const logLines = logLineRefs.current.filter((line): line is HTMLLIElement => line !== null)

    if (!root || !flash || !progressFill || !progressLabel || !progress || !terminal) {
      completeBoot(false)
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const progressValue = { value: 0 }
    const context = gsap.context(() => {
      gsap.set(terminal, { autoAlpha: 0, y: 10, scale: 0.985, transformOrigin: '50% 2rem' })
      gsap.set(logLines, { autoAlpha: 0, y: 5 })
      gsap.set(progressFill, { scaleX: 0, transformOrigin: 'left center' })

      const timeline = gsap.timeline({ onComplete: () => completeBoot(false) })

      timeline
        .to(flash, { autoAlpha: 0, duration: 0.34, ease: 'power2.out' }, 0)
        .to(
          progressValue,
          {
            value: 100,
            duration: 2.4,
            ease: 'power1.inOut',
            onUpdate: () => {
              const value = Math.round(progressValue.value)
              progressLabel.textContent = `${String(value).padStart(3, '0')}%`
              progress.setAttribute('aria-valuenow', String(value))
            },
          },
          0.18,
        )
        .to(progressFill, { scaleX: 1, duration: 2.4, ease: 'power1.inOut' }, 0.18)

      logLines.forEach((line, index) => {
        timeline.to(line, { autoAlpha: 1, y: 0, duration: 0.16, ease: 'power1.out' }, 0.2 + index * 0.4)
      })

      timeline
        .to(root, { autoAlpha: 0, duration: 0.32, ease: 'power2.inOut' }, 2.78)
        .to(terminal, { autoAlpha: 1, y: 0, scale: 1, duration: 0.56, ease: 'power3.out' }, 2.7)

      timelineRef.current = timeline
    }, root)

    return () => {
      document.body.style.overflow = previousOverflow
      timelineRef.current?.kill()
      timelineRef.current = null
      context.revert()
    }
  }, [completeBoot, terminalRef])

  useEffect(() => {
    skipButtonRef.current?.focus({ preventScroll: true })

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        skipBoot()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [skipBoot])

  return (
    <section
      ref={rootRef}
      className="boot-sequence"
      role="dialog"
      aria-modal="true"
      aria-labelledby="boot-title"
      aria-describedby="boot-instructions"
    >
      <div ref={flashRef} className="boot-flash" aria-hidden="true" />
      <div className="boot-scanline" aria-hidden="true" />

      <button ref={skipButtonRef} className="boot-skip" type="button" onClick={skipBoot}>
        ПРОПУСТИТЬ <span aria-hidden="true">[ESC]</span>
      </button>

      <div className="boot-terminal">
        <div className="boot-terminal__chrome" aria-hidden="true">
          <span className="boot-terminal__dot boot-terminal__dot--bright" />
          <span className="boot-terminal__dot" />
          <span className="boot-terminal__dot" />
          <span>C:\ROOTERS_DEV.EXE</span>
        </div>

        <div className="boot-terminal__body">
          <p id="boot-title" className="boot-terminal__title">
            ROOTERS_DEV BOOT SEQUENCE
          </p>
          <p id="boot-instructions" className="sr-only">
            Инициализация системы. Нажмите Escape или кнопку «Пропустить», чтобы перейти к содержимому.
          </p>

          <ol className="boot-log" aria-hidden="true">
            {bootMessages.map((message, index) => (
              <li
                ref={(element) => {
                  logLineRefs.current[index] = element
                }}
                className={index === bootMessages.length - 1 ? 'boot-log__line boot-log__line--ready' : 'boot-log__line'}
                key={message}
              >
                <span className="boot-log__prompt">&gt;</span>
                <span>{message}</span>
              </li>
            ))}
          </ol>

          <div className="boot-progress-row">
            <div
              ref={progressRef}
              className="boot-progress"
              role="progressbar"
              aria-label="Загрузка ROOTERS_DEV"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={0}
            >
              <div ref={progressFillRef} className="boot-progress__fill" />
            </div>
            <span ref={progressLabelRef} className="boot-progress__label" aria-hidden="true">
              000%
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
