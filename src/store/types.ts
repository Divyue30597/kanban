// src/types/index.ts
interface CommonProps {
	createdAt?: string;
	updatedAt?: string;
}

export interface Subtask {
	title: string;
	done: boolean;
}

export interface Card extends CommonProps {
	id: string;
	title: string;
	description: string;
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
	createdAt: string;
	updatedAt: string;
	cardIds: string[];
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
