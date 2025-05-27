import { NavLink } from 'react-router';
import { SVG } from '../../../SVG';

const DateViewTypes = [
	{
		id: 'board-go',
		title: 'Board',
		location: '/board/board-go',
        svg: <SVG.board />
	},
	{
		id: 'table',
		title: 'Table',
		location: '/board/board-go/table',
	},
	{
		id: 'calendar',
		title: 'Calendar',
		location: '/board/board-go/calendar',
	},
	{
		id: 'timeline',
		title: 'Timeline',
		location: '/board/board-go/timeline',
	},
];

function BoardHeader() {
	return (
		<div>
			<h1>Board Header</h1>
			<p>This is the board header section.</p>
			<ul>
				<li>Board 1</li>
				<li></li>
				<li></li>
			</ul>
		</div>
	);
}

function BoardHeaderNav({}) {
	return (
		<li>
			<NavLink to="/board/board-go" className={({ isActive }) => (isActive ? 'active' : '')}>
				<span></span> <span>Board</span>
			</NavLink>
		</li>
	);
}
