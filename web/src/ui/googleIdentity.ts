const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined

export type GoogleCredentialResponse = { credential?: string }

export type GooglePromptNotification = {
  isNotDisplayed: () => boolean
  isSkippedMoment: () => boolean
  isDismissedMoment: () => boolean
  getNotDisplayedReason?: () => string
  getSkippedReason?: () => string
  getDismissedReason?: () => string
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string
            callback: (response: GoogleCredentialResponse) => void
            auto_select?: boolean
            cancel_on_tap_outside?: boolean
            context?: 'signin' | 'signup' | 'use'
            itp_support?: boolean
          }) => void
          renderButton: (
            parent: HTMLElement,
            options: {
              theme?: string
              size?: string
              width?: number
              text?: string
              type?: string
            },
          ) => void
          prompt: (momentListener?: (notification: GooglePromptNotification) => void) => void
          cancel: () => void
          disableAutoSelect: () => void
        }
      }
    }
  }
}

let scriptPromise: Promise<void> | null = null

export function isGoogleConfigured(): boolean {
  return Boolean(GOOGLE_CLIENT_ID?.trim())
}

export function getGoogleClientId(): string {
  return GOOGLE_CLIENT_ID?.trim() ?? ''
}

export function loadGoogleIdentityScript(): Promise<void> {
  if (!isGoogleConfigured()) {
    return Promise.reject(new Error('Google Client ID not configured'))
  }
  if (window.google?.accounts?.id) {
    return Promise.resolve()
  }
  if (scriptPromise) {
    return scriptPromise
  }

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-google-gsi]')
    if (existing) {
      if (window.google?.accounts?.id) {
        resolve()
        return
      }
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('Failed to load Google Identity')), {
        once: true,
      })
      return
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.dataset.googleGsi = 'true'
    script.addEventListener('load', () => resolve(), { once: true })
    script.addEventListener('error', () => reject(new Error('Failed to load Google Identity')), {
      once: true,
    })
    document.head.appendChild(script)
  })

  return scriptPromise
}

export function initializeGoogleIdentity(options: {
  onCredential: (idToken: string) => void
  autoSelect?: boolean
  context?: 'signin' | 'signup' | 'use'
}): void {
  const clientId = getGoogleClientId()
  if (!clientId || !window.google?.accounts?.id) {
    return
  }

  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: (response) => {
      if (response.credential) {
        options.onCredential(response.credential)
      }
    },
    auto_select: options.autoSelect ?? false,
    cancel_on_tap_outside: true,
    context: options.context ?? 'signin',
    itp_support: true,
  })
}

export function promptGoogleOneTap(
  onMiss?: (notification: GooglePromptNotification) => void,
): void {
  window.google?.accounts.id.prompt((notification) => {
    if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
      onMiss?.(notification)
    }
  })
}

export function cancelGoogleOneTap(): void {
  try {
    window.google?.accounts.id.cancel()
  } catch {
    // ignore
  }
}

export function disableGoogleAutoSelect(): void {
  try {
    window.google?.accounts.id.disableAutoSelect()
  } catch {
    // ignore
  }
}
