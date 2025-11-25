import { AuthProvider } from "./context/authContext"
import { ThemeProvider } from "./context/themeContext"
import ThemeToggle from "./components/ThemeToggle"
import Router from "./routes"

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-app-gradient text-light_text dark:text-lavender_grey-900">
          <Router />
        </div>
        <ThemeToggle />
      </AuthProvider>
    </ThemeProvider>
  )
}