import { HTMLProps } from "react";
import styles from "./container.module.scss";

export default function Container(props: HTMLProps<HTMLDivElement>) {
  const { children, className, ...rest } = props;
  return (
    <div
      {...rest}
      className={(className ? `${className} ` : "") + styles.container}
    >
      {children}
    </div>
  );
}
