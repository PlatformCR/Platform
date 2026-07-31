const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export const TOKEN_KEY = 'platform.accessToken'

export type User = {
  personalId: string
  email: string
  displayName?: string | null
  avatarUrl?: string | null
  roles: string[]
  permissions: string[]
}

export type LoginResponse = {
  accessToken: string
  user: User
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers)

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const token = getToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let message = response.statusText || 'Request failed'
    try {
      const body = (await response.json()) as { detail?: string; title?: string }
      message = body.detail ?? body.title ?? message
    } catch {
      // ignore non-JSON error bodies
    }
    throw new ApiError(response.status, message)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export function login(personalId: string, password: string) {
  return apiFetch<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ personalId, password }),
  })
}

export function register(
  personalId: string,
  email: string,
  password: string,
  confirmPassword: string,
) {
  return apiFetch<LoginResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ personalId, email, password, confirmPassword }),
  })
}

export function loginWithGoogle(idToken: string) {
  return apiFetch<LoginResponse>('/api/auth/oauth/google', {
    method: 'POST',
    body: JSON.stringify({ idToken }),
  })
}

export function fetchMe() {
  return apiFetch<User>('/api/auth/me')
}

export function logout() {
  return apiFetch<void>('/api/auth/logout', { method: 'POST' })
}
