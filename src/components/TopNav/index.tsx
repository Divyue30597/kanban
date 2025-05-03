import Button from '../Button';
import Dropdown from '../Dropdown';
import styles from './topNav.module.scss';
import { SVG } from '../../SVG';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setActiveBoard } from '../../store/features/boards/boardSlice';
import { useLocation } from 'react-router';
import { useTheme } from '../../hooks/useTheme';

function TopNav() {
	const pathname = useLocation().pathname;
	const { theme, toggleTheme } = useTheme();
	const boards = useAppSelector((state) => state.boards.boards);

	const dispatch = useAppDispatch();

	const activeBoard = useAppSelector((state) => state.boards.activeBoard);
	const activeBoardData = boards?.find((board) => board.id === activeBoard);

	if (!activeBoardData) {
		return null;
	}

	const { title } = activeBoardData;

	return (
		<div className={styles.topNav}>
			<div className={styles.topNavContent}>
				<p>Hi, John Doe 👋</p>
				<div className={styles.topNavActions}>
					<Button
						className={styles.themeBtn}
						aria-label="Toggle theme"
						aria-pressed={theme === 'dark'}
						aria-controls="theme"
						onClick={toggleTheme}
						icon={theme === 'light' ? <SVG.moon /> : <SVG.sun />}
					/>
					<div className={styles.topNavActions}>
						{pathname === '/' && (
							<Dropdown
								placement="bottom-right"
								trigger={
									<Button
										className={styles.dropdownBtn}
										icon={<SVG.chevronDown />}
									>
										{title || 'Pick a board'}
									</Button>
								}
							>
								{boards.map((board) => (
									<button
										type="button"
										key={board.id}
										onClick={() => {
											dispatch(setActiveBoard(board?.id));
										}}
									>
										{board?.title}
									</button>
								))}
							</Dropdown>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default TopNav;
