import { SVG } from '../../SVG';
import { NavLinkItem } from '../ListItem/listItem.types';

export const menuItems: NavLinkItem[] = [
	{ title: 'Boards', icon: <SVG.home />, path: '/' },
	{ title: 'Notes', icon: <SVG.notes />, path: '/notes' },
	{ title: 'Pomodoro', icon: <SVG.pomodoro />, path: '/pomodoro' },
	{ title: 'Backlog', icon: <SVG.backlog />, path: '/backlog' },
];
export const bottomItems: NavLinkItem[] = [
	{ title: 'Settings', icon: <SVG.settings />, path: '/settings' },
	{ title: 'Help', icon: <SVG.help />, path: '/help' },
];
