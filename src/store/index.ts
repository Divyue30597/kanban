import { configureStore, combineReducers } from "@reduxjs/toolkit";
import boardReducer from "./features/boards/boardSlice";
import columnReducer from "./features/column/columnSlice";
import cardReducer from "./features/cards/cardSlice";
import {
  localStorageMiddleware,
  loadStateFromLocalStorage,
} from "./middleware/localStorageMiddleware";

// Load the state from localStorage if it exists
const preloadedState = loadStateFromLocalStorage();

// Combine reducers
const rootReducer = combineReducers({
  boards: boardReducer,
  columns: columnReducer,
  cards: cardReducer,
});

const store = configureStore({
  reducer: rootReducer,
  // Use preloaded state if it exists, otherwise use default initialState from reducers
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

// Create types for RootState and AppDispatch
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// Export the store after the types are defined
export { store };
