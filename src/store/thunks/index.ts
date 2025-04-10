import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../index";
import {
  deleteBoard,
  removeColumnIdFromBoard,
} from "../features/boards/boardSlice";
import {
  deleteColumn,
  deleteColumnsForBoard,
  addCardIdToColumn,
  removeCardIdFromColumn,
  reorderColumnCards,
} from "../features/column/columnSlice";
import { createCard, deleteCardsByIds } from "../features/cards/cardSlice";
import { v4 as uuidv4 } from "uuid";

export const deleteBoardWithRelated = createAsyncThunk<
  string,
  string,
  { dispatch: AppDispatch; state: RootState }
>("boards/deleteBoardWithRelated", async (boardId, { dispatch, getState }) => {
  const state = getState();

  const columnsToDelete = state.columns.columns.filter(
    (col: { boardId: string }) => col.boardId === boardId
  );

  const cardIdsToDelete = columnsToDelete.flatMap(
    (col: { cardIds: string[] }) => col.cardIds
  );

  if (cardIdsToDelete.length > 0) {
    dispatch(deleteCardsByIds(cardIdsToDelete));
  }

  dispatch(deleteColumnsForBoard(boardId));
  dispatch(deleteBoard(boardId));

  return boardId;
});

// Delete a column and all its cards
export const deleteColumnWithRelated = createAsyncThunk<
  string,
  string,
  { dispatch: AppDispatch; state: RootState }
>(
  "columns/deleteColumnWithRelated",
  async (columnId, { dispatch, getState }) => {
    const state = getState();

    const column = state.columns.columns.find(
      (col: { id: string }) => col.id === columnId
    );
    if (!column) {
      throw new Error(`Column with ID ${columnId} not found`);
    }

    dispatch(
      removeColumnIdFromBoard({
        boardId: column.boardId,
        columnId,
      })
    );
    if (column.cardIds.length > 0) {
      dispatch(deleteCardsByIds(column.cardIds));
    }
    dispatch(deleteColumn(columnId));

    return columnId;
  }
);

// Create a new card and add it to a column
export const createCardInColumn = createAsyncThunk<
  string,
  {
    columnId: string;
    title: string;
    description?: string;
    tags?: string[];
    dueDate?: string;
  },
  { dispatch: AppDispatch }
>("cards/createCardInColumn", async (cardData, { dispatch }) => {
  const { columnId, ...cardDetails } = cardData;
  const cardId = uuidv4();
  dispatch(
    createCard({
      id: cardId,
      ...cardDetails,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  );

  dispatch(
    addCardIdToColumn({
      columnId,
      cardId,
    })
  );

  return cardId;
});

export const moveCardBetweenColumns = createAsyncThunk<
  void,
  {
    cardId: string;
    sourceColumnId: string;
    destinationColumnId: string;
    destinationIndex?: number;
  },
  { dispatch: AppDispatch }
>("cards/moveCardBetweenColumns", async (moveData, { dispatch, getState }) => {
  const state = getState() as RootState;
  const { cardId, sourceColumnId, destinationColumnId, destinationIndex } =
    moveData;

  dispatch(
    removeCardIdFromColumn({
      columnId: sourceColumnId,
      cardId,
    })
  );

  if (destinationIndex !== undefined) {
    const destinationColumnCardIds: string[] =
      state.columns.columns.find(
        (col: { id: string; cardIds: string[] }) =>
          col.id === destinationColumnId
      )?.cardIds || [];

    dispatch(
      reorderColumnCards({
        columnId: destinationColumnId,
        cardIds: [
          ...destinationColumnCardIds.slice(0, destinationIndex),
          cardId,
          ...destinationColumnCardIds.slice(destinationIndex),
        ],
      })
    );
  } else {
    dispatch(
      addCardIdToColumn({
        columnId: destinationColumnId,
        cardId,
      })
    );
  }
});
