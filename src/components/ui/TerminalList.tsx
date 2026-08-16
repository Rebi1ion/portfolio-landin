import type { ReactNode } from 'react'

type Marker = '*' | '+' | 'x'

type TerminalListProps = {
  items: readonly ReactNode[]
  marker?: Marker
}

export function TerminalList({ items, marker = '*' }: TerminalListProps) {
  return (
    <ul className="terminal-list">
      {items.map((item, index) => (
        <li key={index}>
          <span className={`terminal-list__marker terminal-list__marker--${marker}`} aria-hidden="true">
            [{marker}]
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

