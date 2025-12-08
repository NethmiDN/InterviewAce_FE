import { Link, useNavigate } from "react-router-dom"
import { useCallback, useMemo, useState, useRef, useEffect } from "react"
import { useAuth } from "../context/authContext"
import Logo from "./Logo"

export default function Header() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const avatarRef = useRef<HTMLDivElement>(null)

  const handleLogout = useCallback(() => {
    setUser(null)
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    navigate("/", { replace: true })
  }, [navigate, setUser])

  // Safe derived user fields (try multiple keys; never show email)
  const firstName = useMemo(() => {
    const anyUser = user as Record<string, unknown> | null
    const raw =
      (anyUser?.firstname as unknown) ||
      (anyUser?.firstName as unknown) ||
      (anyUser?.given_name as unknown) ||
      (typeof anyUser?.name === "string" ? (anyUser?.name as string).split(" ")[0] : undefined)

    if (typeof raw === "string" && raw.trim().length > 0) {
      return raw.trim()
    }
    // Do not fall back to email local-part; hide email entirely
    return undefined
  }, [user])
  // We only need first name for display; omit email/last name
  const avatarInitial = useMemo(
    () => (firstName && firstName.length > 0 ? firstName.charAt(0).toUpperCase() : undefined),
    [firstName]
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dropdownOpen])

  return (
    <header className="bg-white/95 text-light_text border-b border-gray-100/80 shadow-sm px-6 py-4 flex justify-between items-center dark:bg-white/10 dark:text-lavender_grey-900 dark:border-white/15 transition-colors" role="banner">
      <div className="flex items-center gap-6">
        <Logo />
        <nav className="hidden md:flex gap-6 text-sm font-medium" aria-label="Main navigation">
          {/* Add nav links here if needed */}
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div
          ref={avatarRef}
          className="relative"
        >
          <button
            className="w-10 h-10 rounded-full bg-smart_blue-600 flex items-center justify-center text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-smart_blue-400/60"
            onClick={() => setDropdownOpen((open) => !open)}
            aria-label="User menu"
            type="button"
          >
            {avatarInitial ? (
              avatarInitial
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
              </svg>
            )}
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-4 z-50 dark:bg-white/10 dark:border-white/15">
              <div className="px-4 pb-2 border-b border-gray-100 dark:border-white/15">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-smart_blue-600 flex items-center justify-center text-white font-bold text-lg">
                    {avatarInitial ? (
                      avatarInitial
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-light_text dark:text-lavender_grey-900">{firstName || "User"}</div>
                  </div>
                </div>
              </div>
              <div className="px-4 pt-2">
                <Link to="/user" className="block py-2 text-sm text-light_text hover:text-smart_blue-600 dark:text-lavender_grey-900 dark:hover:text-brandText transition-colors">User Details</Link>
                <button
                  onClick={handleLogout}
                  className="w-full mt-2 px-4 py-2 font-semibold rounded-xl bg-white/90 text-red-600 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-smart_blue-400/70 transition dark:bg-white/15 dark:text-red-500 dark:hover:bg-white/25"
                  type="button"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
