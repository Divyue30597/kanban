export interface IItem {
	type: 'link' | 'button' | 'dropdown';
	path?: string;
	title: string;
	icon: React.ReactNode;
	onClick?: () => void;
}

export interface ListItemProps extends React.HTMLProps<HTMLLIElement> {
	item: IItem;
	expanded: boolean;
}
