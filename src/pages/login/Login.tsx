import { useState } from 'react'
import Button from '../../components/button/Button'
import { Input } from '../../components/input/Input'
import { Label } from '../../components/input/Label'

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const API_BASE = import.meta.env.VITE_API_BASE_URL

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.email || !form.password) {
      setError('Please fill all fields')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Invalid credentials')
        setLoading(false)
        return
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      setSuccess('Login successful!')

      setTimeout(() => {
        window.location.href = '/'
      }, 1000)
    } catch {
      setError('Something went wrong. Try again.')
    }

    setLoading(false)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: 'var(--color-gray)' }}
    >
      {/* Login Card */}
      <div
        className="
          w-full max-w-md bg-white 
          rounded-xl p-10 shadow-lg
        "
      >
        {/* Header */}
        <p className="text-[40px] text-dark font-bold text-center ">
          HIKARI<span className="text-yellow">MED</span>
        </p>
        <h2
          className="text-3xl font-bold text-center mb-6"
          style={{ color: 'var(--color-dark)' }}
        >
          Hospital Management
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <Label
              htmlFor="email"
              className="font-medium text-sm"
              style={{ color: 'var(--color-dark)' }}
            >
              Email
            </Label>

            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
              variant="input"
            />
          </div>

          {/* Password */}
          {/* Password */}
          <div className="relative">
            <Label
              htmlFor="password"
              className="font-medium text-sm"
              style={{ color: 'var(--color-dark)' }}
            >
              Password
            </Label>

            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              variant="input"
              className="pr-10" // space for eye icon
            />

            {/* Eye Icon */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[32px] text-gray-500 hover:text-dark cursor-pointer"
            >
              {showPassword ? (
                /* Eye Off */
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.78 21.78 0 0 1 5.06-6.94" />
                  <path d="M1 1l22 22" />
                  <path d="M9.53 9.53A3.5 3.5 0 0 0 12 15.5a3.5 3.5 0 0 0 2.47-.97" />
                  <path d="M14.47 14.47A3.5 3.5 0 0 0 12 8.5a3.5 3.5 0 0 0-2.47.97" />
                </svg>
              ) : (
                /* Eye */
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          {/* Alerts */}
          {error && <p className="text-red text-sm text-center">{error}</p>}
          {success && (
            <p className="text-green text-sm text-center">{success}</p>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full py-2 flex justify-center font-semibold"
            style={{
              background: 'var(--color-gray)',
              color: 'var(--color-dark)',
              opacity: loading ? 0.8 : 1,
            }}
          >
            {loading ? 'Please wait...' : 'Login'}
          </Button>
        </form>

        {/* Footer */}
        <p
          className="text-center text-xs mt-6 font-semibold"
          style={{ color: 'var(--color-dark)' }}
        >
          © {new Date().getFullYear()} HIKARIMED HMS
        </p>
      </div>
    </div>
  )
}

export default Login
