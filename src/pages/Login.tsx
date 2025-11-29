import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/authContext"
import { login, getMyDetails, type LoginResponse, type UserDetailsResponse } from "../services/auth"
import { isAxiosError } from "axios"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { setUser } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault() // prevent page refresh

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.")
      return
    }

    setError(null)
    setLoading(true)
    try {
      const data: LoginResponse = await login(email, password)

      if (data?.data?.accessToken) {
        localStorage.setItem("accessToken", data.data.accessToken)
        localStorage.setItem("refreshToken", data.data.refreshToken)

        const resData: UserDetailsResponse = await getMyDetails()
        setUser(resData.data)
        navigate("/home")
      } else {
        setError("Login failed. Please check your credentials.")
      }
    } catch (err) {
      console.error("Login error:", err)
      if (isAxiosError(err)) {
        const message = (err.response?.data as { message?: string } | undefined)?.message
        setError(message ?? "Login failed. Please check your credentials.")
      } else {
        setError("Login failed. Please try again.")
      }
    } finally {
      setLoading(false)
    }

    // ----- Example of axios call (besic) -----
    /*
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        { email: username, password },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
    */
  }

  return (
    <div className="min-h-screen bg-app-gradient flex items-center justify-center p-6 text-light_text dark:text-lavender_grey-900">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 space-y-8 dark:bg-white/10 dark:backdrop-blur-xl dark:ring-1 dark:ring-white/10 dark:border-transparent">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-heading-gradient">Welcome Back</h1>
          <p className="text-sm text-slate-600 dark:text-blue_slate-800">Sign in to continue your interview prep.</p>
        </div>

        <form className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-blue_slate-800">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
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
              autoComplete="current-password"
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
            onClick={handleLogin}
            disabled={loading}
            className="w-full btn-primary-gradient py-3 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-turquoise_surf-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center text-sm text-slate-600 dark:text-blue_slate-800">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="font-semibold text-smart_blue-600 hover:text-smart_blue-700 dark:text-brandText dark:hover:text-smart_blue-600 transition"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  )
}
