import styles from './leftNav.module.scss';
import { SVG } from '../../SVG';
import { useCallback, useState } from 'react';
import ListItem from '../ListItem';
import { useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { bottomItems, menuItems } from './constants';

function LeftNav() {
	const [expanded, setExpanded] = useState<boolean>(false);
	const { theme, toggleTheme } = useTheme();

	const toggleExpand = useCallback(() => {
		setExpanded(!expanded);
	}, [expanded]);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (
				event.target instanceof HTMLElement &&
				(event.target.tagName === 'INPUT' ||
					event.target.tagName === 'TEXTAREA' ||
					event.target.isContentEditable)
			) {
				return;
			}

			if (event.key === ' ' || event.code === 'Space') {
				event.preventDefault();
				toggleExpand();
			}
		},
		[toggleExpand]
	);

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [expanded, handleKeyDown]);

	return (
		<nav className={styles.leftNav + (expanded ? ` ${styles.expanded}` : ` ${styles.collapse}`)}>
			<div className={styles.leftNavList}>
				<ul className={styles.leftNavListGroup}>
					<ListItem
						item={{
							title: 'Toggle',
							icon: <SVG.layout />,
							onClick: toggleExpand,
							type: 'dropdown',
						}}
						expanded={expanded}
					/>
					{menuItems.map((item, index) => (
						<ListItem key={index} item={item} expanded={expanded} />
					))}
				</ul>
				<ul className={styles.leftNavListGroup}>
					{bottomItems?.map((item, index) => <ListItem key={index} item={item} expanded={expanded} />)}
					<ListItem
						item={{
							title: theme === 'light' ? 'Dark' : 'Light',
							icon: theme === 'light' ? <SVG.moon /> : <SVG.sun />,
							onClick: toggleTheme,
							type: 'button',
						}}
						expanded={expanded}
					/>
				</ul>
			</div>
		</nav>
	);
}

export default LeftNav;
