import React from "react";
import { HTMLAttributes, useState } from "react";
import styles from "./column.module.scss";

interface ColumnProps extends HTMLAttributes<HTMLDivElement> {
  colName: string;
  colId: string;
  children: React.ReactNode;
  numOfCards: number;
  onCardDrop?: (cardId: string, targetColumnId: string) => void;
}

function Column(props: ColumnProps) {
  const {
    colName,
    colId,
    children,
    className,
    numOfCards,
    onCardDrop,
    ...rest
  } = props;
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (!isDragOver) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const cardId = e.dataTransfer.getData("cardId");
    const sourceColumnId = e.dataTransfer.getData("sourceColumnId");

    if (cardId && onCardDrop && sourceColumnId !== colId) {
      onCardDrop(cardId, colId);
    }
  };

  return (
    <div
      className={`${styles.column} ${className || ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      {...rest}
    >
      <h2>
        {colName} <span>{numOfCards}</span>
      </h2>
      <div className={styles.cards + " column-content"} data-column-id={colId}>
        {/* {children} */}
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && typeof child.type !== "string") {
            return React.cloneElement(child as React.ReactElement<any>, {
              onDragStart: (e: React.DragEvent<HTMLDivElement>) => {
                e.dataTransfer.setData("sourceColumnId", colId);
                if (child.props.onDragStart) {
                  child.props.onDragStart(e);
                }
              },
            });
          }
          return child;
        })}
      </div>
    </div>
  );
}

export default Column;
