import { useAuth } from "../context/authContext"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { changeMyPassword, updateMyDetails } from "../services/auth"

export default function UserDetails() {
  const { user, loading, setUser } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstname: "", lastname: "", email: "" })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" })
  const [pwSaving, setPwSaving] = useState(false)
  const [pwMessage, setPwMessage] = useState<string | null>(null)
  const [pwError, setPwError] = useState<string | null>(null)

  // Sync form when user data loads or changes
  useEffect(() => {
    if (user) {
      setForm({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || ""
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPwForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    setError(null)
    try {
      const payload: Record<string, string> = {}
      if (form.firstname !== user?.firstname) payload.firstname = form.firstname.trim()
      if (form.lastname !== user?.lastname) payload.lastname = form.lastname.trim()
      if (form.email !== user?.email) payload.email = form.email.trim()

      if (Object.keys(payload).length === 0) {
        setMessage("No changes to save")
        setSaving(false)
        return
      }

      const res = await updateMyDetails(payload)
      setUser(res.data || null)
      setMessage("Profile updated successfully")
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    setPwSaving(true)
    setPwMessage(null)
    setPwError(null)
    try {
      const { currentPassword, newPassword, confirmPassword } = pwForm

      if (!currentPassword || !newPassword || !confirmPassword) {
        setPwError("Please fill in all password fields")
        setPwSaving(false)
        return
      }

      if (newPassword !== confirmPassword) {
        setPwError("New password and confirmation do not match")
        setPwSaving(false)
        return
      }

      if (newPassword.length < 8) {
        setPwError("New password must be at least 8 characters")
        setPwSaving(false)
        return
      }

      await changeMyPassword({ currentPassword, newPassword })
      setPwMessage("Password updated successfully")
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (err: any) {
      setPwError(err?.response?.data?.message || "Failed to update password")
    } finally {
      setPwSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-smart_blue-600 border-dashed rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <div className="rounded-xl border border-gray-200 dark:border-white/20 bg-white/90 dark:bg-white/10 p-6">
          <h2 className="text-lg font-semibold mb-2">No user data</h2>
          <p className="text-sm text-gray-600 dark:text-lavender_grey-900">Please log in to view your details.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="rounded-xl border border-gray-200 dark:border-white/20 bg-white/90 dark:bg-white/10 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Profile Details</h1>
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="inline-flex items-center gap-1 text-sm font-medium text-smart_blue-600 hover:text-smart_blue-700 dark:text-brandText dark:hover:text-smart_blue-600 transition"
            aria-label="Back to home"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back
          </button>
        </div>
        <div className="space-y-4 text-sm">
          <div className="flex flex-col">
            <label className="text-gray-600 dark:text-lavender_grey-900 mb-1">First Name</label>
            <input
              name="firstname"
              value={form.firstname}
              onChange={handleChange}
              className="px-3 py-2 rounded border border-gray-300 dark:border-white/20 bg-white/80 dark:bg-white/10 focus:outline-none focus:ring-2 focus:ring-smart_blue-400"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 dark:text-lavender_grey-900 mb-1">Last Name</label>
            <input
              name="lastname"
              value={form.lastname}
              onChange={handleChange}
              className="px-3 py-2 rounded border border-gray-300 dark:border-white/20 bg-white/80 dark:bg-white/10 focus:outline-none focus:ring-2 focus:ring-smart_blue-400"
            />
          </div>
            <div className="flex flex-col">
            <label className="text-gray-600 dark:text-lavender_grey-900 mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="px-3 py-2 rounded border border-gray-300 dark:border-white/20 bg-white/80 dark:bg-white/10 focus:outline-none focus:ring-2 focus:ring-smart_blue-400"
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-gray-600 dark:text-lavender_grey-900">Change Password</label>
            <input
              name="currentPassword"
              type="password"
              placeholder="Current password"
              value={pwForm.currentPassword}
              onChange={handlePasswordChange}
              className="px-3 py-2 rounded border border-gray-300 dark:border-white/20 bg-white/80 dark:bg-white/10 focus:outline-none focus:ring-2 focus:ring-smart_blue-400"
            />
            <input
              name="newPassword"
              type="password"
              placeholder="New password"
              value={pwForm.newPassword}
              onChange={handlePasswordChange}
              className="px-3 py-2 rounded border border-gray-300 dark:border-white/20 bg-white/80 dark:bg-white/10 focus:outline-none focus:ring-2 focus:ring-smart_blue-400"
            />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={pwForm.confirmPassword}
              onChange={handlePasswordChange}
              className="px-3 py-2 rounded border border-gray-300 dark:border-white/20 bg-white/80 dark:bg-white/10 focus:outline-none focus:ring-2 focus:ring-smart_blue-400"
            />
            {pwMessage && <p className="text-xs text-green-600 dark:text-green-400">{pwMessage}</p>}
            {pwError && <p className="text-xs text-red-600 dark:text-red-400">{pwError}</p>}
            <div>
              <button
                type="button"
                disabled={pwSaving}
                onClick={handleChangePassword}
                className="px-4 py-2 text-sm rounded bg-smart_blue-600 text-white hover:bg-smart_blue-700 focus:outline-none focus:ring-2 focus:ring-smart_blue-400/50 disabled:opacity-50 transition"
              >
                {pwSaving ? "Updating..." : "Change Password"}
              </button>
            </div>
          </div>
        </div>
        {message && <p className="mt-4 text-xs text-green-600 dark:text-green-400">{message}</p>}
        {error && <p className="mt-4 text-xs text-red-600 dark:text-red-400">{error}</p>}
        <div className="flex gap-3 mt-6">
          <button
            disabled={saving}
            onClick={handleSave}
            className="px-4 py-2 text-sm rounded bg-regal_navy-500 text-white hover:bg-regal_navy-600 focus:outline-none focus:ring-2 focus:ring-regal_navy-400/50 disabled:opacity-50 transition"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => {
              if (user) {
                setForm({
                  firstname: user.firstname || "",
                  lastname: user.lastname || "",
                  email: user.email || ""
                })
              }
              setMessage(null)
              setError(null)
            }}
            className="px-4 py-2 text-sm rounded bg-gray-200 dark:bg-white/20 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-white/30 disabled:opacity-50"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}
