import { useState } from 'react';
import { NavLink } from 'react-router';
import styles from './nav.module.scss';
import { useAppSelector } from '../../store/hooks';
import usePopOver from '../../hooks/usePopOver';
import useNavExpand from '../../hooks/useNavExpand';
import { useTheme } from '../../hooks/useTheme';
import IconBtn from '../IconBtn';
import { menuItems } from '../LeftNav/constants';
import { bottomItems } from '../LeftNav/constants';
import { NavItemProps, NavLinkItemProps } from '../ListItem/listItem.types';
import { SVG } from '../../SVG';
import { setActiveBoard } from '../../store/features/boards/boardSlice';

function Nav() {
	const { expanded, toggleExpand } = useNavExpand();
	const { theme, toggleTheme } = useTheme();

	return (
		<nav className={`${styles.nav} ${expanded ? styles.expanded : ''}`}>
			<ul className={styles.topMenu}>
				<ToggleBtn item={{ icon: <SVG.layout />, toggleExpand }} expanded={expanded} />
				{menuItems.map((item) => (
					<NavItem key={item.title} item={item} expanded={expanded} />
				))}
			</ul>
			<ul className={styles.bottomMenu}>
				{bottomItems.map((item) => (
					<NavItem key={item.title} item={item} expanded={expanded} />
				))}
				<button className={styles.btn} onClick={toggleTheme}>
					{theme === 'light' ? <SVG.moon /> : <SVG.sun />}
					{expanded && <span className={styles.title}>{theme === 'light' ? 'Dark' : 'Light'}</span>}
				</button>
			</ul>
		</nav>
	);
}

function NavItem(props: NavLinkItemProps) {
	const { item, expanded, ...rest } = props;
	const { title, icon, path } = item;
	const { onMouseOver, handleMouseOver, handleMouseLeave } = usePopOver();

	return (
		<li
			className={styles.navItem}
			key={title}
			onMouseOver={handleMouseOver}
			onMouseLeave={handleMouseLeave}
			{...rest}
		>
			<NavLink
				to={path}
				className={({ isActive }) => `${isActive && item.path !== '' ? styles.active : ''} ${styles.btn}`}
			>
				{icon}
				{expanded && <span className={styles.title}>{title}</span>}
			</NavLink>
			{onMouseOver && !expanded && <span className={styles.tooltip}>{item.title}</span>}
		</li>
	);
}

function ToggleBtn(props: NavItemProps) {
	const [isActive, setIsActive] = useState(false);
	const { item, expanded, ...rest } = props;
	const { icon, toggleExpand } = item;

	const { onMouseOver, handleMouseOver, handleMouseLeave } = usePopOver();

	const boards = useAppSelector((state) => state.boards.boards);
	const activeBoard = useAppSelector((state) => state.boards.activeBoard);
	const activeBoardData = boards?.find((board) => board.id === activeBoard);
	const { title } = activeBoardData;

	const handleOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation();
		setIsActive(!isActive);
	};

	return (
		<li
			className={`${styles.navItem} ${isActive ? styles.visible : ''}`}
			onMouseOver={handleMouseOver}
			onMouseLeave={handleMouseLeave}
			{...rest}
		>
			<div onClick={toggleExpand} className={styles.btn}>
				{icon}
				{expanded && (
					<div className={styles.titleContainer}>
						<span className={styles.title}>{title || 'Board'}</span>
						<IconBtn className={styles.iconBtn} onClick={handleOnClick}>
							<SVG.chevronDown />
						</IconBtn>
					</div>
				)}
			</div>
			{onMouseOver && !expanded && <span className={styles.tooltip}>{title}</span>}
			{expanded && isActive && (
				<div className={styles.dropdownContainer}>
					<DropdownItem />
				</div>
			)}
		</li>
	);
}

function DropdownItem() {
	const boards = useAppSelector((state) => state.boards.boards);

	return (
		<ul className={styles.dropdown}>
			{boards.map((board) => (
				<li key={board.id} className={styles.dropdownItem}>
					<NavLink
						to={`/board/${board.id}`}
						onClick={() => setActiveBoard(board.id)}
						className={({ isActive }) => (isActive ? styles.active : '') + ' ' + styles.link}
					>
						<span className={styles.checkbox}>
							<SVG.checkBox />
						</span>
						<span>{board.title}</span>
					</NavLink>
				</li>
			))}
		</ul>
	);
}

export default Nav;
