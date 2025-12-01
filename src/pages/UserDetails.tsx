import { useAuth } from "../context/authContext"
import { useEffect, useState } from "react"
import { updateMyDetails } from "../services/auth"

export default function UserDetails() {
  const { user, loading, setUser } = useAuth()
  const [form, setForm] = useState({ firstname: "", lastname: "", email: "" })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

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
        <h1 className="text-xl font-bold mb-4">Profile Details</h1>
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
          <div className="flex flex-col">
            <label className="text-gray-600 dark:text-lavender_grey-900 mb-1">Password</label>
            <span className="font-medium text-light_text dark:text-lavender_grey-900">********</span>
            <span className="text-[10px] text-gray-500 dark:text-lavender_grey-900 mt-1">Password changes are handled separately.</span>
          </div>
        </div>
        {message && <p className="mt-4 text-xs text-green-600 dark:text-green-400">{message}</p>}
        {error && <p className="mt-4 text-xs text-red-600 dark:text-red-400">{error}</p>}
        <div className="flex gap-3 mt-6">
          <button
            disabled={saving}
            onClick={handleSave}
            className="px-4 py-2 text-sm rounded bg-smart_blue-600 text-white hover:bg-smart_blue-700 disabled:opacity-50"
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
