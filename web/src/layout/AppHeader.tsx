type AppHeaderProps = {
  brandOnly?: boolean
  /** Mobile drawer open state */
  menuOpen?: boolean
  onMenuToggle?: () => void
}

export function AppHeader({
  brandOnly = false,
  menuOpen = false,
  onMenuToggle,
}: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        {!brandOnly && onMenuToggle ? (
          <button
            type="button"
            className="app-header__menu-btn app-header__menu-btn--mobile"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={menuOpen}
            aria-controls="app-sidebar"
            onClick={onMenuToggle}
          >
            <span className="app-header__menu-icon" aria-hidden="true" />
          </button>
        ) : null}

        <a href={brandOnly ? '/login' : '/home'} className="app-header__brand">
          Platform
        </a>
      </div>
    </header>
  )
}
