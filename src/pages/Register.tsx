import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { register, type RegisterPayload, type RegisterResponse } from "../services/auth"
import { isAxiosError } from "axios"
import { validatePassword } from "../utils/validation"

export default function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
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

    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
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
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-light_text placeholder-slate-400 shadow-sm focus:outline-none focus:border-smart_blue-500 focus:ring-2 focus:ring-smart_blue-500/30 dark:border-bright_teal_blue-400/40 dark:bg-white/10 dark:text-lavender_grey-900 dark:placeholder-frosted_blue-400 dark:focus:border-turquoise_surf-500 dark:focus:ring-turquoise_surf-500/40 pr-10"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
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
