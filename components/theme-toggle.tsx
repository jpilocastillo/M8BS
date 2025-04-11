"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"

export function ThemeToggle() {
  const { isDarkMode, toggleDarkMode } = useTheme()

  return (
    <button
      onClick={toggleDarkMode}
      className="flex items-center justify-center w-10 h-10 rounded-md bg-gradient-to-br from-[#0a0a29]/50 to-[#0c0c35]/50 hover:from-[#0a0a29]/70 hover:to-[#0c0c35]/70 transition-colors"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? <Sun className="h-5 w-5 text-[#d8e2ef]" /> : <Moon className="h-5 w-5 text-[#2c7be5]" />}
    </button>
  )
}
