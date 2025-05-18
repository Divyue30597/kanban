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

interface CommonProps {
	createdBy: string;
	createdTimeStamp?: string;
	updatedTimeStamp?: string;
}

export interface Subtask {
	title: string;
	done: boolean;
}

export interface Card extends CommonProps {
	id: string;
	title: string;
	description: string;
	columnStatus: ColumnStatus;
	priority: Priority;
	startingDate: string;
	expectedCompletionDate: string;
	tags: string[];
	dueDate?: string;
	subTasks?: Subtask[];
	images?: (File | string)[];
	links?: string[];
}

export interface Column extends CommonProps {
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

export interface Board extends CommonProps {
	id: string;
	title: string;
	description: string;
	columnIds: string[];
}

export interface SampleData {
	boards?: Board[];
	columns?: Column[];
	cards?: Card[];
}
