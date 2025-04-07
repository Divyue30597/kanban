import { useState, useRef, useCallback, useEffect } from "react";
import { CardType } from "../components/Card";

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
}

export function useDragAndDrop({
  onCardMove,
  dropTargetClassName,
}: UseDragAndDropProps) {
  // State for dragging
  const [draggingCard, setDraggingCard] = useState<DragCard | null>(null);

  const dragElementRef = useRef<HTMLDivElement | null>(null);

  // Add a new ref to track if drag has actually started
  const dragStartedRef = useRef(false);
  const mouseDownPositionRef = useRef({ x: 0, y: 0 });

  // Start dragging a card
  const handleCardMouseDown = (e: React.MouseEvent, card: CardType) => {
    // Only activate on left click
    if (e.button !== 0) return;

    const cardElement = e.currentTarget as HTMLDivElement;
    const rect = cardElement.getBoundingClientRect();

    // Save the position where mouse was pressed down
    mouseDownPositionRef.current = { x: e.clientX, y: e.clientY };
    // Reset the drag started flag
    dragStartedRef.current = false;

    // Don't create clone or apply styles yet - do this in mousemove

    // Save initial position and offset
    setDraggingCard({
      id: card.id,
      columnId: card.columnId!,
      initialX: e.clientX,
      initialY: e.clientY,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    });

    // Prevent text selection
    e.preventDefault();
  };

  // Handle mouse movement
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!draggingCard) return;

      // Calculate distance moved from initial mouse down
      const dx = Math.abs(e.clientX - mouseDownPositionRef.current.x);
      const dy = Math.abs(e.clientY - mouseDownPositionRef.current.y);

      // Only consider it a drag if moved more than 5 pixels
      const dragThreshold = 5;
      const isDragging = dx > dragThreshold || dy > dragThreshold;

      // If this is the first time we've crossed the threshold
      if (isDragging && !dragStartedRef.current) {
        dragStartedRef.current = true;

        // Find the original card element
        const cardElement = document.querySelector(
          `[data-card-id="${draggingCard.id}"]`
        ) as HTMLElement;
        if (!cardElement) return;

        const rect = cardElement.getBoundingClientRect();

        // Now create the clone for dragging
        const clone = cardElement.cloneNode(true) as HTMLDivElement;
        clone.style.position = "absolute";
        clone.style.width = `${rect.width}px`;
        clone.style.height = `${rect.height}px`;
        clone.style.zIndex = "1000";
        clone.style.pointerEvents = "none";
        clone.style.opacity = "1";
        clone.style.transform = "rotate(3deg)";
        clone.style.transition = "none";

        // Set initial position
        clone.style.left = `${rect.left}px`;
        clone.style.top = `${rect.top}px`;

        document.body.appendChild(clone);
        dragElementRef.current = clone;

        // Apply styles to the original card to show it's being dragged
        cardElement.style.opacity = "0.6"; // Semi-transparent
        cardElement.style.backgroundColor = "#f5f5f5"; // Light gray background
        cardElement.style.border = "0.2rem dashed #ccc"; // Dashed border
      }

      // Only proceed with drag behavior if we're actually dragging
      if (dragStartedRef.current && dragElementRef.current) {
        // Move the clone with the mouse
        dragElementRef.current.style.left = `${
          e.clientX - draggingCard.offsetX
        }px`;
        dragElementRef.current.style.top = `${
          e.clientY - draggingCard.offsetY
        }px`;

        // Highlight potential drop targets
        const columnsElements = document.querySelectorAll("[data-column-id]");
        columnsElements.forEach((col) => {
          const rect = col.getBoundingClientRect();
          if (
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom
          ) {
            col.classList.add(dropTargetClassName);
          } else {
            col.classList.remove(dropTargetClassName);
          }
        });
      }
    },
    [draggingCard]
  );

  // Handle mouse up - dropping the card
  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (!draggingCard) return;

      // If we never started dragging, treat it as a click
      if (!dragStartedRef.current) {
        // Handle click behavior here if needed
        console.log("Card clicked:", draggingCard.id);
        setDraggingCard(null);
        return;
      }

      // Normal drag ending behavior
      if (dragElementRef.current) {
        document.body.removeChild(dragElementRef.current);
        dragElementRef.current = null;
      }

      // Rest of your existing handleMouseUp code...
      const columnsElements = document.querySelectorAll("[data-column-id]");
      let targetColumnId = draggingCard.columnId;

      columnsElements.forEach((col) => {
        col.classList.remove(dropTargetClassName);
        const rect = col.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          targetColumnId = col.getAttribute("data-column-id") || targetColumnId;
        }
      });

      // If column changed, move the card
      if (targetColumnId !== draggingCard.columnId) {
        onCardMove(draggingCard.id, draggingCard.columnId, targetColumnId);
      }

      // Restore all original card styles
      const originalCards = document.querySelectorAll(
        `[data-card-id="${draggingCard.id}"]`
      );
      originalCards.forEach((card) => {
        const cardElement = card as HTMLElement;
        // Reset all modified styles
        cardElement.style.opacity = "";
        cardElement.style.backgroundColor = "";
        cardElement.style.border = "";
        cardElement.style.transform = "";
      });

      // Reset dragging state
      setDraggingCard(null);
      dragStartedRef.current = false;
    },
    [draggingCard]
  );

  // Add and remove event listeners
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
