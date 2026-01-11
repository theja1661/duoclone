import './SignIn.css'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { apiService } from '../services/api'
import { saveUser } from '../context/UserContext'

function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Show success message from signup redirect
    if (location.state?.message) {
      setSuccessMessage(location.state.message)
      setTimeout(() => setSuccessMessage(''), 5000)
    }
  }, [location])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validate inputs
      if (!email.trim() || !password.trim()) {
        setError('Email and password are required')
        setLoading(false)
        return
      }

      // Call backend login
      const response = await apiService.login({
        email: email.trim(),
        password,
      })

      if (response.error) {
        setError(response.error)
      } else {
        // Save user data to localStorage
        saveUser({
          name: response.name,
          email: response.email,
          role: response.role,
          userId: response.userId,
          createdAt: response.createdAt
        })
        
        // Login successful, redirect based on role (handle both formats)
        const userRole = response.role.replace('ROLE_', '')
        if (userRole === 'ADMIN') {
          navigate('/admin')
        } else {
          navigate('/home')
        }
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(err.response?.data?.error || err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-inner">
        <div className="auth-splash">
          <div
            className="splash-svg"
            aria-hidden="true"
            dangerouslySetInnerHTML={{
              __html: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="120" height="120">
                <rect width="120" height="120" rx="16" fill="#fff7ed"/>
                <g transform="translate(10,10)">
                  <circle cx="50" cy="30" r="22" fill="#fb923c"/>
                  <rect x="10" y="60" width="80" height="28" rx="6" fill="#ffd8b3"/>
                  <path d="M18 68h44" stroke="#ea580c" stroke-width="3" stroke-linecap="round"/>
                  <path d="M18 78h30" stroke="#ea580c" stroke-width="3" stroke-linecap="round"/>
                </g>
              </svg>`,
            }}
          />
          <h2>Learn technical skills, bite-sized</h2>
          <p>
            TechLingo helps you practice programming concepts through short exercises,
            code snippets and multiple-choice challenges. Track progress and keep a daily streak.
          </p>
        </div>

        <div className="auth-card">
          <h1>Welcome Back!</h1>
          <p>Sign in to continue your learning journey</p>
          
          {successMessage && <div className="success-message">{successMessage}</div>}
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>
            
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          <div className="auth-footer" style={{ marginTop: 18 }}>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn
