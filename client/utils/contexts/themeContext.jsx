"use client"

import { createContext, useContext, useState, useEffect } from "react"

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark")
  const [accentColor, setAccentColor] = useState("#00FFD1")

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("digitalz-theme")
    const savedAccentColor = localStorage.getItem("digitalz-accent-color")

    if (savedTheme) {
      setTheme(savedTheme)
    }
    if (savedAccentColor) {
      setAccentColor(savedAccentColor)
    }
  }, [])

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute("data-theme", theme)
    document.documentElement.style.setProperty("--digitalz-primary", accentColor)

    // Save to localStorage
    localStorage.setItem("digitalz-theme", theme)
    localStorage.setItem("digitalz-accent-color", accentColor)
  }, [theme, accentColor])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }

  const updateAccentColor = (color) => {
    setAccentColor(color)
  }

  const value = {
    theme,
    accentColor,
    toggleTheme,
    updateAccentColor,
    isDark: theme === "dark",
    colors: {
      primary: "#00FFD1",
      primaryDark: "#00E6BC",
      primaryLight: "#33FFD9",
      bgPrimary: "#0a1a1a",
      bgSecondary: "#1a2f2f",
      bgTertiary: "#2a3f3f",
      bgCard: "#1e2d2d",
      textPrimary: "#ffffff",
      textSecondary: "#b0c4c4",
      textMuted: "#7a8e8e",
      borderColor: "#2a4a4a",
      success: "#00ff88",
      warning: "#ffaa00",
      error: "#ff4444",
      info: "#00aaff",
    },
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
