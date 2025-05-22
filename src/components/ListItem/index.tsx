import { NavLink } from 'react-router';
import styles from './listItem.module.scss';
import { useEffect, useState } from 'react';
import { SVG } from '../../SVG';
import { ListItemProps } from './listItem.types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setActiveBoard } from '../../store/features/boards/boardSlice';
import { Board } from '../../data/sample';

function ListItem(props: ListItemProps) {
	const { item, expanded, ...rest } = props;
	const [shouldRender, setShouldRender] = useState(expanded);
	const [shouldShow, setShouldShow] = useState(expanded);
	const [isActive, setIsActive] = useState(false);
	const [onMouseOver, setOnMouseOver] = useState(false);

	const boards = useAppSelector((state) => state.boards.boards);

	const activeBoard = useAppSelector((state) => state.boards.activeBoard);
	const activeBoardData = boards?.find((board) => board.id === activeBoard);

	const { title } = activeBoardData;

	const handleMouseOver = () => {
		setOnMouseOver(true);
	};

	const handleMouseLeave = () => {
		setOnMouseOver(false);
	};

	const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		setIsActive(!isActive);
	};

	useEffect(() => {
		let timeout: NodeJS.Timeout;

		if (expanded) {
			setShouldRender(true);
			timeout = setTimeout(() => {
				setShouldShow(true);
			}, 150);
		} else {
			setShouldShow(false);
			timeout = setTimeout(() => {
				setShouldRender(false);
			}, 300);
		}

		return () => clearTimeout(timeout);
	}, [expanded]);

	return (
		<li title={item.title} onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave} {...rest}>
			{item.type === 'dropdown' && (
				<button className={styles.btn} type="button" title={item.title + ' board'} onClick={item.onClick}>
					{item.icon}
					{shouldRender && (
						<div className={`${styles.titleContainer} ${shouldShow ? styles.expanded : styles.collapsed}`}>
							<div className={styles.titleWrapper}>
								<p className={styles.title_p}>{title || item.title}</p>
							</div>
							<button className={styles.dropdown} type="button" title="dropdown" onClick={handleOnClick}>
								<SVG.chevronDown />
							</button>
						</div>
					)}
				</button>
			)}

			{isActive && <DropdownChildren boards={boards} />}

			{item.type === 'button' && (
				<button className={styles.btn} onClick={item.onClick}>
					{item.icon}
					{shouldRender && (
						<span className={`${styles.title} ${shouldShow ? styles.expanded : styles.collapsed}`}>
							{item.title}
						</span>
					)}
				</button>
			)}

			{item.type === 'link' && item.path !== undefined && (
				<NavLink
					to={item.path}
					className={({ isActive }) => `${isActive && item.path !== '' ? styles.active : ''} ${styles.btn}`}
				>
					{item.icon}
					{shouldRender && (
						<span className={`${styles.title} ${shouldShow ? styles.expanded : styles.collapsed}`}>
							{item.title}
						</span>
					)}
				</NavLink>
			)}
			{onMouseOver && !expanded && (item.type === 'link' || item.type === 'button') && (
				<span className={styles.tooltip}>{item.title}</span>
			)}
			{onMouseOver && !expanded && item.type === 'dropdown' && (
				<span className={styles.tooltip}>{title || item.title}</span>
			)}
		</li>
	);
}
function DropdownChildren({ boards }: { boards: Board[] }) {
	const dispatch = useAppDispatch();

	return boards.map((board: Board) => (
		<button
			className={styles.btn}
			type="button"
			key={board.id}
			onClick={() => {
				dispatch(setActiveBoard(board.id));
			}}
		>
			{board?.title}
		</button>
	));
}

export default ListItem;
