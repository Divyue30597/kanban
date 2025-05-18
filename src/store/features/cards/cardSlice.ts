import { data } from '../../../data/sample';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Card } from '../../types';

interface CardState {
	cards: Card[];
	loading: boolean;
	error: string | null;
}

const initialState: CardState = {
	cards: data.cards as Card[],
	loading: false,
	error: null,
};

const cardSlice = createSlice({
	name: 'cards',
	initialState,
	reducers: {
		createCard: (state, action: PayloadAction<Card>) => {
			state.cards.push(action.payload);
		},

		updateCard: (state, action: PayloadAction<Partial<Card> & { id: string }>) => {
			const { id, ...changes } = action.payload;
			const card = state.cards.find((card) => card.id === id);

			if (card) {
				Object.assign(card, changes);
			}
		},

		deleteCard: (state, action: PayloadAction<string>) => {
			const cardId = action.payload;
			state.cards = state.cards.filter((card) => card.id !== cardId);
		},

		toggleSubtaskDone: (state, action: PayloadAction<{ cardId: string; index: number }>) => {
			const { cardId, index } = action.payload;
			const card = state.cards.find((card) => card.id === cardId);

			if (card && card.subTasks && index >= 0 && index < card.subTasks.length) {
				card.subTasks[index].done = !card.subTasks[index].done;
			}
		},

		deleteCardsByIds: (state, action: PayloadAction<string[]>) => {
			const cardIds = action.payload;
			state.cards = state.cards.filter((card) => !cardIds.includes(card.id));
		},

		setCardsLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},

		setCardsError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
	},
});

export const {
	createCard,
	updateCard,
	deleteCard,
	toggleSubtaskDone,
	deleteCardsByIds,
	setCardsLoading,
	setCardsError,
} = cardSlice.actions;

export default cardSlice.reducer;
