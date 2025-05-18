import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';

export function useTheme() {
	const [theme, setThemeState] = useState<Theme>('dark');

	const getSystemTheme = (): Theme => {
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	};

	useEffect(() => {
		const savedTheme = localStorage.getItem('theme') as Theme;
		const initialTheme = savedTheme || getSystemTheme();

		setThemeState(initialTheme);
		applyTheme(initialTheme);

		// Optional: Listen for system theme changes
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handleChange = (e: MediaQueryListEvent) => {
			// Only update if user hasn't explicitly set a preference
			if (!localStorage.getItem('theme')) {
				const newTheme = e.matches ? 'dark' : 'light';
				setThemeState(newTheme);
				applyTheme(newTheme);
			}
		};

		// Add event listener for theme changes
		mediaQuery.addEventListener('change', handleChange);

		// Clean up listener on component unmount
		return () => {
			mediaQuery.removeEventListener('change', handleChange);
		};
	}, []);

	// Apply theme changes to document and localStorage
	const applyTheme = (newTheme: Theme) => {
		// Update HTML data attribute
		document.documentElement.dataset.theme = newTheme;

		// Update localStorage
		localStorage.setItem('theme', newTheme);

		// Update meta color-scheme
		const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
		if (metaColorScheme) {
			metaColorScheme.setAttribute('content', newTheme);
		}
	};

	// Set theme with proper side effects
	const setTheme = (newTheme: Theme) => {
		setThemeState(newTheme);
		applyTheme(newTheme);
	};

	// Toggle between light and dark
	const toggleTheme = () => {
		const newTheme = theme === 'light' ? 'dark' : 'light';
		setTheme(newTheme);
	};

	return { theme, setTheme, toggleTheme };
}
