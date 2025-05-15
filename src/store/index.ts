import { configureStore, combineReducers } from '@reduxjs/toolkit';
import boardReducer from './features/boards/boardSlice';
import columnReducer from './features/column/columnSlice';
import cardReducer from './features/cards/cardSlice';
import themeGeneratorReducer from './features/themeGenerator/themeGeneratorSlice';
import {
	localStorageMiddleware,
	loadStateFromLocalStorage,
} from './middleware/localStorageMiddleware';

const preloadedState = loadStateFromLocalStorage();

const rootReducer = combineReducers({
	boards: boardReducer,
	columns: columnReducer,
	cards: cardReducer,
	themeGenerator: themeGeneratorReducer,
});

const store = configureStore({
	reducer: rootReducer,
	preloadedState,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export { store };
