import React, { createContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
	const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

	useEffect(() => {
		const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

		if (theme === 'system') {
			setTheme(systemTheme)
		}

		document.body.classList.toggle('dark', theme === 'dark')
		localStorage.setItem('theme', theme)

		const themeListener = e => {
			if (theme === 'system') {
				setTheme(e.matches ? 'dark' : 'light')
			}
		}

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
		mediaQuery.addEventListener('change', themeListener)

		return () => mediaQuery.removeEventListener('change', themeListener)
	}, [theme])

	const toggleTheme = newTheme => {
		setTheme(newTheme)
	}

	return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export default ThemeContext
