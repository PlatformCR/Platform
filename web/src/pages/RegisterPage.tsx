import { useCallback, useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ApiError } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import { AppFooter } from '../layout/AppFooter'
import { AppHeader } from '../layout/AppHeader'
import { GoogleSignInButton } from '../ui/GoogleSignInButton'
import { useToast } from '../ui/ToastContext'

export function RegisterPage() {
  const { token, loading, register, loginWithGoogle } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [personalId, setPersonalId] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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
      await register(personalId.trim(), email.trim(), password, confirmPassword)
      showToast('Account created', 'success')
      navigate('/home', { replace: true })
    } catch (err) {
      if (err instanceof ApiError) {
        showToast(err.message || 'Registration failed', 'error')
      } else {
        showToast('Unable to register. Please try again.', 'error')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const canSubmit =
    personalId.trim().length >= 3 &&
    email.trim().includes('@') &&
    password.length >= 8 &&
    confirmPassword.length > 0

  return (
    <div className="login-page">
      <AppHeader brandOnly />
      <main className="login-page__main">
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <h1 className="login-form__title">Create account</h1>
          <p className="login-form__subtitle">
            Register with personal ID, email, and password.
          </p>

          <label className="field">
            <span className="field__label">Personal ID</span>
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
            <span className="field__label">Email</span>
            <input
              className="field__input"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              disabled={submitting}
            />
          </label>

          <label className="field">
            <span className="field__label">Confirm password</span>
            <input
              className="field__input"
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={submitting}
            />
          </label>

          <button
            type="submit"
            className="btn btn--primary login-form__submit"
            disabled={submitting || !canSubmit}
          >
            {submitting ? 'Creating…' : 'Create account'}
          </button>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <GoogleSignInButton
            onCredential={handleGoogle}
            disabled={submitting}
            promptReturningUser
            context="signup"
          />

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </main>
      <AppFooter />
    </div>
  )
}
