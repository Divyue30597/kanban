import { NavLink } from 'react-router';
import { SVG } from '../../../SVG';

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

function BoardHeader() {
	return (
		<div>
			<h1>Board Header</h1>
			<p>This is the board header section.</p>
			<ul>
				<BoardHeaderNav />
			</ul>
		</div>
	);
}

function BoardHeaderNav() {
	return DataViewTypes.map((item) => (
		<li key={item.id}>
			<NavLink to={getLocation(item.id)} className={({ isActive }) => (isActive ? 'active' : '')}>
				<span>{item.svg}</span> <span>{item.title}</span>
			</NavLink>
		</li>
	));
}

function getLocation(id: string) {
	switch (id) {
		case 'board-go':
			return '/board/:boardId';
		case 'table':
			return '/table/:boardId/table';
		case 'calendar':
			return '/calendar/:boardId/calendar';
		case 'timeline':
			return '/timeline/:boardId/timeline';
		default:
			return '/board/:boardId';
	}
}

export default BoardHeader;
