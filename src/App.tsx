import { Route, Routes, useNavigate } from 'react-router';
import styles from './app.module.scss';
import LeftNav from './components/LeftNav';
import TopNav from './components/TopNav';
import Home from './modules/Home';
import Settings from './modules/Settings';
import Profile from './modules/Profile';
import Pomodoro from './modules/Pomodoro';
import Notes from './modules/Notes';
import Calendar from './modules/Calendar';
import Subscriptions from './modules/Subscriptions';
import Help from './modules/Help';
import { useCallback, useEffect } from 'react';
import KanbanSettings from './modules/Settings/Kanban';
import NotesSettings from './modules/Settings/Notes';
import CalendarSettings from './modules/Settings/Calendar';
import SubscriptionsSettings from './modules/Settings/Subscriptions';
import PomodoroSettings from './modules/Settings/Pomodoro';

function App() {
	const navigate = useNavigate();

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
			<LeftNav />
			<main className={styles.mainContent}>
				<TopNav />
				<Routes>
					<Route index path="/" element={<Home />} />
					<Route path="/notes" element={<Notes />} />
					<Route path="/pomodoro" element={<Pomodoro />} />
					<Route path="/calendar" element={<Calendar />} />
					<Route path="/subscriptions" element={<Subscriptions />} />
					<Route path="/settings" element={<Settings />}>
						<Route
							path="/settings/kanban"
							element={<KanbanSettings />}
						/>
						<Route
							path="/settings/notes"
							element={<NotesSettings />}
						/>
						<Route
							path="/settings/calendar"
							element={<CalendarSettings />}
						/>
						<Route
							path="/settings/pomodoro"
							element={<PomodoroSettings />}
						/>
						<Route
							path="/settings/subscriptions"
							element={<SubscriptionsSettings />}
						/>
					</Route>
					<Route path="/profile" element={<Profile />} />
					<Route path="/help" element={<Help />} />
				</Routes>
			</main>
		</div>
	);
}

export default App;
