import { useState } from "react"
import Button from "../../components/button/Button"
import { Input } from "../../components/input/Input"
import { Label } from "../../components/input/Label"

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!form.email || !form.password) {
      setError("Please fill all fields")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Invalid credentials")
        setLoading(false)
        return
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      setSuccess("Login successful!")

      setTimeout(() => {
        window.location.href = "/"
      }, 1000)

    } catch {
      setError("Something went wrong. Try again.")
    }

    setLoading(false)
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundColor: "var(--color-dark)" }}
    >
      {/* Card */}
      <div
        className="
          w-full max-w-md 
          rounded-2xl 
          p-10 
          shadow-xl 
          backdrop-blur-xl 
          border border-gray-700 
        "
        style={{
          background: "rgba(255,255,255,0.05)",
        }}
      >
        {/* Title */}
        <h2
          className="text-3xl font-extrabold text-center mb-8 tracking-wide"
          style={{ color: "var(--color-white)" }}
        >
          Hospital Management
          <span style={{ color: "var(--color-red)" }}> Login</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <Label
              htmlFor="email"
              className="font-medium"
              style={{ color: "var(--color-gray)" }}
            >
              Email Address
            </Label>

            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              variant="input"
              className="text-white"
            />
          </div>

          {/* Password */}
          <div>
            <Label
              htmlFor="password"
              className="font-medium"
              style={{ color: "var(--color-gray)" }}
            >
              Password
            </Label>

            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              variant="input"
              className="text-white"
            />
          </div>

          {/* Alerts */}
          {error && (
            <p className="text-red text-sm text-center">{error}</p>
          )}
          {success && (
            <p className="text-green text-sm text-center">{success}</p>
          )}

          {/* Button */}
          <Button
            type="submit"
            disabled={loading}
            className="
              mx-auto px-7
            "
            style={{
              background: "var(--color-red)",
              color: "var(--color-white)",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        {/* Footer */}
        <p
          className="text-center text-xs mt-6 tracking-wide"
          style={{ color: "var(--color-gray)" }}
        >
          © {new Date().getFullYear()} Hospital Management System
        </p>
      </div>
    </div>
  )
}

export default Login
