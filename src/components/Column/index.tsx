import { HTMLAttributes } from "react";
import styles from "./column.module.scss";

interface ColumnProps extends HTMLAttributes<HTMLDivElement> {
  colName: string;
  children: React.ReactNode;
}

function Column(props: ColumnProps) {
  const { colName, children, className, ...rest } = props;
  return (
    <div
      className={styles.column + (className ? ` ${className}` : "")}
      {...rest}
    >
      <h2>{colName}</h2>
      <div className={styles.cards}>{children}</div>
    </div>
  );
}

export default Column;
