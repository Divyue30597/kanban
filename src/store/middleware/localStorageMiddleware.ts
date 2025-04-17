import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { data } from '../../data/sample';

const STORAGE_KEY = 'kanban_data';

// Check if data exists in localStorage
export const isDataInLocalStorage = (): boolean => {
	return localStorage.getItem(STORAGE_KEY) !== null;
};

// Initialize localStorage with sample data if needed
export const initializeLocalStorage = (): void => {
	if (!isDataInLocalStorage()) {
		// Create initial state with sample data
		const initialState = {
			boards: {
				boards: data.boards,
				activeBoard: data.boards[0]?.id || null,
				loading: false,
				error: null,
			},
			columns: {
				columns: data.columns,
				loading: false,
				error: null,
			},
			cards: {
				cards: data.cards,
				loading: false,
				error: null,
			},
		};

		saveStateToLocalStorage(initialState as RootState);
		console.log('Initialized localStorage with sample data');
	}
};

// Load initial data from localStorage if it exists
export const loadStateFromLocalStorage = <T = any>(): T | undefined => {
	try {
		const serializedState = localStorage.getItem(STORAGE_KEY);
		if (!serializedState) return undefined;
		return JSON.parse(serializedState);
	} catch (err) {
		console.error('Failed to load state from localStorage:', err);
		return undefined;
	}
};

// Save current state to localStorage
export const saveStateToLocalStorage = <T = any>(state: T): void => {
	try {
		const serializedState = JSON.stringify(state);
		localStorage.setItem(STORAGE_KEY, serializedState);
	} catch (err) {
		console.error('Failed to save state to localStorage:', err);
	}
};

// Create middleware that saves state to localStorage after every action
export const localStorageMiddleware: Middleware<{}, RootState> =
	(store) => (next) => (action) => {
		const result = next(action);
		saveStateToLocalStorage(store.getState());
		return result;
	};
