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

const dataV2: Data = {
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

export const data = {
	boards: [
		{
			id: 'board-go',
			title: 'Learning Go Programming',
			description: 'A comprehensive board to master Go over 3 months.',
			columnIds: ['column-go-1', 'column-go-2'],
		},
		{
			id: 'board-python',
			title: 'Learning Python Programming',
			description: 'A structured plan to master Python over 6 months.',
			columnIds: [
				'column-python-1',
				'column-python-2',
				'column-python-3',
				'column-python-4',
				'column-python-5',
				'column-python-6',
			],
		},
	],
	columns: [
		{
			id: 'column-go-1',
			title: 'Months 1-3 - Go Basics & Intermediate',
			boardId: 'board-go',
			cardIds: [
				'card-go-1',
				'card-go-2',
				'card-go-3',
				'card-go-4',
				'card-go-5',
				'card-go-6',
			],
		},
		{
			id: 'column-go-2',
			title: 'Months 4-6 - Go Advanced & Projects',
			boardId: 'board-go',
			cardIds: ['card-go-7', 'card-go-8', 'card-go-9'],
		},
		{
			id: 'column-python-1',
			title: 'Months 1-2 - Python Fundamentals',
			boardId: 'board-python',
			cardIds: ['card-python-1', 'card-python-2'],
		},
		{
			id: 'column-python-2',
			title: 'Month 3 - Data Structures & Algorithms',
			boardId: 'board-python',
			cardIds: ['card-python-3'],
		},
		{
			id: 'column-python-3',
			title: 'Month 4 - OOP & Libraries',
			boardId: 'board-python',
			cardIds: ['card-python-4', 'card-python-5'],
		},
		{
			id: 'column-python-4',
			title: 'Month 5 - Web & Data Handling',
			boardId: 'board-python',
			cardIds: ['card-python-6', 'card-python-7'],
		},
		{
			id: 'column-python-5',
			title: 'Month 6 - Advanced Topics & Final Projects',
			boardId: 'board-python',
			cardIds: ['card-python-8', 'card-python-9'],
		},
		{
			id: 'column-python-6',
			title: 'Final Review & Projects',
			boardId: 'board-python',
			cardIds: ['card-python-10', 'card-python-11', 'card-python-12'],
		},
	],
	cards: [
		{
			id: 'card-go-1',
			title: 'Setup Go Environment & Basics',
			description:
				'Install Go, set up environment, write your first programs.',
			tags: ['Setup', 'Basics'],
			dueDate: '2023-03-01',
		},
		{
			id: 'card-go-2',
			title: 'Learn Go Syntax & Fundamentals',
			description:
				'Variables, data types, control statements, functions.',
			tags: ['Syntax', 'Basics'],
			dueDate: '2023-03-10',
		},
		{
			id: 'card-go-3',
			title: 'Build Basic Go Projects',
			description: 'Practice by creating small CLI apps.',
			tags: ['Projects', 'Practice'],
			links: ['https://tour.golang.org/'],
		},
		{
			id: 'card-go-4',
			title: 'Concurrency & Advanced Features in Go',
			description: 'Goroutines, channels, testing, profiling.',
			tags: ['Concurrency', 'Advanced'],
			dueDate: '2023-04-10',
		},
		{
			id: 'card-go-5',
			title: 'Go Modules & Ecosystem',
			description: 'Manage dependencies and explore popular libraries.',
			tags: ['Modules', 'Libraries'],
			dueDate: '2023-05-10',
		},
		{
			id: 'card-go-6',
			title: 'Final Go Project',
			description: 'Develop a comprehensive project applying all skills.',
			tags: ['Project'],
			images: [
				'https://images.pexels.com/photos/414519/pexels-photo-414519.jpeg',
			],
		},
		{
			id: 'card-python-1',
			title: 'Set Up Python Environment',
			description: 'Install Python and IDE setup.',
			tags: ['Setup', 'Basics'],
			dueDate: '2023-09-01',
		},
		{
			id: 'card-python-2',
			title: 'Learn Python Syntax & Fundamentals',
			description: 'Variables, control flow, functions, scripting.',
			tags: ['Syntax', 'Fundamentals'],
			dueDate: '2023-09-10',
		},
		{
			id: 'card-python-3',
			title: 'Data Structures & Algorithms',
			description: 'Lists, dictionaries, sets, sorting algorithms.',
			tags: ['Data Structures', 'Algorithms'],
			dueDate: '2023-10-10',
		},
		{
			id: 'card-python-4',
			title: 'Deep Dive into Python Libraries',
			description: 'Learn NumPy, Pandas, Requests, and more.',
			tags: ['Libraries', 'Data'],
			links: ['https://pandas.pydata.org/'],
		},
		{
			id: 'card-python-5',
			title: 'Object-Oriented Programming in Python',
			description: 'Classes, inheritance, design patterns.',
			tags: ['OOP'],
			dueDate: '2023-11-10',
		},
		{
			id: 'card-python-6',
			title: 'Modules, Virtual Environments, & Testing',
			description:
				'Use modules, create virtual environments, write tests.',
			tags: ['Modules', 'Testing'],
			dueDate: '2023-12-10',
		},
		{
			id: 'card-python-7',
			title: 'Web Development with Flask/Django',
			description: 'Build web apps, REST APIs.',
			tags: ['Web', 'Frameworks'],
			links: [
				'https://flask.palletsprojects.com/',
				'https://www.djangoproject.com/',
			],
		},
		{
			id: 'card-python-8',
			title: 'Data Handling & APIs',
			description: 'Manipulate files, databases, interface with APIs.',
			tags: ['Data', 'APIs'],
			links: ['https://json.org/'],
		},
		{
			id: 'card-python-9',
			title: 'Asyncio & Concurrency',
			description: 'Async programming, threading, multiprocessing.',
			tags: ['Concurrency', 'Async'],
			dueDate: '2024-01-20',
		},
		{
			id: 'card-python-10',
			title: 'Testing, Profiling & Optimization',
			description: 'Write tests, profile code, optimize performance.',
			tags: ['Testing', 'Optimization'],
			dueDate: '2024-02-15',
		},
		{
			id: 'card-python-11',
			title: 'Capstone Final Project',
			description:
				'Create a full-stack application or data project to integrate skills.',
			tags: ['Project'],
			images: [
				'https://images.pexels.com/photos/414519/pexels-photo-414519.jpeg',
			],
		},
		{
			id: 'card-python-12',
			title: 'Review & Refine Skills',
			description: 'Iterate on projects, prepare portfolio.',
			tags: ['Review', 'Portfolio'],
			images: [
				'https://images.pexels.com/photos/545005/pexels-photo-545005.jpeg',
			],
		},
	],
};
