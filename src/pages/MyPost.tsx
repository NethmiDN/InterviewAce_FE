// import React from 'react'

export default function MyPost() {
  return (
    <div className="max-w-3xl mx-auto p-8 rounded-xl bg-white border border-gray-200 dark:bg-gradient-panel dark:border-twilight_indigo-300/40 backdrop-blur-sm text-light_text dark:text-lavender_grey-900 shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-light_text dark:text-brandText">My Posts</h2>
      <p className="text-light_text dark:text-blue_slate-800 mb-6">
        You have no posts yet. Start creating engaging content to appear here.
      </p>
      <div className="flex gap-4">
        <button className="px-5 py-2 rounded-md bg-smart_blue-600 hover:bg-smart_blue-700 text-white dark:text-cornsilk-900 font-medium shadow focus:outline-none focus:ring-2 focus:ring-smart_blue-400/60 transition">
          New Post
        </button>
        <button className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition dark:border-twilight_indigo-300/50 dark:text-lavender_grey-900 dark:hover:bg-smart_blue-600/10">
          Refresh
        </button>
      </div>
    </div>
  )
}
