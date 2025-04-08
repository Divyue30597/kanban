import React from "react";

export interface DragCard {
  id: string;
  columnId: string;
  initialX: number;
  initialY: number;
  offsetX: number;
  offsetY: number;
}

export interface UseDragAndDropProps {
  onCardMove: (
    cardId: string,
    sourceColumnId: string,
    targetColumnId: string,
  ) => void;
  dropTargetClassName: string;
  invalidDropTargetClassName: string;
  boundaryRef?: React.RefObject<HTMLElement>;
  columnContentSelector?: string;
  allowBackwardMovement?: boolean;
  cardSelector?: string;
}

export interface DragState {
  draggingCard: DragCard | null;
  isDragging: boolean;
}
