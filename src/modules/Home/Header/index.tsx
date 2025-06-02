import styles from './header.module.scss';
import { NavLink, useParams } from 'react-router';
import { SVG } from '../../../SVG';
import { useAppSelector } from '../../../store/hooks';

const DataViewTypes = [
	{
		id: 'board-go',
		title: 'Board',
		svg: <SVG.board />,
	},
	{
		id: 'table',
		title: 'Table',
		svg: <SVG.table />,
	},
	{
		id: 'calendar',
		title: 'Calendar',
		svg: <SVG.calendar />,
	},
	{
		id: 'timeline',
		title: 'Timeline',
		svg: <SVG.timeline />,
	},
];

const ManipulateDataView = [
	{
		id: 'search',
		title: 'Search',
		svg: <SVG.search />,
	},
	{
		id: 'filter',
		title: 'Filter',
		svg: <SVG.filter />,
	},
	{
		id: 'sort',
		title: 'Sort',
		svg: <SVG.sort />,
	},
	{
		id: 'fields',
		title: 'Fields',
		svg: <SVG.fields />,
	},
];

function BoardHeader() {
	const params = useParams<{ boardId: string }>();
	const boards = useAppSelector((state) => state.boards.boards);
	const activeBoard = useAppSelector((state) => state.boards.activeBoard);
	const activeBoardTitle = boards.find((board) => board.id === activeBoard)?.title || 'Untitled Board';

	return (
		<div className={styles.boardHeader}>
			<h1>{activeBoardTitle}</h1>
			<div className={styles.boardHeaderAction}>
				<ul className={styles.boardHeaderNavItem}>
					<BoardHeaderNav params={params} />
				</ul>
				<ul className={styles.boardHeaderNavItem}>
					<ManipulateDataViewType />
				</ul>
			</div>
		</div>
	);
}

function BoardHeaderNav({ params }: { params: Record<string, string> }) {
	return DataViewTypes.map((item) => (
		<li className={styles.listItem} key={item.id}>
			<NavLink
				to={getLocation(item.id, params)}
				className={({ isActive }) => (isActive ? `${styles.active} ` : '') + styles.navLink}
			>
				<span className={styles.svg}>{item.svg}</span> <span className={styles.title}>{item.title}</span>
			</NavLink>
		</li>
	));
}

function ManipulateDataViewType() {
	return ManipulateDataView.map((item) => (
		<li className={styles.listItem} key={item.id}>
			<button className={styles.button} onClick={() => console.log(`${item.title} clicked`)}>
				<span className={styles.svg}>{item.svg}</span> <span className={styles.title}>{item.title}</span>
			</button>
		</li>
	));
}

function getLocation(id: string, params: Record<string, string>) {
	const { boardId } = params;
	switch (id) {
		case 'table':
			return `/board/${boardId}/table`;
		case 'calendar':
			return `/board/${boardId}/calendar`;
		case 'timeline':
			return `/board/${boardId}/timeline`;
		default:
			return `/board/${boardId}`;
	}
}

export default BoardHeader;
