import { useState } from 'react'
import { Mail, Lock, User, Wallet, Loader2 } from 'lucide-react'
import { useAuth } from '../../context'
import { Button, Input } from '../ui'
import './AuthForm.css'

function AuthForm() {
  const { login, signup, isLoading, error } = useAuth()
  
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [formError, setFormError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    // Validation
    if (!formData.email || !formData.password) {
      setFormError('Please fill in all required fields')
      return
    }

    if (!isLoginMode) {
      if (!formData.name) {
        setFormError('Please enter your name')
        return
      }
      if (formData.password !== formData.confirmPassword) {
        setFormError('Passwords do not match')
        return
      }
      if (formData.password.length < 6) {
        setFormError('Password must be at least 6 characters')
        return
      }
    }

    try {
      if (isLoginMode) {
        await login(formData.email, formData.password)
      } else {
        await signup(formData.name, formData.email, formData.password)
      }
    } catch (err: any) {
      setFormError(err.message || 'Authentication failed')
    }
  }

  const switchMode = () => {
    setIsLoginMode(!isLoginMode)
    setFormError(null)
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    })
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <Wallet size={32} />
          </div>
          <h1>ExpenseFlow</h1>
          <p>Personal Finance Tracker</p>
        </div>

        {/* Title */}
        <h2 className="auth-title">
          {isLoginMode ? 'Welcome back!' : 'Create account'}
        </h2>
        <p className="auth-subtitle">
          {isLoginMode 
            ? 'Sign in to manage your finances' 
            : 'Start tracking your expenses today'}
        </p>

        {/* Error Message */}
        {(formError || error) && (
          <div className="auth-error">
            {formError || error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Name (Signup only) */}
          {!isLoginMode && (
            <div className="auth-input-group">
              <User size={18} className="auth-input-icon" />
              <input
                type="text"
                placeholder="Full name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="auth-input"
              />
            </div>
          )}

          {/* Email */}
          <div className="auth-input-group">
            <Mail size={18} className="auth-input-icon" />
            <input
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="auth-input"
            />
          </div>

          {/* Password */}
          <div className="auth-input-group">
            <Lock size={18} className="auth-input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="auth-input"
            />
          </div>

          {/* Confirm Password (Signup only) */}
          {!isLoginMode && (
            <div className="auth-input-group">
              <Lock size={18} className="auth-input-icon" />
              <input
                type="password"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="auth-input"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="auth-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="spinner" />
                {isLoginMode ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              isLoginMode ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        {/* Switch Mode */}
        <p className="auth-switch">
          {isLoginMode ? "Don't have an account?" : "Already have an account?"}
          <button 
            type="button"
            onClick={switchMode}
            className="auth-switch-btn"
          >
            {isLoginMode ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default AuthForm