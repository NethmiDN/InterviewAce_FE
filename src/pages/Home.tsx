import { useAuth } from "../context/authContext"
import { useNavigate } from "react-router-dom"

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // const handleLogout = () => {
  //   setUser(null)
  //   localStorage.removeItem("accessToken")
  //   localStorage.removeItem("refreshToken")
  //   navigate("/", { replace: true })
  // }

  return (
    <div className="min-h-screen bg-app-gradient flex items-center justify-center p-6 text-light_text dark:text-lavender_grey-900">
      <div className="w-full max-w-3xl bg-white/95 rounded-3xl shadow-2xl border border-gray-100/80 p-10 space-y-8 backdrop-blur-sm dark:bg-white/10 dark:border-white/10">
        <div className="space-y-3 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-heading-gradient drop-shadow">
            Welcome back {typeof user?.firstname === "string" ? user.firstname : ""}!
          </h1>
          <p className="text-base md:text-lg text-slate-600 dark:text-blue_slate-800 max-w-2xl mx-auto">
            Dive into tailored interview simulations and keep your momentum going. Your personalized dashboard keeps everything you need in one place.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="col-span-2 rounded-2xl border border-gray-200 bg-white shadow-sm p-6 text-left dark:border-white/15 dark:bg-white/10">
            <h2 className="text-lg font-semibold text-light_text dark:text-brandText">Your Progress</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-blue_slate-800">
              Track answered questions, revisit past sessions, and get instant insights after every practice interview.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 text-left dark:border-white/15 dark:bg-white/10">
            <h3 className="text-lg font-semibold text-light_text dark:text-brandText">Next Steps</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-blue_slate-800">
              Ready when you are. Launch a new interview session whenever you are prepared to practice.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate("/interview")}
            className="w-full sm:w-auto btn-primary-gradient px-8 py-3 rounded-xl font-semibold shadow-lg hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-turquoise_surf-600 transition"
          >
            Start Interview Session
          </button>
        </div>
      </div>
    </div>
  )
}
