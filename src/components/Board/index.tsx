import { HTMLProps } from "react";
import styles from "./board.module.scss";
import Container from "../Container";
import Button from "../Button";
import RenderModal from "../Modal/modal";

function Board(props: HTMLProps<HTMLDivElement>) {
  const { children, className, ...rest } = props;

  return (
    <div className={styles.board + (className ? ` ${className}` : "")}>
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
      <div className={styles.boardContent}>
        <Container {...rest} className={styles.columns}>
          {children}
        </Container>
      </div>
    </div>
  );
}

export default Board;
