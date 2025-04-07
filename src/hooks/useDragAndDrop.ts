import { useState, useRef, useCallback, useEffect } from "react";
import { CardType } from "../components/Card";

const DRAG_CONFIG = {
  THRESHOLD: 5,
  VISUAL: {
    ROTATION: "rotate(3deg)",
    OPACITY: "0.6",
    BACKGROUND: "#f5f5f5",
    BORDER: "0.2rem dashed #ccc",
    Z_INDEX: "1000",
    BOUNDARY_FEEDBACK: "0 0 0 2px #ff6b6b, 0 0 8px rgba(255, 107, 107, 0.6)",
  },
  SCROLL: {
    MARGIN: 50,
    SPEED: 10,
  },
};

interface DragCard {
  id: string;
  columnId: string;
  initialX: number;
  initialY: number;
  offsetX: number;
  offsetY: number;
}

interface UseDragAndDropProps {
  onCardMove: (
    cardId: string,
    sourceColumnId: string,
    targetColumnId: string
  ) => void;
  dropTargetClassName: string;
  invalidDropTargetClassName: string; // Add this
  boundaryRef?: React.RefObject<HTMLElement>;
}

/**
 * A custom hook that implements drag and drop functionality for cards between columns.
 * Features:
 * - Card dragging with visual feedback
 * - Boundary constraints with visual indicators
 * - Auto-scrolling near boundaries
 * - Column highlighting when dragging over drop targets
 * - Card movement between columns
 */
