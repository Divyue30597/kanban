import { SVG } from '../../SVG';
import { IItem } from '../ListItem/listItem.types';

export const menuItems: IItem[] = [
	{ title: 'Boards', icon: <SVG.home />, path: '/', type: 'link' },
	{ title: 'Notes', icon: <SVG.notes />, path: '/notes', type: 'link' },
	{ title: 'Pomodoro', icon: <SVG.pomodoro />, path: '/pomodoro', type: 'link' },
	{ title: 'Backlog', icon: <SVG.backlog />, path: '/backlog', type: 'link' },
];
export const bottomItems: IItem[] = [
	{ title: 'Settings', icon: <SVG.settings />, path: '/settings', type: 'link' },
	{ title: 'Help', icon: <SVG.help />, path: '/help', type: 'link' },
];
