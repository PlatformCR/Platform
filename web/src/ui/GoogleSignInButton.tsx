import { useCallback, useEffect, useRef, useState } from 'react'
import {
  continueAsLabel,
  getLastGoogleAccount,
  hasLastGoogleAccount,
  isGoogleAutoLoginSkipped,
  type LastGoogleAccount,
} from '../auth/lastGoogleAccount'
import { UserAvatar } from './UserAvatar'
import {
  cancelGoogleOneTap,
  disableGoogleAutoSelect,
  initializeGoogleIdentity,
  isGoogleConfigured,
  loadGoogleIdentityScript,
  promptGoogleOneTap,
} from './googleIdentity'

type GoogleSignInButtonProps = {
  onCredential: (idToken: string) => void
  disabled?: boolean
  context?: 'signin' | 'signup' | 'use'
  promptReturningUser?: boolean
}

/**
 * Waits until Google returns an ID token, or fails (One Tap blocked / skipped / timeout).
 * Success is ONLY when the credential callback fires — never on a blind timer.
 */
function attemptOneTapSignIn(
  onCredential: (idToken: string) => void,
  context: 'signin' | 'signup' | 'use',
  autoSelect: boolean,
): Promise<'ok' | 'fail'> {
  return new Promise((resolve) => {
    let settled = false
    const finish = (result: 'ok' | 'fail') => {
      if (settled) {
        return
      }
      settled = true
      resolve(result)
    }

    void (async () => {
      try {
        await loadGoogleIdentityScript()
      } catch {
        finish('fail')
        return
      }
      if (!window.google?.accounts?.id) {
        finish('fail')
        return
      }

      initializeGoogleIdentity({
        onCredential: (idToken) => {
          onCredential(idToken)
          finish('ok')
        },
        autoSelect,
        context,
      })

      promptGoogleOneTap((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          finish('fail')
        }
      })

      window.setTimeout(() => finish('fail'), 3500)
    })()
  })
}

export function GoogleSignInButton({
  onCredential,
  disabled,
  context = 'signin',
  promptReturningUser = false,
}: GoogleSignInButtonProps) {
  const [gisHost, setGisHost] = useState<HTMLDivElement | null>(null)
  const onCredentialRef = useRef(onCredential)
  onCredentialRef.current = onCredential
  const autoAttemptedRef = useRef(false)

  const [remembered] = useState<LastGoogleAccount | null>(() =>
    promptReturningUser ? getLastGoogleAccount() : null,
  )
  const [useAnother, setUseAnother] = useState(false)
  const [autoStatus, setAutoStatus] = useState<'idle' | 'trying' | 'failed'>('idle')
  const configured = isGoogleConfigured()

  const showContinueAs = promptReturningUser && Boolean(remembered) && !useAnother
  const allowAutoLogin =
    promptReturningUser && hasLastGoogleAccount() && !isGoogleAutoLoginSkipped() && !useAnother

  const deliverCredential = useCallback((idToken: string) => {
    onCredentialRef.current(idToken)
  }, [])

  // Page visit: try silent One Tap only if user did not log out
  useEffect(() => {
    if (!configured || disabled || !allowAutoLogin || autoAttemptedRef.current) {
      return
    }
    autoAttemptedRef.current = true
    setAutoStatus('trying')
    void attemptOneTapSignIn(deliverCredential, context, true).then((result) => {
      setAutoStatus(result === 'ok' ? 'idle' : 'failed')
    })
  }, [configured, disabled, allowAutoLogin, context, deliverCredential])

  // Always mount a real GIS button (under Continue as as invisible overlay, or visible)
  useEffect(() => {
    if (!configured || disabled || !gisHost) {
      return
    }

    let cancelled = false

    async function setup() {
      try {
        await loadGoogleIdentityScript()
      } catch {
        return
      }
      if (cancelled || !gisHost || !window.google?.accounts?.id) {
        return
      }

      initializeGoogleIdentity({
        onCredential: deliverCredential,
        autoSelect: false,
        context,
      })

      await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())))
      if (cancelled || !gisHost) {
        return
      }

      const width = Math.max(Math.floor(gisHost.getBoundingClientRect().width) || 320, 280)
      gisHost.innerHTML = ''
      window.google.accounts.id.renderButton(gisHost, {
        theme: 'outline',
        size: 'large',
        width,
        text: 'continue_with',
      })
    }

    void setup()

    return () => {
      cancelled = true
      cancelGoogleOneTap()
    }
  }, [configured, disabled, gisHost, deliverCredential, context, showContinueAs])

  function handleUseAnotherAccount() {
    setUseAnother(true)
    setAutoStatus('idle')
    disableGoogleAutoSelect()
    cancelGoogleOneTap()
  }

  if (!configured) {
    return (
      <p className="auth-google-hint">
        Google Sign-In is not configured. Set <code>VITE_GOOGLE_CLIENT_ID</code>.
      </p>
    )
  }

  if (showContinueAs && remembered) {
    const name = continueAsLabel(remembered)
    return (
      <div className={`auth-continue-google${disabled ? ' is-disabled' : ''}`}>
        <div className="auth-continue-google__stack">
          <div className="auth-continue-google__btn" aria-hidden="true">
            <UserAvatar
              displayName={remembered.displayName}
              personalId={remembered.personalId}
              email={remembered.email}
              avatarUrl={remembered.pictureUrl}
              className="auth-continue-google__avatar"
            />
            <span className="auth-continue-google__text">
              <span className="auth-continue-google__name">Continue as {name}</span>
              <span className="auth-continue-google__hint">Google account</span>
            </span>
          </div>
          {/* Real Google button — invisible but receives the click */}
          <div
            className="auth-continue-google__gis"
            ref={setGisHost}
            title={`Continue as ${name}`}
          />
        </div>
        <button
          type="button"
          className="auth-continue-google__other"
          onClick={handleUseAnotherAccount}
          disabled={disabled}
        >
          Use another Google account
        </button>
        {autoStatus === 'trying' ? (
          <p className="auth-continue-google__auto">Signing you in automatically…</p>
        ) : null}
        {autoStatus === 'failed' ? (
          <p className="auth-continue-google__auto">
            Click Continue as {name} to sign in.
          </p>
        ) : null}
      </div>
    )
  }

  return (
    <div
      className={`auth-google-button${disabled ? ' is-disabled' : ''}`}
      ref={setGisHost}
      aria-disabled={disabled || undefined}
    />
  )
}
