import { useEffect, useState } from 'react'

const navigation = [
  { href: '#stack', label: 'СТЕК' },
  { href: '#services', label: 'УСЛУГИ' },
  { href: '#projects', label: 'ПРОЕКТЫ' },
  { href: '#workflow', label: 'ПРОЦЕСС' },
  { href: '#contact', label: 'КОНТАКТ' },
] as const

export function TerminalHeader() {
  const [activeSection, setActiveSection] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const sectionIds = navigation.map((item) => item.href.slice(1))
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visible) {
          setActiveSection(visible.target.id)
        }
      },
      { rootMargin: '-22% 0px -62% 0px', threshold: [0, 0.25, 0.5] },
    )

    sections.forEach((section) => observer.observe(section))

    const handleScroll = () => setIsScrolled(window.scrollY > 24)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <header className={`terminal-header${isScrolled ? ' terminal-header--compact' : ''}`}>
      <div className="terminal-chrome">
        <div className="terminal-dots" aria-hidden="true">
          <span className="terminal-dot terminal-dot--bright" />
          <span className="terminal-dot terminal-dot--medium" />
          <span className="terminal-dot terminal-dot--dim" />
        </div>
        <p className="terminal-path">C:\ROOTERS_DEV.EXE — ЗАГРУЖЕНО</p>
        <div className="terminal-status" aria-label="Статус: онлайн">
          <span className="status-led" aria-hidden="true" />
          ONLINE
        </div>
      </div>
      <nav className="terminal-nav" aria-label="Основная навигация">
        {navigation.map((item) => (
          <a
            key={item.href}
            href={item.href}
            aria-current={activeSection === item.href.slice(1) ? 'page' : undefined}
            data-active={activeSection === item.href.slice(1) ? 'true' : undefined}
          >
            <span aria-hidden="true">[</span>
            {item.label}
            <span aria-hidden="true">]</span>
          </a>
        ))}
      </nav>
    </header>
  )
}
