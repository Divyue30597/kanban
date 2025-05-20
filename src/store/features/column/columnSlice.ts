import { data } from '../../../data/sample';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IColumn } from '../../types';

interface ColumnState {
	columns: IColumn[];
	loading: boolean;
	error: string | null;
}

const initialState: ColumnState = {
	columns: data.columns as IColumn[],
	loading: false,
	error: null,
};

const columnSlice = createSlice({
	name: 'columns',
	initialState,
	reducers: {
		createColumn: (state, action: PayloadAction<{ title: string; boardId: string; id: string }>) => {
			const { title, id, boardId } = action.payload;
			const newColumn: IColumn = {
				id,
				title,
				boardId,
				createdBy: 'user',
				columnsList: [
					...state.columns[0].columnsList.map((col) => ({
						...col,
						cardIds: [],
					})),
				],
				createdTimeStamp: new Date().toISOString(),
				updatedTimeStamp: new Date().toISOString(),
			};
			state.columns.push(newColumn);
		},

		updateColumn: (state, action: PayloadAction<Partial<IColumn> & { id: string }>) => {
			const { id, ...changes } = action.payload;
			const column = state.columns.find((col) => col.id === id);

			if (column) {
				Object.assign(column, changes);
			}
		},

		deleteColumn: (state, action: PayloadAction<string>) => {
			const columnId = action.payload;
			state.columns = state.columns.filter((column) => column.id !== columnId);
		},

		deleteColumnsForBoard: (state, action: PayloadAction<string>) => {
			const boardId = action.payload;
			state.columns = state.columns.filter((column) => column.boardId !== boardId);
		},

		addCardIdToColumn: (state, action: PayloadAction<{ columnId: string; cardId: string }>) => {
			const { columnId, cardId } = action.payload;
			const columnListId = columnId.split('@')[0];
			const colId = columnId.split('@')[1];
			const column = state.columns.find((col) => col.id === colId);
			const columnList = column?.columnsList.find((colList) => colList.id === columnListId);
			if (columnList) {
				if (!columnList.cardIds.includes(cardId)) {
					columnList.cardIds.push(cardId);
				}
				const updatedCardIds = columnList.cardIds.filter((id) => id !== cardId);
				columnList.cardIds = [...updatedCardIds, cardId];
			}
		},

		removeCardIdFromColumn: (state, action: PayloadAction<{ columnId: string; cardId: string }>) => {
			const { columnId, cardId } = action.payload;
			const columnListId = columnId.split('@')[0];
			const colId = columnId.split('@')[1];
			const column = state.columns.find((col) => col.id === colId);
			const columnList = column?.columnsList.find((colList) => colList.id === columnListId);
			if (columnList) {
				if (columnList.cardIds.includes(cardId)) {
					columnList.cardIds = columnList.cardIds.filter((id) => id !== cardId);
				}
				const updatedCardIds = columnList.cardIds.filter((id) => id !== cardId);
				columnList.cardIds = updatedCardIds;
			}
		},

		reorderColumnCards: (state, action: PayloadAction<{ columnId: string; cardIds: string[] }>) => {
			const { columnId, cardIds } = action.payload;
			const column = state.columns.find((col) => col.id === columnId);

			if (column) {
				// Verify that we're only reordering existing cards
				const validCardIds = cardIds.filter((id) => column.cardIds.includes(id));
				if (validCardIds.length === column.cardIds.length) {
					column.cardIds = validCardIds;
				}
			}
		},

		setColumnsLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},

		setColumnsError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
	},
});

export const {
	createColumn,
	updateColumn,
	deleteColumn,
	deleteColumnsForBoard,
	addCardIdToColumn,
	removeCardIdFromColumn,
	reorderColumnCards,
	setColumnsLoading,
	setColumnsError,
} = columnSlice.actions;

export default columnSlice.reducer;
