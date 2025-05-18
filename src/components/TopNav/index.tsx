import Button from '../Button';
import Dropdown from '../Dropdown';
import styles from './topNav.module.scss';
import { SVG } from '../../SVG';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setActiveBoard } from '../../store/features/boards/boardSlice';
import { useLocation } from 'react-router';
import { useTheme } from '../../hooks/useTheme';
// import MakeYourOwnModal from './makeYourOwnModal';

// const themes = [
// 	{
// 		name: 'Light',
// 		icon: <SVG.sun />,
// 	},
// 	{
// 		name: 'Dark',
// 		icon: <SVG.moon />,
// 	},
// ];

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
					<Button className={styles.themeBtn} onClick={toggleTheme}>
						{theme === 'light' ? <SVG.moon /> : <SVG.sun />}
					</Button>
					{/* <Dropdown
						placement="bottom-right"
						trigger={
							<Button
								className={styles.themeBtn}
								icon={<SVG.chevronDown />}
							>
								<div className={styles.themeBtnDropdown}>
									{theme === 'light' ? (
										<SVG.moon />
									) : (
										<SVG.sun />
									)}
									{theme[0].toUpperCase() + theme.slice(1)}
								</div>
							</Button>
						}
					>
						{themes.map((theme) => (
							<button
								type="button"
								key={theme.name.toLowerCase()}
								onClick={() => {
									toggleTheme();
								}}
							>
								<div className={styles.themeBtnDropdown}>
									{theme.icon} {theme?.name}
								</div>
							</button>
						))}
						<hr />
						<MakeYourOwnModal />
					</Dropdown> */}
					{pathname === '/' && (
						<div className={styles.topNavActions}>
							<Dropdown
								placement="bottom-right"
								trigger={
									<Button className={styles.dropdownBtn} icon={<SVG.chevronDown />}>
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
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default TopNav;
