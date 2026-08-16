import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App'
import './styles/tokens.css'
import './styles/globals.css'
import './styles/boot.css'
import './styles/terminal.css'
import './styles/sections.css'
import './styles/stack.css'
import './styles/services.css'
import './styles/hero.css'
import './styles/projects.css'
import './styles/workflow.css'
import './styles/responsive.css'
import './styles/stats.css'
import './styles/contact.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element was not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
