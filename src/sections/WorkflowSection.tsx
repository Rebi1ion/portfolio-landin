import { useEffect, useRef, useState } from 'react'
import { createWorkflowAnimations } from '../animations/gsap/workflow'
import { SectionHeading } from '../components/ui/SectionHeading'
import { workflowStages } from '../data/workflow'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function WorkflowSection() {
  const rootRef = useRef<HTMLElement>(null)
  const manualSelectionRef = useRef(false)
  const manualSelectionTimeoutRef = useRef<number | undefined>(undefined)
  const prefersReducedMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const activeStage = workflowStages[activeIndex]

  const selectStep = (index: number) => {
    manualSelectionRef.current = true
    if (manualSelectionTimeoutRef.current !== undefined) {
      window.clearTimeout(manualSelectionTimeoutRef.current)
    }
    manualSelectionTimeoutRef.current = window.setTimeout(() => {
      manualSelectionRef.current = false
    }, 850)
    setActiveIndex(index)
  }

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    return createWorkflowAnimations(root, {
      reducedMotion: prefersReducedMotion,
      onActiveStep: (index) => {
        if (!manualSelectionRef.current) {
          setActiveIndex(index)
        }
      },
    })
  }, [prefersReducedMotion])

  useEffect(() => () => {
    if (manualSelectionTimeoutRef.current !== undefined) {
      window.clearTimeout(manualSelectionTimeoutRef.current)
    }
  }, [])

  const handleStepKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (index + 1) % workflowStages.length
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (index - 1 + workflowStages.length) % workflowStages.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = workflowStages.length - 1
    } else if (event.key === 'Enter' || event.key === ' ') {
      selectStep(index)
      return
    } else {
      return
    }

    event.preventDefault()
    selectStep(nextIndex)
      rootRef.current?.querySelector<HTMLButtonElement>(`.workflow-step__button[data-workflow-index="${nextIndex}"]`)?.focus()
  }

  return (
    <section
      ref={rootRef}
      className="content-section workflow-section"
      id="workflow"
      aria-labelledby="workflow-title"
    >
      <SectionHeading id="workflow-title" title="КАК_МЫ_РАБОТАЕМ" description="// от заявки до релиза — 5 этапов" />

      <div className="workflow-terminal" role="status" aria-live="polite" aria-atomic="true">
        <div className="workflow-terminal__chrome" aria-hidden="true">
          <span><i /> ROOTERS_DEV://WORKFLOW</span>
          <span>{activeStage.number}_OF_{String(workflowStages.length).padStart(2, '0')} // {activeStage.title}</span>
        </div>
        <div className="workflow-terminal__body">
          <p className="workflow-terminal__command">rooters@portfolio:~$ workflow --run<span className="workflow-terminal__caret" aria-hidden="true" /></p>
          <p className="workflow-terminal__message">PROCESS_ROUTE ........ {activeStage.title}_ACTIVE</p>
          <div className="workflow-terminal__progress-line" aria-hidden="true">
            <span style={{ width: `${((activeIndex + 1) / workflowStages.length) * 100}%` }} />
          </div>
          <p className="workflow-terminal__hint">SCROLL TO TRACE // FOCUS A STEP TO INSPECT</p>
        </div>
      </div>

      <div className="workflow-timeline" aria-label="Этапы процесса">
        <span className="workflow-timeline__track" aria-hidden="true" />
        <span className="workflow-timeline__progress" aria-hidden="true" />
        <ol className="workflow-timeline__list">
          {workflowStages.map((stage, index) => {
            const isActive = index === activeIndex

            return (
              <li
                className={`workflow-step${isActive ? ' workflow-step--active' : ''}`}
                data-workflow-index={index}
                key={stage.number}
              >
                <button
                  className="workflow-step__button"
                  type="button"
                  data-workflow-index={index}
                  aria-current={isActive ? 'step' : undefined}
                  aria-label={`${stage.number} ${stage.title}`}
                  onClick={() => selectStep(index)}
                  onFocus={() => selectStep(index)}
                  onKeyDown={(event) => handleStepKeyDown(event, index)}
                >
                  <span className="workflow-step__marker" aria-hidden="true">
                    <span>{stage.number}</span>
                  </span>
                  <span className="workflow-step__card">
                    <span className="workflow-step__meta">SOURCE::{stage.sourceTitle}</span>
                    <span className="workflow-step__title">{stage.title}</span>
                    <span className="workflow-step__description">{stage.description}</span>
                    <span className="workflow-step__state" aria-hidden="true">
                      {isActive ? '[+] ACTIVE' : '[ ] QUEUED'}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>

      <div className="workflow-terminal__footer">
        <span><i aria-hidden="true" /> ROUTE_STATUS: {activeStage.title}_READY</span>
        <span>STEP_{activeStage.number} // {activeStage.sourceTitle}</span>
      </div>
    </section>
  )
}
