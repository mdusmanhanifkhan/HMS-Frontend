import { useState } from 'react'
import Button from '../../components/button/Button'
import { Input } from '../../components/input/Input'
import { Label } from '../../components/input/Label'

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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
          <div>
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
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              variant="input"
            />
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