export function useDragAndDrop({
  onCardMove,
  dropTargetClassName,
  invalidDropTargetClassName, // Add this
  boundaryRef,
}: UseDragAndDropProps) {
  const [draggingCard, setDraggingCard] = useState<DragCard | null>(null);
  const dragElementRef = useRef<HTMLDivElement | null>(null);
  const dragStartedRef = useRef(false);
  const mouseDownPositionRef = useRef({ x: 0, y: 0 });
  const currentTargetColumnRef = useRef<string | null>(null);

  /**
   * Checks if the target column is a valid drop target based on directional constraints.
   * Cards can only move to columns to the right of their current position.
   */
  const isValidDropTarget = useCallback(
    (sourceColumnId: string, targetColumnId: string): boolean => {
      if (!sourceColumnId || !targetColumnId) return false;

      // Get all columns to determine their order
      const columnsElements = document.querySelectorAll("[data-column-id]");
      const columnIds: string[] = [];

      columnsElements.forEach((col) => {
        const colId = col.getAttribute("data-column-id");
        if (colId) columnIds.push(colId);
      });

      // Find indices of source and target columns
      const sourceIndex = columnIds.indexOf(sourceColumnId);
      const targetIndex = columnIds.indexOf(targetColumnId);

      // Valid if target is to the right of source (higher index)
      return targetIndex > sourceIndex;
    },
    []
  );

  /**
   * Updates column highlighting based on the current target column.
   * Adds different highlighting for valid and invalid drop targets.
   */
  const updateColumnHighlights = useCallback(
    (targetColumnId: string | null, isSourceColumn = false) => {
      // First, remove all highlights
      const columnsElements = document.querySelectorAll("[data-column-id]");
      columnsElements.forEach((col) => {
        col.classList.remove(dropTargetClassName);
        col.classList.remove(invalidDropTargetClassName);
        col.querySelectorAll("div").forEach((div) => {
          div.classList.remove(dropTargetClassName);
          div.classList.remove(invalidDropTargetClassName);
        });
      });

      // If we have a target and it's not the source column
      if (targetColumnId && !isSourceColumn && draggingCard) {
        const targetColumn = document.querySelector(
          `[data-column-id="${targetColumnId}"]`
        );

        if (targetColumn) {
          // Determine if this is a valid drop target
          const isValid = isValidDropTarget(
            draggingCard.columnId,
            targetColumnId
          );
          const classToAdd = isValid
            ? dropTargetClassName
            : invalidDropTargetClassName;

          // Add appropriate class based on validity
          const columnContent = targetColumn.querySelector(".column-content");
          if (columnContent) {
            columnContent.classList.add(classToAdd);
          } else {
            targetColumn.classList.add(classToAdd);
          }
        }
      }
    },
    [
      dropTargetClassName,
      invalidDropTargetClassName,
      isValidDropTarget,
      draggingCard,
    ]
  );

  /**
   * Initiates card dragging on mouse down event.
   * Captures initial position, saves card information, and prepares for dragging.
   */
  const handleCardMouseDown = useCallback(
    (e: React.MouseEvent, card: CardType) => {
      if (e.button !== 0) return;

      const cardElement = e.currentTarget as HTMLDivElement;
      const rect = cardElement.getBoundingClientRect();

      mouseDownPositionRef.current = { x: e.clientX, y: e.clientY };
      dragStartedRef.current = false;
      currentTargetColumnRef.current = card.columnId || null;

      updateColumnHighlights(null);

      setDraggingCard({
        id: card.id,
        columnId: card.columnId!,
        initialX: e.clientX,
        initialY: e.clientY,
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top,
      });

      e.preventDefault();
    },
    [updateColumnHighlights]
  );

  /**
   * Determines which column the dragged card is hovering over.
   * Uses the center point of the card element to determine column intersection.
   */
  const findTargetColumn = useCallback(
    (elementRect: DOMRect): string | null => {
      const centerX = elementRect.left + elementRect.width / 2;
      const centerY = elementRect.top + elementRect.height / 2;

      const columnsElements = document.querySelectorAll("[data-column-id]");
      let targetColumnId = null;

      columnsElements.forEach((col) => {
        const colRect = col.getBoundingClientRect();
        if (
          centerX >= colRect.left &&
          centerX <= colRect.right &&
          centerY >= colRect.top &&
          centerY <= colRect.bottom
        ) {
          targetColumnId = col.getAttribute("data-column-id");
        }
      });

      return targetColumnId;
    },
    []
  );

  /**
   * Handles mouse movement during dragging.
   * Creates visual clone when dragging starts, applies boundary constraints,
   * manages auto-scrolling, and updates column highlighting.
   */
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!draggingCard) return;

      const dx = Math.abs(e.clientX - mouseDownPositionRef.current.x);
      const dy = Math.abs(e.clientY - mouseDownPositionRef.current.y);

      const isDragging =
        dx > DRAG_CONFIG.THRESHOLD || dy > DRAG_CONFIG.THRESHOLD;

      if (isDragging && !dragStartedRef.current) {
        dragStartedRef.current = true;

        const cardElement = document.querySelector(
          `[data-card-id="${draggingCard.id}"]`
        ) as HTMLElement;
        if (!cardElement) return;

        const rect = cardElement.getBoundingClientRect();

        const clone = cardElement.cloneNode(true) as HTMLDivElement;
        clone.style.position = "absolute";
        clone.style.width = `${rect.width}px`;
        clone.style.height = `${rect.height}px`;
        clone.style.zIndex = DRAG_CONFIG.VISUAL.Z_INDEX;
        clone.style.pointerEvents = "none";
        clone.style.opacity = "1";
        clone.style.transform = DRAG_CONFIG.VISUAL.ROTATION;
        clone.style.transition = "none";

        clone.style.left = `${rect.left}px`;
        clone.style.top = `${rect.top}px`;

        document.body.appendChild(clone);
        dragElementRef.current = clone;

        cardElement.style.opacity = DRAG_CONFIG.VISUAL.OPACITY;
        cardElement.style.backgroundColor = DRAG_CONFIG.VISUAL.BACKGROUND;
        cardElement.style.border = DRAG_CONFIG.VISUAL.BORDER;
      }

      if (dragStartedRef.current && dragElementRef.current) {
        let newLeft = e.clientX - draggingCard.offsetX;
        let newTop = e.clientY - draggingCard.offsetY;

        if (boundaryRef?.current) {
          const boundary = boundaryRef.current.getBoundingClientRect();
          const cardRect = dragElementRef.current.getBoundingClientRect();
          dragElementRef.current.style.boxShadow = "";

          let hitBoundary = false;

          if (newLeft < boundary.left) {
            newLeft = boundary.left;
            hitBoundary = true;
          }

          if (newLeft + cardRect.width > boundary.right) {
            newLeft = boundary.right - cardRect.width;
            hitBoundary = true;
          }

          if (newTop < boundary.top) {
            newTop = boundary.top;
            hitBoundary = true;
          }

          if (newTop + cardRect.height > boundary.bottom) {
            newTop = boundary.bottom - cardRect.height;
            hitBoundary = true;
          }

          if (hitBoundary) {
            dragElementRef.current.style.boxShadow =
              DRAG_CONFIG.VISUAL.BOUNDARY_FEEDBACK;
          }

          if (
            boundaryRef?.current &&
            boundaryRef.current.scrollHeight > boundaryRef.current.clientHeight
          ) {
            if (e.clientY > boundary.bottom - DRAG_CONFIG.SCROLL.MARGIN) {
              boundaryRef.current.scrollTop += DRAG_CONFIG.SCROLL.SPEED;
            }

            if (e.clientY < boundary.top + DRAG_CONFIG.SCROLL.MARGIN) {
              boundaryRef.current.scrollTop -= DRAG_CONFIG.SCROLL.SPEED;
            }
          }

          if (
            boundaryRef?.current &&
            boundaryRef.current.scrollWidth > boundaryRef.current.clientWidth
          ) {
            if (e.clientX > boundary.right - DRAG_CONFIG.SCROLL.MARGIN) {
              boundaryRef.current.scrollLeft += DRAG_CONFIG.SCROLL.SPEED;
            }

            if (e.clientX < boundary.left + DRAG_CONFIG.SCROLL.MARGIN) {
              boundaryRef.current.scrollLeft -= DRAG_CONFIG.SCROLL.SPEED;
            }
          }
        }

        dragElementRef.current.style.left = `${newLeft}px`;
        dragElementRef.current.style.top = `${newTop}px`;

        const dragRect = dragElementRef.current.getBoundingClientRect();
        const targetColumnId = findTargetColumn(dragRect);
        const isSourceColumn = targetColumnId === draggingCard.columnId;

        currentTargetColumnRef.current = targetColumnId;
        updateColumnHighlights(targetColumnId, isSourceColumn);
      }
    },
    [draggingCard, updateColumnHighlights, findTargetColumn, boundaryRef]
  );

  /**
   * Handles mouse up event when dragging ends.
   * Removes the drag clone, clears highlighting, applies card movement,
   * and resets the dragging state.
   */
  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (!draggingCard) return;

      if (!dragStartedRef.current) {
        console.log("Card clicked:", draggingCard.id);
        setDraggingCard(null);
        return;
      }

      if (dragElementRef.current) {
        document.body.removeChild(dragElementRef.current);
        dragElementRef.current = null;
      }

      updateColumnHighlights(null);

      const targetColumnId = currentTargetColumnRef.current;

      // Only move the card if target is valid
      if (
        targetColumnId &&
        targetColumnId !== draggingCard.columnId &&
        isValidDropTarget(draggingCard.columnId, targetColumnId)
      ) {
        onCardMove(draggingCard.id, draggingCard.columnId, targetColumnId);
      }

      const originalCards = document.querySelectorAll(
        `[data-card-id="${draggingCard.id}"]`
      );
      originalCards.forEach((card) => {
        const cardElement = card as HTMLElement;
        cardElement.style.opacity = "";
        cardElement.style.backgroundColor = "";
        cardElement.style.border = "";
        cardElement.style.transform = "";
      });

      setDraggingCard(null);
      dragStartedRef.current = false;
      currentTargetColumnRef.current = null;

      e.preventDefault();
    },
    [draggingCard, updateColumnHighlights, onCardMove, isValidDropTarget]
  );

  /**
   * Sets up and cleans up event listeners for mouse movement and release.
   * Only active when a card is being dragged.
   */
  useEffect(() => {
    if (draggingCard) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingCard, handleMouseMove, handleMouseUp]);

  return {
    handleCardMouseDown,
    isDragging: !!draggingCard,
  };
}
