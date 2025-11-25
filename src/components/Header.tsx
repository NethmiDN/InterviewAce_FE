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
    <header className="bg-white text-light_text border-b border-gray-200 shadow-sm px-6 py-4 flex justify-between items-center dark:bg-prussian_blue_deep-500 dark:text-lavender_grey-900 dark:border-twilight_indigo-300/40 transition-colors" role="banner">
      <nav className="flex gap-6 text-sm font-medium" aria-label="Main navigation">
        <Link to="/home" className="hover:text-smart_blue-600 dark:hover:text-brandText transition-colors">
          Home
        </Link>
        <Link to="/post" className="hover:text-smart_blue-600 dark:hover:text-brandText transition-colors">
          Posts
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
            className="px-3 py-1 rounded-md bg-smart_blue-600 hover:bg-smart_blue-700 text-white dark:text-cornsilk-900 text-sm font-semibold shadow focus:outline-none focus:ring-2 focus:ring-smart_blue-400/60"
            type="button"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  )
}
