export type ColumnStatus =
	| 'backlog'
	| 'ready'
	| 'todo'
	| 'in_progress'
	| 'done'
	| 'blocked'
	| 'on_hold'
	| 'cancelled'
	| 'archived'
	| string;

export type Priority = 'low' | 'medium' | 'high' | 'urgent' | string;

interface ICommonProps {
	createdBy: string;
	createdTimeStamp?: string;
	updatedTimeStamp?: string;
}

export interface ISubtask {
	title: string;
	done: boolean;
}

export interface ICard extends ICommonProps {
	id: string;
	title: string;
	description: string;
	columnStatus: ColumnStatus;
	priority: Priority;
	startingDate: string;
	expectedCompletionDate: string;
	tags: string[];
	dueDate?: string;
	subTasks?: ISubtask[];
	images?: (File | string)[];
	links?: string[];
}

export interface IColumn extends ICommonProps {
	id: string;
	title: string;
	boardId: string;
	columnsList: {
		id: ColumnStatus;
		title: string;
		isSelected: boolean;
		cardIds: string[];
	}[];
}

export interface IBoard extends ICommonProps {
	id: string;
	title: string;
	description: string;
	columnIds: string[];
}

export interface ISampleData {
	boards?: IBoard[];
	columns?: IColumn[];
	cards?: ICard[];
}
