import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { register, type RegisterPayload, type RegisterResponse } from "../services/auth"
import { isAxiosError } from "axios"

export default function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const handleRegister = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!email || !password || !firstName || !lastName) {
      setError("Please fill in all fields.")
      return
    }
    setError(null)
    setLoading(true)
    try {
      const payload: RegisterPayload = {
        email,
        password,
        firstname: firstName,
        lastname: lastName
      }
      const data: RegisterResponse = await register(payload)
      alert(`Registration successful! Email: ${data.data.email}`)
      navigate("/login")
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const message = (err.response?.data as { message?: string } | undefined)?.message
        setError(message ?? "Registration failed. Please try again.")
      } else {
        console.error("Registration error:", err)
        setError("Registration failed. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-app-gradient flex items-center justify-center p-6 text-light_text dark:text-lavender_grey-900">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 space-y-8 dark:bg-white/10 dark:backdrop-blur-xl dark:ring-1 dark:ring-white/10 dark:border-transparent">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-heading-gradient">
            Create Account
          </h1>
          <p className="text-sm text-slate-600 dark:text-blue_slate-800">Join us and start your journey.</p>
        </div>

        <form className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium text-slate-700 dark:text-blue_slate-800">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              placeholder="Jane"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-light_text placeholder-slate-400 shadow-sm focus:outline-none focus:border-smart_blue-500 focus:ring-2 focus:ring-smart_blue-500/30 dark:border-bright_teal_blue-400/40 dark:bg-white/10 dark:text-lavender_grey-900 dark:placeholder-frosted_blue-400 dark:focus:border-turquoise_surf-500 dark:focus:ring-turquoise_surf-500/40"
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium text-slate-700 dark:text-blue_slate-800">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-light_text placeholder-slate-400 shadow-sm focus:outline-none focus:border-smart_blue-500 focus:ring-2 focus:ring-smart_blue-500/30 dark:border-bright_teal_blue-400/40 dark:bg-white/10 dark:text-lavender_grey-900 dark:placeholder-frosted_blue-400 dark:focus:border-turquoise_surf-500 dark:focus:ring-turquoise_surf-500/40"
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-blue_slate-800">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="jane.doe@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-light_text placeholder-slate-400 shadow-sm focus:outline-none focus:border-smart_blue-500 focus:ring-2 focus:ring-smart_blue-500/30 dark:border-bright_teal_blue-400/40 dark:bg-white/10 dark:text-lavender_grey-900 dark:placeholder-frosted_blue-400 dark:focus:border-turquoise_surf-500 dark:focus:ring-turquoise_surf-500/40"
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-blue_slate-800">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-light_text placeholder-slate-400 shadow-sm focus:outline-none focus:border-smart_blue-500 focus:ring-2 focus:ring-smart_blue-500/30 dark:border-bright_teal_blue-400/40 dark:bg-white/10 dark:text-lavender_grey-900 dark:placeholder-frosted_blue-400 dark:focus:border-turquoise_surf-500 dark:focus:ring-turquoise_surf-500/40"
              disabled={loading}
            />
          </div>
          {error && (
            <div className="text-sm text-red-600 font-medium bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full btn-primary-gradient py-3 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-turquoise_surf-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="text-center text-sm text-slate-600 dark:text-blue_slate-800">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="font-semibold text-smart_blue-600 hover:text-smart_blue-700 dark:text-brandText dark:hover:text-smart_blue-600 transition"
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  )
}
