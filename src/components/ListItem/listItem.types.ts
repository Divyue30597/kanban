export interface NavItem {
	icon: React.ReactNode;
	toggleExpand?: () => void;
}

export interface NavLinkItem extends NavItem {
	title: string;
	path: string;
}

export interface NavLinkItemProps extends React.HTMLProps<HTMLLIElement> {
	item: NavLinkItem;
	expanded: boolean;
}

export interface NavItemProps extends React.HTMLProps<HTMLLIElement> {
	item: NavItem;
	expanded: boolean;
	toggleExpand?: () => void;
}
