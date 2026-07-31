export const LAST_GOOGLE_ACCOUNT_KEY = 'platform.lastGoogleAccount'
/** Set on logout so Google One Tap / auto_select will not fire until the next manual Google sign-in. */
export const SKIP_GOOGLE_AUTO_LOGIN_KEY = 'platform.skipGoogleAutoLogin'

export type LastGoogleAccount = {
  displayName: string
  email: string
  personalId: string
  /** Google-hosted profile photo URL (not a binary we store). */
  pictureUrl?: string | null
}

export function getLastGoogleAccount(): LastGoogleAccount | null {
  try {
    const raw = localStorage.getItem(LAST_GOOGLE_ACCOUNT_KEY)
    if (!raw) {
      return null
    }
    const parsed = JSON.parse(raw) as Partial<LastGoogleAccount>
    if (!parsed.email?.trim()) {
      return null
    }
    return {
      displayName: (parsed.displayName ?? '').trim() || parsed.email.trim(),
      email: parsed.email.trim(),
      personalId: (parsed.personalId ?? '').trim(),
      pictureUrl: parsed.pictureUrl?.trim() || null,
    }
  } catch {
    return null
  }
}

export function rememberLastGoogleAccount(account: LastGoogleAccount): void {
  localStorage.setItem(
    LAST_GOOGLE_ACCOUNT_KEY,
    JSON.stringify({
      displayName: account.displayName.trim(),
      email: account.email.trim(),
      personalId: account.personalId.trim(),
      pictureUrl: account.pictureUrl?.trim() || null,
    }),
  )
}

export function clearLastGoogleAccount(): void {
  localStorage.removeItem(LAST_GOOGLE_ACCOUNT_KEY)
}

export function hasLastGoogleAccount(): boolean {
  return getLastGoogleAccount() != null
}

export function isGoogleAutoLoginSkipped(): boolean {
  return localStorage.getItem(SKIP_GOOGLE_AUTO_LOGIN_KEY) === '1'
}

/** After logout: keep remembered account for “Continue as”, but block silent Google login. */
export function markGoogleLogout(): void {
  localStorage.setItem(SKIP_GOOGLE_AUTO_LOGIN_KEY, '1')
}

/** After a successful Google sign-in: allow auto One Tap on future visits (until next logout). */
export function clearGoogleLogoutMark(): void {
  localStorage.removeItem(SKIP_GOOGLE_AUTO_LOGIN_KEY)
}

export function continueAsLabel(account: LastGoogleAccount): string {
  const name = account.displayName.trim()
  if (!name) {
    return account.email.split('@')[0] || 'Google'
  }
  return name.split(/\s+/)[0] ?? name
}
