import { Route, Routes, useNavigate } from 'react-router';
import styles from './app.module.scss';
import Home from './modules/Home';
import Settings from './modules/Settings';
import Profile from './modules/Profile';
import Pomodoro from './modules/Pomodoro';
import Notes from './modules/Notes';
import Calendar from './modules/CalendarPage';
import Subscriptions from './modules/Subscriptions';
import Help from './modules/Help';
import { useCallback, useEffect } from 'react';
import KanbanSettings from './modules/Settings/Kanban';
import NotesSettings from './modules/Settings/Notes';
import CalendarSettings from './modules/Settings/Calendar';
import SubscriptionsSettings from './modules/Settings/Subscriptions';
import PomodoroSettings from './modules/Settings/Pomodoro';
import { useAppSelector } from './store/hooks';
import Nav from './components/Nav';

function App() {
	const navigate = useNavigate();

	const { data } = useAppSelector((state) => state.themeGenerator);
	useEffect(() => {
		if (data !== null && data !== undefined) {
			const cssBlock = data?.data
				?.replace(/^```css\s*/i, '')
				?.replace(/```$/, '')
				?.trim();

			const styleTag = document.createElement('style');
			styleTag.innerHTML = cssBlock;
			document.head.appendChild(styleTag);

			const fontFamilyMatch = cssBlock.match(/--font-family:\s*([^;]+);/);
			if (fontFamilyMatch && fontFamilyMatch[1]) {
				const fontFamily = fontFamilyMatch[1].trim();
				const firstFont = fontFamily.match(/['"]?([^,'"]+)['"]?/)?.[1] || '';
				const link = document.createElement('link');
				link.rel = 'stylesheet';
				link.href = `https://fonts.googleapis.com/css?family=${encodeURIComponent(firstFont)}:400,700&display=swap`;
				document.head.appendChild(link);
			}

			// Remove any existing theme attribute
			document.documentElement.removeAttribute('data-theme');
		}
	}, [data]);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.shiftKey && e.altKey && e.key.toLowerCase() === 'h') {
				navigate('/');
			}
			if (e.shiftKey && e.altKey && e.key.toLowerCase() === 'n') {
				navigate('/notes');
			}
			if (e.shiftKey && e.altKey && e.key.toLowerCase() === 'p') {
				navigate('/pomodoro');
			}
			if (e.shiftKey && e.altKey && e.key.toLowerCase() === 'c') {
				navigate('/calendar');
			}
			if (e.shiftKey && e.altKey && e.key.toLowerCase() === 's') {
				navigate('/subscriptions');
			}
			if (e.shiftKey && e.altKey && e.key.toLowerCase() === 'u') {
				navigate('/settings');
			}
			if (e.shiftKey && e.altKey && e.key.toLowerCase() === 'l') {
				navigate('/profile');
			}
			if (e.shiftKey && e.altKey && e.key.toLowerCase() === 'q') {
				navigate('/help');
			}
		},
		[navigate]
	);

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [handleKeyDown]);

	return (
		<div className={styles.app}>
			{/* <LeftNav /> */}
			<Nav />
			<main className={styles.mainContent}>
				<Routes>
					<Route index path="/" element={<Home />} />
					<Route path="/notes" element={<Notes />} />
					<Route path="/pomodoro" element={<Pomodoro />} />
					<Route path="/calendar" element={<Calendar />} />
					<Route path="/subscriptions" element={<Subscriptions />} />
					<Route path="/settings" element={<Settings />}>
						<Route path="/settings/kanban" element={<KanbanSettings />} />
						<Route path="/settings/notes" element={<NotesSettings />} />
						<Route path="/settings/calendar" element={<CalendarSettings />} />
						<Route path="/settings/pomodoro" element={<PomodoroSettings />} />
						<Route path="/settings/subscriptions" element={<SubscriptionsSettings />} />
					</Route>
					<Route path="/profile" element={<Profile />} />
					<Route path="/help" element={<Help />} />
				</Routes>
			</main>
		</div>
	);
}

export default App;
