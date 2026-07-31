import { useCallback, useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ApiError } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import { AppFooter } from '../layout/AppFooter'
import { AppHeader } from '../layout/AppHeader'
import { GoogleSignInButton } from '../ui/GoogleSignInButton'
import { useToast } from '../ui/ToastContext'

export function LoginPage() {
  const { token, loading, login, loginWithGoogle } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [personalId, setPersonalId] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleGoogle = useCallback(
    async (idToken: string) => {
      setSubmitting(true)
      try {
        await loginWithGoogle(idToken)
        showToast('Signed in successfully', 'success')
        navigate('/home', { replace: true })
      } catch (err) {
        if (err instanceof ApiError) {
          showToast(err.message || 'Google sign-in failed', 'error')
        } else {
          showToast('Unable to sign in with Google.', 'error')
        }
      } finally {
        setSubmitting(false)
      }
    },
    [loginWithGoogle, navigate, showToast],
  )

  if (!loading && token) {
    return <Navigate to="/home" replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    try {
      await login(personalId.trim(), password)
      showToast('Signed in successfully', 'success')
      navigate('/home', { replace: true })
    } catch (err) {
      if (err instanceof ApiError) {
        showToast(err.message || 'Sign in failed', 'error')
      } else {
        showToast('Unable to sign in. Please try again.', 'error')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-page">
      <AppHeader brandOnly />
      <main className="login-page__main">
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <h1 className="login-form__title">Sign in</h1>
          <p className="login-form__subtitle">
            Enter your personal ID or email and password.
          </p>

          <label className="field">
            <span className="field__label">Personal ID or email</span>
            <input
              className="field__input"
              type="text"
              name="personalId"
              autoComplete="username"
              value={personalId}
              onChange={(e) => setPersonalId(e.target.value)}
              required
              disabled={submitting}
            />
          </label>

          <label className="field">
            <span className="field__label">Password</span>
            <input
              className="field__input"
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={submitting}
            />
          </label>

          <button
            type="submit"
            className="btn btn--primary login-form__submit"
            disabled={submitting || !personalId.trim() || !password}
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <GoogleSignInButton
            onCredential={handleGoogle}
            disabled={submitting}
            promptReturningUser
            context="signin"
          />

          <p className="auth-switch">
            No account? <Link to="/register">Create account</Link>
          </p>
        </form>
      </main>
      <AppFooter />
    </div>
  )
}
