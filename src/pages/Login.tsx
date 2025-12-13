import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/authContext"
import { login, getMyDetails, requestPasswordReset, type LoginResponse, type UserDetailsResponse } from "../services/auth"
import { isAxiosError } from "axios"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [forgotModalOpen, setForgotModalOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetLoading, setResetLoading] = useState(false)
  const [resetStatus, setResetStatus] = useState<{ type: "success" | "error"; text: string } | null>(null)

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

  const openForgotPassword = () => {
    setResetStatus(null)
    setResetEmail(email)
    setForgotModalOpen(true)
  }

  const closeForgotPassword = () => {
    setForgotModalOpen(false)
    setResetStatus(null)
    setResetEmail("")
  }

  const handleForgotSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!resetEmail.trim()) {
      setResetStatus({ type: "error", text: "Please enter the email associated with your account." })
      return
    }

    setResetStatus(null)
    setResetLoading(true)
    try {
      await requestPasswordReset(resetEmail.trim())
      setResetStatus({
        type: "success",
        text: "If the email exists in our records, you'll receive reset instructions shortly."
      })
      setTimeout(() => {
        navigate("/verify-otp", { state: { email: resetEmail.trim() } })
      }, 1500)
    } catch (err) {
      console.error("Forgot password error:", err)
      if (isAxiosError(err)) {
        const message = (err.response?.data as { message?: string } | undefined)?.message
        setResetStatus({ type: "error", text: message ?? "Unable to process your request." })
      } else {
        setResetStatus({ type: "error", text: "Unable to process your request." })
      }
    } finally {
      setResetLoading(false)
    }
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
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
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

          <div className="text-right text-sm">
            <button
              type="button"
              onClick={openForgotPassword}
              className="font-semibold text-smart_blue-600 hover:text-smart_blue-700 dark:text-brandText"
            >
              Forgot password?
            </button>
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

      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeForgotPassword}></div>
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-lavender_grey-900">Reset password</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-blue_slate-800">
                  Enter the email associated with your account and we&apos;ll email you a reset link.
                </p>
              </div>
              <button
                type="button"
                onClick={closeForgotPassword}
                className="text-slate-400 hover:text-slate-600"
                aria-label="Close reset password modal"
              >
                ✕
              </button>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleForgotSubmit}>
              <div className="space-y-2">
                <label htmlFor="reset-email" className="text-sm font-medium text-slate-700 dark:text-blue_slate-800">
                  Email address
                </label>
                <input
                  id="reset-email"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-light_text shadow-sm focus:outline-none focus:border-smart_blue-500 focus:ring-2 focus:ring-smart_blue-500/30 dark:border-bright_teal_blue-400/40 dark:bg-white/5 dark:text-lavender_grey-900"
                  disabled={resetLoading}
                />
              </div>

              {resetStatus && (
                <div
                  className={`rounded-lg px-3 py-2 text-sm font-medium ${resetStatus.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-600 border border-red-200"
                    }`}
                >
                  {resetStatus.text}
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="flex-1 btn-primary-gradient rounded-xl py-3 font-semibold disabled:opacity-60"
                >
                  {resetLoading ? "Sending..." : "Send OTP"}
                </button>
                <button
                  type="button"
                  onClick={closeForgotPassword}
                  className="flex-1 rounded-xl border border-slate-300 py-3 font-semibold text-slate-600 hover:bg-slate-50 dark:text-lavender_grey-900"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
