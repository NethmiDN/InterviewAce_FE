import React, { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { isAxiosError } from "axios"
import api from "../services/api" // Assuming we'll add the service function later or call api directly for now specific to this new page needs
import { validatePassword } from "../utils/validation"
import Swal from "sweetalert2"

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
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    // status state removed in favor of SweetAlert

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!email || !otp || !newPassword) {
            Swal.fire({
                icon: "warning",
                title: "Incomplete Details",
                text: "All fields are required",
                confirmButtonColor: "#3B82F6",
            })
            return
        }

        const passwordError = validatePassword(newPassword)
        if (passwordError) {
            Swal.fire({
                icon: "warning",
                title: "Weak Password",
                text: passwordError,
                confirmButtonColor: "#3B82F6",
            })
            return
        }

        setLoading(true)

        try {
            // NOTE: This endpoint corresponds to what we will likely create on the backend:
            // POST /api/v1/auth/reset-password
            await api.post("/auth/reset-password", {
                email,
                otp,
                newPassword
            })

            await Swal.fire({
                icon: "success",
                title: "Password Reset Successful",
                text: "You can now login with your new password.",
                confirmButtonColor: "#22c55e",
                timer: 2000,
                showConfirmButton: false
            })
            navigate("/login")

        } catch (err) {
            console.error("Reset password error:", err)
            let message = "An error occurred. Please try again."
            if (isAxiosError(err)) {
                message = (err.response?.data as { message?: string } | undefined)?.message ?? "Failed to reset password"
            }

            Swal.fire({
                icon: "error",
                title: "Reset Failed",
                text: message,
                confirmButtonColor: "#EF4444",
            })
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
                        <div className="relative">
                            <input
                                id="newPassword"
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-light_text placeholder-slate-400 shadow-sm focus:outline-none focus:border-smart_blue-500 focus:ring-2 focus:ring-smart_blue-500/30 dark:border-bright_teal_blue-400/40 dark:bg-white/10 dark:text-lavender_grey-900 dark:focus:border-turquoise_surf-500 dark:focus:ring-turquoise_surf-500/40 pr-10"
                                placeholder="••••••••"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                            >
                                {showNewPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
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

