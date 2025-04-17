export type Board = {
	id: string;
	title: string;
	description: string;
	columnIds: string[];
};

export type Column = {
	id: string;
	title: string;
	boardId: string;
	cardIds: string[];
};

export type Subtask = {
	title: string;
	done: boolean;
};

export type Card = {
	id: string;
	title: string;
	description?: string;
	tags?: string[];
	dueDate?: string;
	subTasks?: Subtask[];
	links?: string[];
	images?: string[];
	assignees?: string[];
};

export type Data = {
	boards: Board[];
	columns: Column[];
	cards: Card[];
};

export const data: Data = {
	boards: [
		{
			id: 'board-1',
			title: 'Work',
			description: 'A board to manage your work tasks.',
			columnIds: ['column-1', 'column-2', 'column-3', 'column-4'],
		},
		{
			id: 'board-2',
			title: 'Personal',
			description: 'A board to keep track of personal tasks.',
			columnIds: ['column-5', 'column-6', 'column-7', 'column-11'],
		},
		{
			id: 'board-3',
			title: 'Team Planning',
			description: "A board to plan the team's tasks week by week.",
			columnIds: ['column-8', 'column-9', 'column-10'],
		},
	],
	columns: [
		{
			id: 'column-1',
			title: 'Backlog',
			boardId: 'board-1',
			cardIds: ['card-1'],
		},
		{
			id: 'column-2',
			title: 'Todo',
			boardId: 'board-1',
			cardIds: ['card-2'],
		},
		{
			id: 'column-3',
			title: 'In progress',
			boardId: 'board-1',
			cardIds: ['card-3'],
		},
		{
			id: 'column-4',
			title: 'Done',
			boardId: 'board-1',
			cardIds: ['card-4'],
		},
		{
			id: 'column-5',
			title: 'Not started',
			boardId: 'board-2',
			cardIds: ['card-5'],
		},
		{
			id: 'column-6',
			title: 'In progress',
			boardId: 'board-2',
			cardIds: ['card-6'],
		},
		{
			id: 'column-7',
			title: 'Blocked',
			boardId: 'board-2',
			cardIds: ['card-7'],
		},
		{
			id: 'column-11',
			title: 'Done',
			boardId: 'board-2',
			cardIds: ['card-8'],
		},
		{
			id: 'column-8',
			title: 'Last week',
			boardId: 'board-3',
			cardIds: ['card-9', 'card-10'],
		},
		{
			id: 'column-9',
			title: 'This week',
			boardId: 'board-3',
			cardIds: ['card-11'],
		},
		{
			id: 'column-10',
			title: 'Next week',
			boardId: 'board-3',
			cardIds: ['card-12'],
		},
	],
	cards: [
		{
			id: 'card-1',
			title: 'Initial planning',
			description: 'Outline basic project steps.',
			tags: ['Initial', 'Planning'],
			images: [
				'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg',
			],
		},
		{
			id: 'card-2',
			title: 'Design UI',
			description: 'Create wireframes for the homepage.',
			tags: ['Design'],
		},
		{
			id: 'card-3',
			title: 'Implement login',
			description: 'Basic login functionality with JWT auth.',
			tags: ['Auth', 'Backend'],
			dueDate: '2025-04-11',
		},
		{
			id: 'card-4',
			title: 'Setup repo',
			description: 'Initialized GitHub repository and setup README.',
			tags: ['Repo'],
			links: ['https://github.com/Divyue30597'],
		},
		{
			id: 'card-5',
			title: 'Take Coco to a vet',
			dueDate: '2025-04-11',
			images: ['https://images.pexels.com/photos/20787/pexels-photo.jpg'],
		},
		{
			id: 'card-6',
			title: 'Taxes 😓',
			subTasks: [
				{ title: 'Accountant contract', done: false },
				{ title: 'Request work payslips', done: false },
				{ title: 'Cancel VAT ID', done: false },
			],
			links: [
				'https://www.irs.gov/businesses/small-businesses-self-employed/filing-your-taxes',
				'https://www.irs.gov/forms-pubs/about-publication-17',
			],
		},
		{
			id: 'card-7',
			title: 'Move',
			description: 'Survive moving places in the pandemic.',
			images: [
				'https://images.pexels.com/photos/30959912/pexels-photo-30959912/free-photo-of-traditional-shrine-in-tokyo-with-umbrella.jpeg',
			],
			subTasks: [
				{ title: 'Request moving estimate', done: false },
				{ title: 'Order moving boxes', done: true },
			],
			assignees: ['user-1'],
		},
		{
			id: 'card-8',
			title: 'Nothing to be done 😌',
			images: [
				'https://images.pexels.com/photos/31165982/pexels-photo-31165982/free-photo-of-beautiful-plum-blossoms-in-nanjing-spring.jpeg',
			],
		},
		{
			id: 'card-9',
			title: 'Review scope',
			description: 'Review #390.',
			dueDate: '2025-04-11',
		},
		{
			id: 'card-10',
			title: 'Team retro',
			subTasks: [
				{ title: 'Schedule time', done: true },
				{ title: 'Set up a Figma board', done: false },
			],
			tags: ['Retro', 'Synthwave', 'Retrowave'],
			images: [
				'https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg',
			],
			links: [
				'https://open.spotify.com/track/7MZM9KhwGQG8QJ4BycsnQn?si=e2c4e9a9a71e4cc4',
			],
		},
		{
			id: 'card-11',
			title: 'Usability test',
			description: 'Research questions with Carina.',
			tags: ['Research'],
			assignees: ['user-2', 'user-3'],
		},
		{
			id: 'card-12',
			title: 'Culture workshop',
			description: 'Let’s build a great team.',
			dueDate: '2025-11-24',
			subTasks: [
				{ title: 'Schedule time', done: true },
				{ title: 'Set up a Figma board', done: false },
				{ title: 'Review exercises with the team', done: false },
			],
			images: [
				'https://images.pexels.com/photos/31508335/pexels-photo-31508335/free-photo-of-serene-waterfall-in-forest-landscape.jpeg',
			],
			assignees: ['user-1'],
		},
	],
};
