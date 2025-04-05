import { HTMLProps } from "react";
import styles from "./container.module.scss";

export default function Container(props: HTMLProps<HTMLDivElement>) {
  const { children, className } = props;
  return (
    <div className={styles.container + (className ? ` ${className}` : "")}>
      {children}
    </div>
  );
}
