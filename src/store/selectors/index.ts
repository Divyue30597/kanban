import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { ColumnStatus } from '../types';

// Board Selectors
export const selectBoards = (state: RootState) => state.boards.boards;

export const selectActiveBoard = (state: RootState) => {
	const { activeBoard, boards } = state.boards;
	return boards.find((board) => board.id === activeBoard) || null;
};

// Column Selectors
export const selectAllColumns = (state: RootState) => state.columns.columns;

export const selectBoardColumns = createSelector([selectActiveBoard, selectAllColumns], (activeBoard, columns) => {
	if (!activeBoard) return [];

	return activeBoard.columnIds.map((columnId) => columns.find((col) => col.id === columnId)).filter(Boolean);
});

// Card Selectors
export const selectAllCards = (state: RootState) => state.cards.cards;

export const selectCardsByIds = createSelector(
	[selectAllCards, (_: RootState, cardIds: string[]) => cardIds],
	(cards, cardIds) => {
		return cardIds.map((id) => cards.find((card) => card.id === id)).filter(Boolean);
	}
);

export const selectColumnCards = createSelector(
	[selectAllCards, (_: RootState, columnId: string) => columnId, selectAllColumns],
	(cards, columnId, columns) => {
		const column = columns.find((col) => col.id === columnId);
		if (!column) return [];

		// Map card IDs to actual card objects
		return column.cardIds.map((cardId) => cards.find((card) => card.id === cardId)).filter(Boolean);
	}
);

// More specific selectors
export const selectCardById = createSelector(
	[selectAllCards, (_: RootState, cardId: string) => cardId],
	(cards, cardId) => cards.find((card) => card.id === cardId)
);

export const selectColumnById = createSelector(
	[selectAllColumns, (_: RootState, columnId: string) => columnId],
	(columns, columnId) => columns.find((col) => col.id === columnId) || null
);
