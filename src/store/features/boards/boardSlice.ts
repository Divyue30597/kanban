import { data } from '../../../data/sample';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { Board } from '../../types';

interface BoardState {
	boards: Board[];
	activeBoard: string | null;
	loading: boolean;
	error: string | null;
}

const initialState: BoardState = {
	boards: data.boards as Board[],
	activeBoard: data?.boards?.[0]?.id || null,
	loading: false,
	error: null,
};

const boardSlice = createSlice({
	name: 'boards',
	initialState,
	reducers: {
		createBoard: (state, action: PayloadAction<Omit<Board, 'id' | 'columnIds'>>) => {
			const newBoard: Board = {
				id: uuidv4(),
				...action.payload,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				columnIds: [],
			};

			state?.boards?.push(newBoard);
		},

		updateBoard: (state, action: PayloadAction<Partial<Board> & { id: string }>) => {
			const { id, ...changes } = action.payload;
			const board = state.boards.find((board) => board.id === id);

			if (board) {
				Object.assign(board, changes);
			}
		},

		deleteBoard: (state, action: PayloadAction<string>) => {
			const boardId = action.payload;
			state.boards = state.boards.filter((board) => board.id !== boardId);

			if (state.activeBoard === boardId) {
				return;
			}
		},

		// Set the active board
		setActiveBoard: (state, action: PayloadAction<string>) => {
			const boardId = action.payload;
			if (state.boards.some((board) => board.id === boardId)) {
				state.activeBoard = boardId;
			}
		},

		addColumnIdToBoard: (state, action: PayloadAction<{ boardId: string; columnId: string }>) => {
			const { boardId, columnId } = action.payload;
			const board = state.boards.find((board) => board.id === boardId);

			if (board && !board.columnIds.includes(columnId)) {
				board.columnIds.push(columnId);
			}
		},

		removeColumnIdFromBoard: (state, action: PayloadAction<{ boardId: string; columnId: string }>) => {
			const { boardId, columnId } = action.payload;
			const board = state.boards.find((board) => board.id === boardId);

			if (board) {
				board.columnIds = board.columnIds.filter((id) => id !== columnId);
			}
		},

		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},

		setError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
	},
});

export const {
	createBoard,
	updateBoard,
	deleteBoard,
	setActiveBoard,
	addColumnIdToBoard,
	removeColumnIdFromBoard,
	setLoading,
	setError,
} = boardSlice.actions;

export default boardSlice.reducer;
