import { useEffect, useState } from 'react'
import { ThemeContext } from './theme-context'

// Provides light/dark theme state and toggles the `.dark` class on <html>,
// so every component using bg-background / text-foreground etc. flips at once.
// Persists the choice and falls back to the OS preference on first load.
export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  return (
    <ThemeContext.Provider value={{ isDark, toggle: () => setIsDark((d) => !d) }}>
      {children}
    </ThemeContext.Provider>
  )
}
