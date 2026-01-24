import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Theme } from '../types'
import { saveTheme, loadTheme } from '../utils/storage'

// ====================================
// TYPES
// ====================================

interface ThemeContextType {
  theme: Theme
  isDarkMode: boolean
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

interface ThemeProviderProps {
  children: ReactNode
}

// ====================================
// CREATE CONTEXT
// ====================================

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// ====================================
// PROVIDER COMPONENT
// ====================================

export function ThemeProvider({ children }: ThemeProviderProps) {
  // State: current theme
  const [theme, setThemeState] = useState<Theme>(() => {
    return loadTheme() // Load from localStorage or default to 'dark'
  })

  // Computed: is dark mode active?
  const isDarkMode = theme === 'dark'

  // Apply theme to document (for CSS variables)
  useEffect(() => {
    // Set data-theme attribute on <html>
    document.documentElement.setAttribute('data-theme', theme)
    
    // Save to localStorage
    saveTheme(theme)
  }, [theme])

  // ====================================
  // ACTIONS
  // ====================================

  // Toggle between dark and light
  const toggleTheme = () => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  // Set specific theme
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  // ====================================
  // PROVIDE VALUE
  // ====================================

  const value: ThemeContextType = {
    theme,
    isDarkMode,
    toggleTheme,
    setTheme,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// ====================================
// CUSTOM HOOK
// ====================================

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  
  return context
}

export default ThemeContext