import React, { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { isAxiosError } from "axios"
import api from "../services/api" // Assuming we'll add the service function later or call api directly for now specific to this new page needs
import { validatePassword } from "../utils/validation"

// We need to define the service call. Since I can't edit services/auth.ts in the same step, 
// I'll define a local helper or assume it exists. 
// For now, I'll put the API call logic here or use a placeholder, 
// strictly creating the UI as requested. 
// I'll define the 'verifyOtpAndResetPassword' interface here or use the raw axios call 
// if I want to be safe until I update the service file.

export default function VerifyOtp() {
    const location = useLocation()
    const navigate = useNavigate()

    // Expect email passed from Login page
    const emailFromState = location.state?.email || ""

    const [email, setEmail] = useState(emailFromState)
    const [otp, setOtp] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!email || !otp || !newPassword) {
            setStatus({ type: "error", text: "All fields are required" })
            return
        }

        const passwordError = validatePassword(newPassword)
        if (passwordError) {
            setStatus({ type: "error", text: passwordError })
            return
        }

        setLoading(true)
        setStatus(null)

        try {
            // NOTE: This endpoint corresponds to what we will likely create on the backend:
            // POST /api/v1/auth/reset-password
            await api.post("/auth/reset-password", {
                email,
                otp,
                newPassword
            })

            setStatus({ type: "success", text: "Password reset successfully! Redirecting to login..." })

            setTimeout(() => {
                navigate("/login")
            }, 2000)

        } catch (err) {
            console.error("Reset password error:", err)
            if (isAxiosError(err)) {
                const message = (err.response?.data as { message?: string } | undefined)?.message
                setStatus({ type: "error", text: message ?? "Failed to reset password" })
            } else {
                setStatus({ type: "error", text: "An error occurred. Please try again." })
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-app-gradient flex items-center justify-center p-6 text-light_text dark:text-lavender_grey-900">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 space-y-8 dark:bg-white/10 dark:backdrop-blur-xl dark:ring-1 dark:ring-white/10 dark:border-transparent">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-extrabold tracking-tight text-heading-gradient">Verify OTP</h1>
                    <p className="text-sm text-slate-600 dark:text-blue_slate-800">
                        Enter the OTP sent to your email and set a new password.
                    </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-blue_slate-800">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-light_text shadow-sm focus:outline-none dark:border-bright_teal_blue-400/40 dark:bg-white/5 dark:text-lavender_grey-900"
                            placeholder="you@example.com"
                            disabled={loading} // might want to allow editing if they realized they typed wrong email? 
                        // But usually this flow continues from previous. 
                        // Leaving it editable but pre-filled is good practice if they need to correction, logic-wise though they requested OTP for *this* email.
                        // Actually, if they change the email, the OTP won't match the one generated for the *original* email unless they request again.
                        // So maybe better to keep it readOnly or imply they should go back if it's wrong.
                        // I'll leave it editable for flexibility but standard is often read-only.
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="otp" className="text-sm font-medium text-slate-700 dark:text-blue_slate-800">
                            OTP Code
                        </label>
                        <input
                            id="otp"
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-light_text placeholder-slate-400 shadow-sm focus:outline-none focus:border-smart_blue-500 focus:ring-2 focus:ring-smart_blue-500/30 dark:border-bright_teal_blue-400/40 dark:bg-white/10 dark:text-lavender_grey-900 dark:focus:border-turquoise_surf-500 dark:focus:ring-turquoise_surf-500/40"
                            placeholder="123456"
                            disabled={loading}
                            maxLength={6}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="newPassword" className="text-sm font-medium text-slate-700 dark:text-blue_slate-800">
                            New Password
                        </label>
                        <input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-light_text placeholder-slate-400 shadow-sm focus:outline-none focus:border-smart_blue-500 focus:ring-2 focus:ring-smart_blue-500/30 dark:border-bright_teal_blue-400/40 dark:bg-white/10 dark:text-lavender_grey-900 dark:focus:border-turquoise_surf-500 dark:focus:ring-turquoise_surf-500/40"
                            placeholder="••••••••"
                            disabled={loading}
                        />
                    </div>

                    {status && (
                        <div
                            className={`rounded-lg px-3 py-2 text-sm font-medium ${status.type === "success"
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "bg-red-50 text-red-600 border border-red-200"
                                }`}
                        >
                            {status.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary-gradient py-3 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-turquoise_surf-600 transition disabled:opacity-50"
                    >
                        {loading ? "Verifying..." : "Submit OTP & Reset Password"}
                    </button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="text-sm text-slate-500 hover:text-slate-700 dark:text-blue_slate-800 dark:hover:text-lavender_grey-900"
                        >
                            Back to Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
