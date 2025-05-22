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

export const data: SampleData = {
	boards: [
		{
			id: 'board-go',
			title: 'Learn  Go',
			description: 'A comprehensive board to master Go over 3 months.',
			createdTimeStamp: '2023-01-01',
			updatedTimeStamp: '2023-01-15',
			createdBy: 'user-1',
			columnIds: ['subBoards-go-1', 'subBoards-go-2'],
		},
	],
	columns: [
		{
			id: 'subBoards-go-1',
			title: 'Go Basics & Intermediate',
			boardId: 'board-go',
			columnsList: [
				{
					id: 'ready',
					title: 'Ready',
					isSelected: true,
					cardIds: ['card-go-3'],
				},
				{
					id: 'todo',
					title: 'To Do',
					isSelected: true,
					cardIds: ['card-go-2'],
				},
				{
					id: 'in_progress',
					title: 'In Progress',
					isSelected: true,
					cardIds: ['card-go-1'],
				},
				{
					id: 'done',
					title: 'Done',
					isSelected: true,
					cardIds: [],
				},
				{
					id: 'on_hold',
					title: 'On Hold',
					isSelected: false,
					cardIds: [],
				},
				{
					id: 'cancelled',
					title: 'Cancelled',
					isSelected: false,
					cardIds: [],
				},
				{
					id: 'archived',
					title: 'Archived',
					isSelected: false,
					cardIds: [],
				},
				{
					id: 'backlog',
					title: 'Backlog',
					isSelected: true,
					cardIds: [],
				},
			],
			createdTimeStamp: '2023-01-01',
			updatedTimeStamp: '2023-01-15',
			createdBy: 'user-1',
		},
		{
			id: 'subBoards-go-2',
			title: 'Go Advanced & Projects',
			boardId: 'board-go',
			createdTimeStamp: '2023-01-01',
			updatedTimeStamp: '2023-01-15',
			createdBy: 'user-1',
			columnsList: [
				{
					id: 'ready',
					title: 'Ready',
					isSelected: true,
					cardIds: ['card-go-4'],
				},
				{
					id: 'todo',
					title: 'To Do',
					isSelected: true,
					cardIds: ['card-go-5'],
				},
				{
					id: 'in_progress',
					title: 'In Progress',
					isSelected: true,
					cardIds: ['card-go-6'],
				},
				{
					id: 'done',
					title: 'Done',
					isSelected: true,
					cardIds: [],
				},
				{
					id: 'on_hold',
					title: 'On Hold',
					isSelected: false,
					cardIds: [],
				},
				{
					id: 'cancelled',
					title: 'Cancelled',
					isSelected: false,
					cardIds: [],
				},
				{
					id: 'archived',
					title: 'Archived',
					isSelected: false,
					cardIds: [],
				},
				{
					id: 'backlog',
					title: 'Backlog',
					isSelected: true,
					cardIds: [],
				},
			],
		},
	],
	cards: [
		{
			id: 'card-go-1',
			title: 'Setup Go Environment & Basics',
			description: 'Install Go, set up environment, write your first programs.',
			tags: ['Setup', 'Basics'],
			columnStatus: 'todo',
			startingDate: '2023-01-01',
			expectedCompletionDate: '2023-01-02',
			priority: 'medium',
			createdTimeStamp: '2023-01-01',
			updatedTimeStamp: '2023-01-15',
			dueDate: '2023-03-01',
			createdBy: 'user-1',
		},
		{
			id: 'card-go-2',
			title: 'Learn Go Syntax & Fundamentals',
			columnStatus: 'in_progress',
			description: 'Variables, data types, control statements, functions.',
			tags: ['Syntax', 'Basics'],
			priority: 'high',
			dueDate: '2023-03-10',
			startingDate: '2023-01-02',
			expectedCompletionDate: '2023-01-03',
			createdTimeStamp: '2023-01-01',
			updatedTimeStamp: '2023-01-15',
			createdBy: 'user-1',
		},
		{
			id: 'card-go-3',
			title: 'Build Basic Go Projects',
			description: 'Practice by creating small CLI apps.',
			tags: ['Projects', 'Practice'],
			links: ['https://tour.golang.org/'],
			priority: 'low',
			columnStatus: 'todo',
			startingDate: '2023-01-03',
			expectedCompletionDate: '2023-01-04',
			createdTimeStamp: '2023-01-01',
			updatedTimeStamp: '2023-01-15',
			createdBy: 'user-1',
		},
		{
			id: 'card-go-4',
			title: 'Concurrency & Advanced Features in Go',
			description: 'Goroutines, channels, testing, profiling.',
			tags: ['Concurrency', 'Advanced'],
			dueDate: '2023-04-10',
			columnStatus: 'todo',
			priority: 'urgent',
			startingDate: '2023-01-04',
			expectedCompletionDate: '2023-01-05',
			createdTimeStamp: '2023-01-01',
			updatedTimeStamp: '2023-01-15',
			createdBy: 'user-1',
		},
		{
			id: 'card-go-5',
			title: 'Go Modules & Ecosystem',
			description: 'Manage dependencies and explore popular libraries.',
			tags: ['Modules', 'Libraries'],
			dueDate: '2023-05-10',
			columnStatus: 'todo',
			priority: 'medium',
			startingDate: '2023-01-05',
			expectedCompletionDate: '2023-01-06',
			createdTimeStamp: '2023-01-01',
			updatedTimeStamp: '2023-01-15',
			createdBy: 'user-1',
		},
		{
			id: 'card-go-6',
			title: 'Final Go Project',
			description: 'Develop a comprehensive project applying all skills.',
			tags: ['Project'],
			images: ['https://images.pexels.com/photos/414519/pexels-photo-414519.jpeg'],
			columnStatus: 'todo',
			priority: 'high',
			startingDate: '2023-01-06',
			expectedCompletionDate: '2023-01-07',
			createdTimeStamp: '2023-01-01',
			updatedTimeStamp: '2023-01-15',
			createdBy: 'user-1',
		},
		{
			id: 'card-go-7',
			title: 'Final Go Project',
			description: 'Develop a comprehensive project applying all skills.',
			tags: ['Project'],
			images: ['https://images.pexels.com/photos/414519/pexels-photo-414519.jpeg'],
			columnStatus: 'todo',
			priority: 'low',
			startingDate: '2023-01-06',
			expectedCompletionDate: '2023-01-07',
			createdTimeStamp: '2023-01-01',
			updatedTimeStamp: '2023-01-15',
			createdBy: 'user-1',
		},
	],
};
