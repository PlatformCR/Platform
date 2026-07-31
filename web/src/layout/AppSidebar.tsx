import { NavLink } from 'react-router-dom'
import type { User } from '../api/client'
import { UserMenu } from '../ui/UserMenu'

type AppSidebarProps = {
  open: boolean
  collapsed: boolean
  onClose: () => void
  user: User | null
  onLogout: () => void
}

export function AppSidebar({
  open,
  collapsed,
  onClose,
  user,
  onLogout,
}: AppSidebarProps) {
  return (
    <>
      <div
        className={`app-sidebar-backdrop${open ? ' is-open' : ''}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        id="app-sidebar"
        className={`app-sidebar${open ? ' is-open' : ''}${collapsed ? ' is-collapsed' : ''}`}
        aria-label="Main navigation"
        aria-hidden={collapsed ? true : undefined}
      >
        <nav className="app-sidebar__nav">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `app-sidebar__link${isActive ? ' is-active' : ''}`
            }
            onClick={onClose}
          >
            Home
          </NavLink>
        </nav>

        {user ? (
          <div className="app-sidebar__footer">
            <UserMenu user={user} onLogout={onLogout} />
          </div>
        ) : null}
      </aside>
    </>
  )
}
