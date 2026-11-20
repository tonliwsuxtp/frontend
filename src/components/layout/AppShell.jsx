import Sidebar from './Sidebar'
import './layout.css'

/** Page frame: sidebar on desktop (hidden below 900px) + page content. */
export default function AppShell({ active, onNavigate, sidebarExtra, children }) {
  return (
    <div className="app-shell">
      <Sidebar active={active} onNavigate={onNavigate} extra={sidebarExtra} />
      <div className="app-content">{children}</div>
    </div>
  )
}
