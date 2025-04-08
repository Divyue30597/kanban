import { data } from "../../../data/sample";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { Column } from "../../types";

interface ColumnState {
  columns: Column[];
  loading: boolean;
  error: string | null;
}

const initialState: ColumnState = {
  columns: data.columns as Column[],
  loading: false,
  error: null,
};

const columnSlice = createSlice({
  name: "columns",
  initialState,
  reducers: {
    // Create a new column in a board
    createColumn: (
      state,
      action: PayloadAction<{ title: string; boardId: string }>
    ) => {
      const { title, boardId } = action.payload;
      const newColumn: Column = {
        id: uuidv4(),
        title,
        boardId,
        cardIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.columns.push(newColumn);
    },

    updateColumn: (
      state,
      action: PayloadAction<Partial<Column> & { id: string }>
    ) => {
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
      state.columns = state.columns.filter(
        (column) => column.boardId !== boardId
      );
    },

    addCardIdToColumn: (
      state,
      action: PayloadAction<{ columnId: string; cardId: string }>
    ) => {
      const { columnId, cardId } = action.payload;
      const column = state.columns.find((col) => col.id === columnId);

      if (column && !column.cardIds.includes(cardId)) {
        column.cardIds.push(cardId);
      }
    },

    removeCardIdFromColumn: (
      state,
      action: PayloadAction<{ columnId: string; cardId: string }>
    ) => {
      const { columnId, cardId } = action.payload;
      const column = state.columns.find((col) => col.id === columnId);

      if (column) {
        column.cardIds = column.cardIds.filter((id) => id !== cardId);
      }
    },

    reorderColumnCards: (
      state,
      action: PayloadAction<{ columnId: string; cardIds: string[] }>
    ) => {
      const { columnId, cardIds } = action.payload;
      const column = state.columns.find((col) => col.id === columnId);

      if (column) {
        // Verify that we're only reordering existing cards
        const validCardIds = cardIds.filter((id) =>
          column.cardIds.includes(id)
        );
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
