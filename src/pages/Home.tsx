import { useAuth } from "../context/authContext"
import { useNavigate } from "react-router-dom"

export default function Home() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    navigate("/login")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full text-light_text dark:text-lavender_grey-900">
      <h1 className="text-4xl font-bold mb-4 text-light_text dark:text-brandText drop-shadow-sm">
        Welcome, {user?.email || "User"}!
      </h1>
      <p className="mb-8 text-light_text dark:text-blue_slate-800 max-w-xl text-center">
        You are now logged in. This is your Home page.
      </p>
      <div className="flex gap-4">
        <button
          onClick={handleLogout}
          className="px-6 py-2 rounded-md bg-smart_blue-600 hover:bg-smart_blue-700 text-white dark:text-cornsilk-900 font-semibold shadow focus:outline-none focus:ring-2 focus:ring-smart_blue-400/60 transition"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
