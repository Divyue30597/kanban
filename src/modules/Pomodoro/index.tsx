import styles from './pomodoro.module.scss';
import Tabs from '../../components/Tabs';
import { SVG } from '../../SVG';
import { useCallback, useEffect, useState } from 'react';
import { timeFormatting } from '../../utils/utils';
import Car from './Car';

type TimeLeft = {
	pomodoro: number;
	shortBreak: number;
	longBreak: number;
};

type IsRunning = {
	pomodoro: boolean;
	shortBreak: boolean;
	longBreak: boolean;
};

type activeTabType = 'pomodoro' | 'shortBreak' | 'longBreak';

export default function Pomodoro() {
	const [timeLeft, setTimeLeft] = useState<TimeLeft>({
		pomodoro: 1 * 60,
		shortBreak: 5 * 60,
		longBreak: 15 * 60,
	});
	const [isRunning, setIsRunning] = useState<IsRunning>({
		pomodoro: false,
		shortBreak: false,
		longBreak: false,
	});

	const [activeTab, setActiveTab] = useState<activeTabType>('pomodoro');

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.key.toLowerCase() === 'r') {
				setTimeLeft({
					pomodoro: 25 * 60,
					shortBreak: 5 * 60,
					longBreak: 15 * 60,
				});
				setIsRunning({
					pomodoro: false,
					shortBreak: false,
					longBreak: false,
				});
			} else if (e.key.toLowerCase() === 'j') {
				setIsRunning((prev) => {
					return { ...prev, [activeTab]: true };
				});
			} else if (e.key.toLowerCase() === 'k') {
				setIsRunning((prev) => {
					return { ...prev, [activeTab]: false };
				});
			}
		},
		[activeTab]
	);

	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [activeTab, handleKeyDown]);

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft((prevTime) => {
				const updatedTime = { ...prevTime };

				Object.keys(isRunning).forEach((tab) => {
					const timerType = tab as activeTabType;
					if (isRunning[timerType] && updatedTime[timerType] > 0) {
						updatedTime[timerType] = updatedTime[timerType] - 1;
					} else if (isRunning[timerType] && updatedTime[timerType] <= 0) {
						setIsRunning((prev) => ({
							...prev,
							[timerType]: false,
						}));
					}
				});

				return updatedTime;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [isRunning]);

	const tabs = [
		{
			id: 'pomodoro',
			label: <h2 className={styles.tabTitles}>Pomodoro</h2>,
			children: <p className={styles.time}>{timeFormatting(timeLeft.pomodoro)}</p>,
		},
		{
			id: 'shortBreak',
			label: <h2 className={styles.tabTitles}>Short Break</h2>,
			children: <p className={styles.time}>{timeFormatting(timeLeft.shortBreak)}</p>,
		},
		{
			id: 'longBreak',
			label: <h2 className={styles.tabTitles}>Long Break</h2>,
			children: <p className={styles.time}>{timeFormatting(timeLeft.longBreak)}</p>,
		},
	];

	return (
		<div className={styles.pomodoro}>
			<Car timer={1} isRunning={isRunning} />
			<div className={styles.pomodoroContainer}>
				<h1>
					pomodor
					<SVG.pomodoroClock />
				</h1>
				<div className={styles.pomodoroContent}>
					<Tabs
						className={styles.tabBtn}
						tabs={tabs}
						activeTab={activeTab}
						onTabChange={(id) => setActiveTab(id as activeTabType)}
					/>
				</div>
				<button
					className={styles.startButton}
					type="button"
					onClick={() =>
						setIsRunning({
							...isRunning,
							[activeTab]: !isRunning[activeTab],
						})
					}
				>
					{!isRunning[activeTab] ? <SVG.playButton /> : <SVG.pauseButton />}
				</button>
			</div>
		</div>
	);
}
