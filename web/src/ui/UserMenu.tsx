import { useEffect, useRef, useState } from 'react'
import type { User } from '../api/client'
import { UserAvatar } from './UserAvatar'

type UserMenuProps = {
  user: User
  onLogout: () => void
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const label = (user.displayName?.trim() || user.personalId || user.email).trim()
  const roleLabel = user.roles[0] ?? 'User'

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  return (
    <div className="user-menu user-menu--sidebar" ref={rootRef}>
      <button
        type="button"
        className="user-menu-trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Menu for ${label}`}
        title={`${label} · ${roleLabel}`}
      >
        <UserAvatar
          displayName={user.displayName}
          personalId={user.personalId}
          email={user.email}
          avatarUrl={user.avatarUrl}
          className="user-menu-avatar"
        />
        <span className="user-menu-text">
          <span className="user-menu-name">{label}</span>
          <span className="user-menu-role">{roleLabel}</span>
        </span>
        <span className="user-menu-chevron" aria-hidden="true">
          {open ? '▴' : '▾'}
        </span>
      </button>

      {open ? (
        <div className="user-menu-dropdown user-menu-dropdown--up" role="menu">
          <button
            type="button"
            className="user-menu-item"
            role="menuitem"
            onClick={() => {
              setOpen(false)
              onLogout()
            }}
          >
            Logout
          </button>
        </div>
      ) : null}
    </div>
  )
}
