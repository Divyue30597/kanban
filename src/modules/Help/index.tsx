import styles from './help.module.scss';
import Section from '../../components/Section';
import Box from '../../components/Box';

interface Shortcut {
	id: number;
	key: string[];
	description: string;
}

interface Shortcuts {
	featureName: string;
	shortcuts: Shortcut[];
}

const SHORTCUTS: Shortcuts[] = [
	{
		featureName: 'General Shortcuts',
		shortcuts: [
			{ id: 1, key: ['Shift', 'Alt', 'H'], description: 'Open Home.' },
			{ id: 2, key: ['Shift', 'Alt', 'N'], description: 'Open Notes.' },
			{
				id: 3,
				key: ['Shift', 'Alt', 'P'],
				description: 'Open Pomodoro.',
			},
			{
				id: 4,
				key: ['Shift', 'Alt', 'C'],
				description: 'Open Calendar.',
			},
			{
				id: 5,
				key: ['Shift', 'Alt', 'S'],
				description: 'Open Subscriptions.',
			},
			{
				id: 6,
				key: ['Shift', 'Alt', 'U'],
				description: 'Open Settings.',
			},
			{ id: 7, key: ['Shift', 'Alt', 'L'], description: 'Open Profile.' },
			{ id: 8, key: ['Shift', 'Alt', 'Q'], description: 'Open Help.' },
		],
	},
	{
		featureName: 'Pomodoro Shortcuts',
		shortcuts: [
			{ id: 1, key: ['J'], description: 'Start the timer.' },
			{ id: 2, key: ['K'], description: 'Pause the timer.' },
			{ id: 3, key: ['R'], description: 'Reset the timer.' },
			{ id: 4, key: ['P'], description: 'Pomodoro.' },
			{ id: 5, key: ['S'], description: 'Short Break.' },
			{ id: 6, key: ['L'], description: 'Long Break.' },
		],
	},
];

function Help() {
	return (
		<Section className={styles.help}>
			<h1>Help</h1>
			<div className={styles.helpContent}>
				{SHORTCUTS.map((shortcut) => (
					<Box
						className={styles.helpBox}
						key={shortcut.featureName.toLowerCase()}
					>
						<h3>{shortcut.featureName}</h3>
						{shortcut.shortcuts.map((item) => (
							<div className={styles.table} key={item.id}>
								<kbd key={item.id} className={styles.key}>
									{item.key.map((k: string, index) => (
										<span>
											{k}{' '}
											{item.key.length > 0 &&
												index !== item.key.length - 1 &&
												'+ '}
										</span>
									))}
								</kbd>
								<p>{item.description}</p>
							</div>
						))}
					</Box>
				))}
			</div>
		</Section>
	);
}

export default Help;
