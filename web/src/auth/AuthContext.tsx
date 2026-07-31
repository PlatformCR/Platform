import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  clearToken,
  fetchMe,
  getToken,
  login as apiLogin,
  loginWithGoogle as apiLoginWithGoogle,
  logout as apiLogout,
  register as apiRegister,
  setToken,
  type User,
} from '../api/client'
import { rememberLastGoogleAccount, clearGoogleLogoutMark, markGoogleLogout } from './lastGoogleAccount'
import { cancelGoogleOneTap } from '../ui/googleIdentity'

type AuthContextValue = {
  user: User | null
  token: string | null
  loading: boolean
  login: (personalId: string, password: string) => Promise<void>
  register: (
    personalId: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => Promise<void>
  loginWithGoogle: (idToken: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setTokenState] = useState<string | null>(() => getToken())
  const [loading, setLoading] = useState(() => Boolean(getToken()))

  useEffect(() => {
    let cancelled = false

    async function loadUser() {
      const existing = getToken()
      if (!existing) {
        setUser(null)
        setTokenState(null)
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const me = await fetchMe()
        if (!cancelled) {
          setUser(me)
          setTokenState(existing)
        }
      } catch {
        if (!cancelled) {
          clearToken()
          setUser(null)
          setTokenState(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadUser()
    return () => {
      cancelled = true
    }
  }, [])

  const applySession = useCallback((accessToken: string, nextUser: User) => {
    setToken(accessToken)
    setTokenState(accessToken)
    setUser(nextUser)
  }, [])

  const login = useCallback(
    async (personalId: string, password: string) => {
      const response = await apiLogin(personalId, password)
      applySession(response.accessToken, response.user)
    },
    [applySession],
  )

  const register = useCallback(
    async (
      personalId: string,
      email: string,
      password: string,
      confirmPassword: string,
    ) => {
      const response = await apiRegister(personalId, email, password, confirmPassword)
      applySession(response.accessToken, response.user)
    },
    [applySession],
  )

  const loginWithGoogle = useCallback(
    async (idToken: string) => {
      const response = await apiLoginWithGoogle(idToken)
      rememberLastGoogleAccount({
        displayName: response.user.displayName?.trim() || response.user.personalId,
        email: response.user.email,
        personalId: response.user.personalId,
        pictureUrl: response.user.avatarUrl ?? null,
      })
      clearGoogleLogoutMark()
      applySession(response.accessToken, response.user)
    },
    [applySession],
  )

  const logout = useCallback(async () => {
    try {
      await apiLogout()
    } catch {
      // Clear local session even if the API call fails
    } finally {
      // Block page-load Google auto-login only. Do NOT call disableAutoSelect —
      // that would force the account picker on the next “Continue as” click.
      markGoogleLogout()
      cancelGoogleOneTap()
      clearToken()
      setTokenState(null)
      setUser(null)
    }
  }, [])

  const value = useMemo(
    () => ({ user, token, loading, login, register, loginWithGoogle, logout }),
    [user, token, loading, login, register, loginWithGoogle, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
