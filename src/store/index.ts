import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "./features/boards/boardSlice";
import columnReducer from "./features/column/columnSlice";
import cardReducer from "./features/cards/cardSlice";

export const store = configureStore({
  reducer: {
    boards: boardReducer,
    columns: columnReducer,
    cards: cardReducer,
  },
});

// Create types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
