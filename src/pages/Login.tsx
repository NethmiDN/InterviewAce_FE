import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/authContext"
import { login, getMyDetails, type LoginResponse, type UserDetailsResponse } from "../services/auth"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const { setUser } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault() // prevent page refresh

    if (!username.trim() || !password.trim()) {
      alert("Please enter both username and password.")
      return
    }

    try {
      const data: LoginResponse = await login(username, password)

      if (data?.data?.accessToken) {
        localStorage.setItem("accessToken", data.data.accessToken)
        localStorage.setItem("refreshToken", data.data.refreshToken)

        const resData: UserDetailsResponse = await getMyDetails()
        setUser(resData.data)
        navigate("/home")
      } else {
        alert("Login failed, please check your credentials.")
      }
    } catch (err) {
      console.error("Login error:", err)
      alert("Login failed, please check your credentials.")
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

  return (
    <div className="min-h-screen bg-app-gradient flex flex-col items-center justify-center p-6 text-light_text dark:text-lavender_grey-900">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <form className="flex flex-col gap-4 w-80 bg-white border border-gray-200 rounded-2xl p-6 shadow-md dark:bg-white/10 dark:border-white/10">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg bg-white text-light_text placeholder-slate-400 shadow-sm focus:outline-none focus:border-smart_blue-500 focus:ring-2 focus:ring-smart_blue-500/30 dark:border-bright_teal_blue-400/40 dark:bg-white/10 dark:text-lavender_grey-900 dark:placeholder-frosted_blue-400 dark:focus:border-turquoise_surf-500 dark:focus:ring-turquoise_surf-500/40"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg bg-white text-light_text placeholder-slate-400 shadow-sm focus:outline-none focus:border-smart_blue-500 focus:ring-2 focus:ring-smart_blue-500/30 dark:border-bright_teal_blue-400/40 dark:bg-white/10 dark:text-lavender_grey-900 dark:placeholder-frosted_blue-400 dark:focus:border-turquoise_surf-500 dark:focus:ring-turquoise_surf-500/40"
        />
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-smart_blue-600 text-white rounded-lg hover:bg-smart_blue-700 transition"
        >
          Login
        </button>
      </form>

      <p className="mt-4 text-gray-700 dark:text-blue_slate-800">
        Don't have an account?{" "}
        <button
          className="text-smart_blue-600 font-semibold hover:underline dark:text-brandText dark:hover:text-smart_blue-600"
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </p>
    </div>
  )
}
