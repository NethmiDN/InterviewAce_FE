import { memo } from "react";
import { useTheme } from "../context/themeContext";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light mode" : "Dark mode"}
      className="fixed bottom-4 right-4 z-50 inline-flex items-center justify-center h-12 w-12 rounded-full shadow-lg border transition-colors
                 bg-white text-gray-800 border-gray-200 hover:bg-gray-50 active:scale-95
                 dark:bg-prussian_blue-600 dark:text-light_cyan-900 dark:border-twilight_indigo-400/40 dark:hover:bg-prussian_blue-500"
    >
      {isDark ? (
        // Sun icon for light mode target
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
          <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zm10.48 0l1.79-1.8 1.41 1.41-1.8 1.79-1.4-1.4zM12 4V1h-0v3h0zm0 19v-3h0v3h0zM4 12H1v0h3v0zm19 0h-3v0h3v0zM6.76 19.16l-1.42 1.42-1.79-1.8 1.41-1.41 1.8 1.79zm10.48 0l1.4 1.4 1.8-1.79-1.41-1.41-1.79 1.8zM12 8a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
      ) : (
        // Moon icon for dark mode target
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
          <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
        </svg>
      )}
    </button>
  );
}

export default memo(ThemeToggle);
