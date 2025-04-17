import { useState } from 'react';
import styles from './tabs.module.scss';
import Button from '../Button';

interface Tab extends React.HTMLProps<HTMLDivElement> {
	activeTab?: number | string;
	onTabChange?: (id: string | number) => void;
	tabs: Array<{
		id: number | string;
		label: React.ReactNode | string;
		children: React.ReactNode;
	}>;
}

function Tabs(props: Tab) {
	const {
		tabs,
		onTabChange,
		activeTab: propActiveTab,
		className,
		...rest
	} = props;

	const [activeTab, setActiveTab] = useState(0);

	const handleTabClick = (index: number) => {
		setActiveTab(index);
	};

	return (
		<div
			className={styles.tabs}
			role="tablist"
			aria-orientation="horizontal"
			{...rest}
		>
			<div className={styles.tabList + ` ${className ? className : ''}`}>
				{tabs.map((tab, index) => (
					<Button
						type="button"
						disabled={activeTab === index}
						className={styles.tabItem}
						role="tab"
						key={tab.id}
						onClick={() => {
							handleTabClick(index);
							if (onTabChange) {
								onTabChange(propActiveTab! || tab.id);
							}
						}}
					>
						{tab.label}
					</Button>
				))}
			</div>
			<div className="tab-content">{tabs[activeTab].children}</div>
		</div>
	);
}

export default Tabs;
