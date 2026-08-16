import { useEffect, useRef, useState } from 'react'
import { createProjectLoadSequence, createProjectOpenTransition, createProjectsIntro } from '../animations/gsap/projects'
import { SectionHeading } from '../components/ui/SectionHeading'
import { projects, type PortfolioProject } from '../data/projects'
import { useReducedMotion } from '../hooks/useReducedMotion'

type TerminalMode = 'ready' | 'loading'

function getIllustrativeCode(project: PortfolioProject) {
  return [
    '// ILLUSTRATIVE_PROJECT_VIEW',
    '// Public source code is not represented here.',
    `const projectName = '${project.name}'`,
    `const category = '${project.category}'`,
    `const liveEndpoint = '${project.url}'`,
    '',
    'export const projectStatus = {',
    "  source: 'public-site',",
    "  mode: 'preview-ready',",
    '}',
  ]
}

export function ProjectsSection() {
  const rootRef = useRef<HTMLElement>(null)
  const hasMountedRef = useRef(false)
  const openTransitionCleanupRef = useRef<(() => void) | null>(null)
  const prefersReducedMotion = useReducedMotion()
  const [selectedId, setSelectedId] = useState<PortfolioProject['id']>(projects[0].id)
  const [terminalMode, setTerminalMode] = useState<TerminalMode>('ready')
  const [lastCommand, setLastCommand] = useState(`rooters@portfolio:~$ select ${projects[0].name.toLowerCase()}`)
  const selectedIndex = projects.findIndex((project) => project.id === selectedId)
  const selectedProject = projects[selectedIndex]

  useEffect(() => {
    return () => openTransitionCleanupRef.current?.()
  }, [])

  useEffect(() => {
    const root = rootRef.current

    if (!root) {
      return
    }

    return createProjectsIntro(root, { reducedMotion: prefersReducedMotion })
  }, [prefersReducedMotion])

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return
    }

    if (terminalMode !== 'loading') {
      return
    }

    const root = rootRef.current

    if (!root) {
      return
    }

    const cleanup = createProjectLoadSequence(root, { reducedMotion: prefersReducedMotion })
    const timeout = window.setTimeout(() => setTerminalMode('ready'), prefersReducedMotion ? 0 : 850)

    return () => {
      window.clearTimeout(timeout)
      cleanup()
    }
  }, [prefersReducedMotion, selectedId, terminalMode])

  function selectProject(index: number) {
    const project = projects[index]

    if (!project || project.id === selectedProject.id) {
      return
    }

    setLastCommand(`rooters@portfolio:~$ select ${project.name.toLowerCase()}`)
    setSelectedId(project.id)
    setTerminalMode('loading')
  }

  function focusProject(index: number) {
    const target = rootRef.current?.querySelector<HTMLButtonElement>(`[data-project-index="${index}"]`)
    target?.focus()
  }

  function handleSelectorKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | null = null

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      nextIndex = (index + 1) % projects.length
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      nextIndex = (index - 1 + projects.length) % projects.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = projects.length - 1
    }

    if (nextIndex === null) {
      return
    }

    event.preventDefault()
    selectProject(nextIndex)
    focusProject(nextIndex)
  }

  function handleSectionKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === 'Escape' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }

  function handleLiveProjectOpen() {
    const root = rootRef.current

    if (!root) {
      return
    }

    setLastCommand(`rooters@portfolio:~$ open ${selectedProject.name.toLowerCase()}`)
    openTransitionCleanupRef.current?.()
    openTransitionCleanupRef.current = createProjectOpenTransition(root, { reducedMotion: prefersReducedMotion })
  }

  const codeLines = getIllustrativeCode(selectedProject)
  const isLoading = terminalMode === 'loading'

  return (
    <section
      ref={rootRef}
      className={`content-section projects-section${isLoading ? ' projects-section--loading' : ''}`}
      id="projects"
      aria-labelledby="projects-title"
      onKeyDown={handleSectionKeyDown}
    >
      <SectionHeading id="projects-title" title="МОИ_РАБОТЫ" description="// ВЫБЕРИТЕ ПРОЕКТ" />

      <div className="projects-terminal">
        <div className="projects-terminal__chrome" aria-hidden="true">
          <span>ROOTERS_DEV://PROJECT_LOADER</span>
          <span><i /> {isLoading ? 'BUSY' : 'READY'}</span>
        </div>
        <div className="projects-terminal__body">
          <p className="projects-terminal__line projects-terminal__command">{lastCommand}<span className="projects-terminal__caret" aria-hidden="true" /></p>
          <div className="projects-terminal__status" role="status" aria-live="polite" aria-atomic="true">
            {isLoading ? (
              <>
              <p className="projects-terminal__line projects-terminal__line--loading">CONNECTING TO {selectedProject.name}_LIVE...</p>
              <p className="projects-terminal__line projects-terminal__line--loading projects-terminal__progress">
                TRANSFER <span className="projects-terminal__progress-track" aria-hidden="true"><span className="projects-terminal__progress-fill" /></span> 100%
              </p>
              <p className="projects-terminal__line projects-terminal__line--loading">PROJECT_LOADED :: {selectedProject.id}</p>
              </>
            ) : (
              <p className="projects-terminal__line projects-terminal__result">CONNECTION ESTABLISHED // {selectedProject.name}_READY</p>
            )}
          </div>
        </div>
      </div>

      <div className="projects-workspace">
        <div className="projects-selector" role="group" aria-label="Выбор проекта">
          <div className="projects-selector__heading">
            <span aria-hidden="true">&gt; SELECT_PROJECT</span>
            <span>{String(projects.length).padStart(2, '0')}_LIVE_RECORDS</span>
          </div>
          <div className="projects-selector__list" role="listbox" aria-label="Проекты" aria-controls="project-detail-panel">
            {projects.map((project, index) => {
              const isSelected = project.id === selectedProject.id

              return (
                <button
                  className="projects-selector__option"
                  data-project-index={index}
                  data-selected={isSelected}
                  key={project.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => selectProject(index)}
                  onKeyDown={(event) => handleSelectorKeyDown(event, index)}
                >
                  <span className="projects-selector__index">[{String(index + 1).padStart(2, '0')}]</span>
                  <span className="projects-selector__name">{project.name}</span>
                  <span className="projects-selector__indicator" aria-hidden="true">{isSelected ? 'ACTIVE' : 'SELECT'}</span>
                </button>
              )
            })}
          </div>
          <p className="projects-selector__hint">ARROWS TO NAVIGATE // ENTER TO SELECT // ESC TO BLUR</p>
        </div>

        <article id="project-detail-panel" className="project-detail" aria-labelledby="project-detail-title">
          <header className="project-detail__header">
            <p>PROJECT_RECORD // {selectedProject.id}</p>
            <span><i aria-hidden="true" /> PUBLIC_URL_AVAILABLE</span>
          </header>
          <div className="project-detail__content">
            <div>
              <p className="project-detail__label">NAME</p>
              <h3 id="project-detail-title">{selectedProject.name}</h3>
            </div>
            <dl className="project-detail__facts">
              <div>
                <dt>CATEGORY</dt>
                <dd>{selectedProject.category}</dd>
              </div>
              <div>
                <dt>DESCRIPTION</dt>
                <dd>{selectedProject.description}</dd>
              </div>
              <div>
                <dt>TECHNOLOGIES</dt>
                <dd>
                  {selectedProject.technologies.length > 0 ? (
                    <span className="project-detail__technologies">
                      {selectedProject.technologies.map((technology) => <span key={technology.name}>{technology.name}</span>)}
                    </span>
                  ) : 'UNKNOWN'}
                </dd>
              </div>
              <div>
                <dt>LIVE_URL</dt>
                <dd><a href={selectedProject.url} target="_blank" rel="noreferrer" onClick={handleLiveProjectOpen}>{selectedProject.url}</a></dd>
              </div>
            </dl>
            {selectedProject.preview ? (
              <div className="project-preview" aria-label="Доступные материалы для превью">
                <div className="project-preview__frame">
                  <img
                    key={selectedProject.id}
                    className="project-preview__image"
                    src={selectedProject.preview.image}
                    alt={`Главная страница ${selectedProject.name}`}
                  />
                  <span className="project-preview__scan" aria-hidden="true" />
                  <span className="project-preview__corner project-preview__corner--top" aria-hidden="true" />
                  <span className="project-preview__corner project-preview__corner--bottom" aria-hidden="true" />
                  <span className="project-preview__signal" aria-hidden="true"><i /> FRAME_READY</span>
                </div>
                <p className="project-preview__caption">{selectedProject.preview.description}</p>
              </div>
            ) : null}
            <a
              className="terminal-button terminal-button--primary projects-live-action"
              href={selectedProject.url}
              target="_blank"
              rel="noreferrer"
              onClick={handleLiveProjectOpen}
              aria-label={`Открыть живой сайт ${selectedProject.name} в новой вкладке`}
            >
              OPEN LIVE PROJECT <span aria-hidden="true">↗</span>
            </a>
          </div>
        </article>
      </div>

      <div className="projects-detail-grid">
        <section className="project-ide" aria-labelledby="project-ide-title">
          <header className="project-ide__header">
            <span id="project-ide-title">ILLUSTRATIVE_IDE // {selectedProject.name}</span>
            <span>READ_ONLY</span>
          </header>
          <div className="project-ide__body">
            <aside className="project-ide__tree" aria-label="Иллюстративная структура файлов">
              <p>EXPLORER</p>
              <ul>
                <li><span>⌄</span> ILLUSTRATIVE/</li>
                <li><span>├</span> src/</li>
                <li><span>├</span> project.config</li>
                <li><span>└</span> README.md</li>
              </ul>
            </aside>
            <div className="project-ide__editor" aria-label="Иллюстративный код, не являющийся исходным кодом проекта">
              {codeLines.map((line, index) => (
                <p className="project-ide__line" key={`${selectedProject.id}-${index}`}>
                  <span className="project-ide__line-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <code>{line || ' '}</code>
                </p>
              ))}
            </div>
          </div>
          <footer className="project-ide__footer">// Generic illustrative view. Not the project&apos;s source code.</footer>
        </section>

        <aside className="projects-output" aria-label="Терминальный вывод проекта">
          <div className="projects-output__heading"><span>&gt; TERMINAL_OUTPUT</span><span><i /> ONLINE</span></div>
          <p className="projects-live-command">{lastCommand}</p>
          <p>RESOLVE ........ OK</p>
          <p>PUBLIC_URL ..... VERIFIED</p>
          <p>PREVIEW ........ {selectedProject.preview ? 'AVAILABLE' : 'UNKNOWN'}</p>
          <p>STATE .......... {isLoading ? 'LOADING' : 'READY'}</p>
        </aside>
      </div>
    </section>
  )
}
