import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useToast } from '../ui/ToastContext'
import { AppFooter } from './AppFooter'
import { AppHeader } from './AppHeader'
import { AppSidebar } from './AppSidebar'

type AppShellProps = {
  children: ReactNode
}

const SIDEBAR_COLLAPSED_KEY = 'platform.sidebarCollapsed'

export function AppShell({ children }: AppShellProps) {
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1'
    } catch {
      return false
    }
  })

  async function handleLogout() {
    await logout()
    showToast('Signed out', 'success')
    navigate('/login', { replace: true })
  }

  function toggleSidebarCollapsed() {
    setSidebarCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? '1' : '0')
      } catch {
        // ignore
      }
      return next
    })
  }

  return (
    <div className="app-shell">
      <AppHeader
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((open) => !open)}
      />
      <div
        className={`app-shell__body${sidebarCollapsed ? ' is-sidebar-collapsed' : ''}`}
      >
        <AppSidebar
          open={menuOpen}
          collapsed={sidebarCollapsed}
          onClose={() => setMenuOpen(false)}
          user={user}
          onLogout={() => {
            void handleLogout()
          }}
        />
        <button
          type="button"
          className="sidebar-edge-toggle"
          onClick={toggleSidebarCollapsed}
          aria-label={sidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
          aria-expanded={!sidebarCollapsed}
          aria-controls="app-sidebar"
        >
          {sidebarCollapsed ? '›' : '×'}
        </button>
        <main className="app-shell__main">{children}</main>
      </div>
      <AppFooter />
    </div>
  )
}
