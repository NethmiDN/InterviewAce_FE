import { Outlet } from "react-router-dom"
import Header from "./Header"

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-light_text dark:bg-transparent dark:text-lavender_grey-900">
      <Header />
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-8 space-y-10">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
