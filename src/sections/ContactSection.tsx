import { useEffect, useRef } from 'react'
import { createContactAnimations } from '../animations/gsap/contact'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function ContactSection() {
  const rootRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (!rootRef.current) return undefined
    return createContactAnimations(rootRef.current, { reducedMotion })
  }, [reducedMotion])

  return (
    <footer className="contact-section" id="contact" aria-labelledby="contact-title" ref={rootRef}>
      <div className="contact-terminal__chrome" aria-hidden="true">
        <span><i /> ROOTERS_DEV://CONTACT</span>
        <span>EXTERNAL_LINK // READY</span>
      </div>
      <div className="contact-terminal__body">
        <h2 id="contact-title">CONNECT</h2>
        <p className="contact-terminal__prompt">rooters@portfolio:~$ connect<span className="contact-caret" aria-hidden="true" /></p>
        <p className="contact-terminal__message">Связь: <span>@rooters_dev</span> в Telegram</p>
        <a
          className="terminal-button terminal-button--primary contact-cta"
          href="https://t.me/rooters_dev"
          target="_blank"
          rel="noreferrer"
          aria-label="Открыть Telegram @rooters_dev в новой вкладке"
        >
          OPEN TELEGRAM @rooters_dev <span aria-hidden="true">↗</span>
        </a>
      </div>
      <div className="contact-terminal__footer">
        <span className="contact-terminal__status" aria-label="Статус: онлайн"><i aria-hidden="true" /> ONLINE</span>
        <span aria-hidden="true">CHANNEL // TELEGRAM</span>
      </div>
    </footer>
  )
}
