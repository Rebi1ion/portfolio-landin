import { useCallback, useRef, useState } from 'react'
import { CrtLayers } from '../components/overlays/CrtLayers'
import { TerminalShell } from '../components/terminal/TerminalShell'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { BootSequence } from '../sections/BootSequence/BootSequence'
import { ContactSection } from '../sections/ContactSection'
import { HeroSection } from '../sections/HeroSection'
import { ProjectsSection } from '../sections/ProjectsSection'
import { ServicesSection } from '../sections/ServicesSection'
import { StackSection } from '../sections/StackSection'
import { StatsSection } from '../sections/StatsSection'
import { WorkflowSection } from '../sections/WorkflowSection'

export function App() {
  const prefersReducedMotion = useReducedMotion()
  const [bootComplete, setBootComplete] = useState(prefersReducedMotion)
  const terminalStageRef = useRef<HTMLDivElement>(null)
  const completeBoot = useCallback(() => setBootComplete(true), [])
  const bootVisible = !bootComplete && !prefersReducedMotion

  return (
    <div className="app-frame">
      <CrtLayers />
      {bootVisible ? <BootSequence terminalRef={terminalStageRef} onComplete={completeBoot} /> : null}
      <div
        ref={terminalStageRef}
        className={bootVisible ? 'terminal-stage terminal-stage--booting' : 'terminal-stage'}
        aria-hidden={bootVisible ? true : undefined}
        inert={bootVisible ? true : undefined}
      >
        <a className="skip-link" href="#main-content">
          Перейти к содержимому
        </a>
        <TerminalShell>
          <main id="main-content" tabIndex={-1}>
            <HeroSection active={!bootVisible} prefersReducedMotion={prefersReducedMotion} />
            <StackSection />
            <ServicesSection />
            <ProjectsSection />
            <WorkflowSection />
            <StatsSection />
          </main>
          <ContactSection />
        </TerminalShell>
      </div>
    </div>
  )
}
