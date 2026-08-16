import type { ReactNode } from 'react'
import { TerminalHeader } from './TerminalHeader'

type TerminalShellProps = {
  children: ReactNode
}

export function TerminalShell({ children }: TerminalShellProps) {
  return (
    <div className="terminal-shell">
      <TerminalHeader />
      <div className="terminal-content">{children}</div>
    </div>
  )
}

