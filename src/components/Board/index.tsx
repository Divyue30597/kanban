import { HTMLProps, useRef, useState, useEffect } from "react";
import styles from "./board.module.scss";
import columnStyles from "../Column/column.module.scss";
import Container from "../Container";
import Button from "../Button";
import RenderModal from "../Modal/modal";
import Column from "../Column";
import Card, { CardType } from "../Card";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";

interface ColumnType {
  id: string;
  name: string;
  cards: CardType[];
}

function Board(props: HTMLProps<HTMLDivElement>) {
  const { children, className, ...rest } = props;
  const [columns, setColumns] = useState<ColumnType[]>([
    {
      id: "col-1",
      name: "To Do",
      cards: [
        {
          id: "card-1",
          heading: "Research",
          description: "Research Analysis",
          columnId: "col-1",
          links: ["https://figma.com", "https://dribbble.com"],
          tags: ["Research", "Analysis"],
        },
        {
          id: "card-2",
          heading: "Design",
          description: "Create wireframes",
          columnId: "col-1",
          images: [
            "https://images.pexels.com/photos/87009/earth-soil-creep-moon-lunar-surface-87009.jpeg",
          ],
          tags: ["Design", "Wireframes"],
        },
      ],
    },
    {
      id: "col-2",
      name: "In Progress",
      cards: [
        {
          id: "card-3",
          heading: "Development",
          description: "Build prototype",
          columnId: "col-2",
          subTasks: [
            "Create components",
            "Implement state management",
            "Connect API",
          ],
          tags: ["Development", "Prototype"],
        },
      ],
    },
    {
      id: "col-3",
      name: "Done",
      cards: [],
    },
  ]);

  const boardRef = useRef<HTMLDivElement | null>(null);
  const boardContentRef = useRef<HTMLDivElement>(null);
  const isTouchDevice = useRef(false);

  // Detect touch support
  useEffect(() => {
    isTouchDevice.current =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0;

    if (isTouchDevice.current) {
      document.body.classList.add("touch-device");
    }

    return () => {
      document.body.classList.remove("touch-device");
    };
  }, []);

  // Handle card drop between columns
  const handleCardDrop = (
    cardId: string,
    sourceColumnId: string,
    targetColumnId: string
  ) => {
    setColumns((prevColumns) => {
      // Find the source and target columns
      const sourceColumnIndex = prevColumns.findIndex(
        (col) => col.id === sourceColumnId
      );
      const targetColumnIndex = prevColumns.findIndex(
        (col) => col.id === targetColumnId
      );

      if (sourceColumnIndex === -1 || targetColumnIndex === -1)
        return prevColumns;

      // Find the card in the source column
      const cardIndex = prevColumns[sourceColumnIndex].cards.findIndex(
        (card) => card.id === cardId
      );
      if (cardIndex === -1) return prevColumns;

      // Get the card and remove it from source column
      const [movedCard] = prevColumns[sourceColumnIndex].cards.splice(
        cardIndex,
        1
      );

      // Update the card's columnId
      const updatedCard = { ...movedCard, columnId: targetColumnId };

      // Add the card to the target column
      prevColumns[targetColumnIndex].cards.push(updatedCard);

      // Return the updated columns array
      return [...prevColumns];
    });
  };

  const { handleCardMouseDown, handleCardTouchStart, isDragging } =
    useDragAndDrop({
      onCardMove: handleCardDrop,
      dropTargetClassName: columnStyles.validDropTarget,
      invalidDropTargetClassName: columnStyles.invalidDropTarget,
      boundaryRef: boardContentRef,
    });

  // Prevent default touch behaviors when dragging
  useEffect(() => {
    const preventDefaultTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchmove", preventDefaultTouchMove, {
      passive: false,
    });

    return () => {
      document.removeEventListener("touchmove", preventDefaultTouchMove);
    };
  }, [isDragging]);

  return (
    <div
      ref={boardRef}
      className={styles.board + (className ? ` ${className}` : "")}
    >
      <div className={styles.boardHeader}>
        <div className={styles.boardHeaderContent}>
          <h1>Design weekly</h1>
          <p>A board to keep track of design progress.</p>
        </div>
        <div className={styles.boardHeaderActions}>
          <RenderModal />
          <Button>Add Column</Button>
        </div>
      </div>
      <div ref={boardContentRef} className={styles.boardContent}>
        <Container {...rest} className={styles.columns}>
          {columns.map((column) => (
            <Column
              key={column.id}
              colId={column.id}
              colName={column.name}
              className={styles.column}
              data-column-id={column.id}
              onCardDrop={handleCardDrop}
            >
              {column.cards.map((card) => (
                <Card
                  key={card.id}
                  id={card.id}
                  heading={card.heading}
                  description={card.description}
                  tags={card.tags}
                  links={card?.links}
                  images={card?.images}
                  subTasks={card?.subTasks}
                  data-card-id={card.id}
                  onMouseDown={(e) => handleCardMouseDown(e, card)}
                  onTouchStart={(e) => handleCardTouchStart(e, card)}
                  style={{ WebkitTapHighlightColor: "rgba(0,0,0,0)" }}
                />
              ))}
            </Column>
          ))}
        </Container>
      </div>
    </div>
  );
}

export default Board;
