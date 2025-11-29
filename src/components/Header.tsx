import { Link, useNavigate } from "react-router-dom"
import { useCallback, useMemo } from "react"
import { useAuth } from "../context/authContext"

export default function Header() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = useCallback(() => {
    setUser(null)
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    navigate("/login")
  }, [navigate, setUser])

  const canViewMyPosts = useMemo(
    () => !!user?.roles?.some((r: string) => r === "ADMIN" || r === "AUTHOR"),
    [user?.roles]
  )

  return (
    <header className="bg-white/95 text-light_text border-b border-gray-100/80 shadow-sm px-6 py-4 flex justify-between items-center dark:bg-white/10 dark:text-lavender_grey-900 dark:border-white/15 transition-colors" role="banner">
      <nav className="flex gap-6 text-sm font-medium" aria-label="Main navigation">
        <Link to="/home" className="hover:text-smart_blue-600 dark:hover:text-brandText transition-colors">
          Home
        </Link>
        {canViewMyPosts && (
          <Link to="/my-post" className="hover:text-smart_blue-600 dark:hover:text-brandText transition-colors">
            My Posts
          </Link>
        )}
      </nav>
      <div className="flex items-center gap-4">
        <span className="text-light_text dark:text-blue_slate-800 text-sm">{user?.email || "Guest"}</span>
        {user && (
          <button
            onClick={handleLogout}
            className="px-8 py-3 font-semibold rounded-xl bg-white/90 border border-gray-200 text-smart_blue-700 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-smart_blue-400/70 transition dark:bg-white/15 dark:border-white/25 dark:text-lavender_grey-900 dark:hover:bg-white/25"
            type="button"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  )
}
