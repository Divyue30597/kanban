import { ButtonHTMLAttributes } from "react";
import styles from "./button.module.scss";

export default function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { children, className, ...rest } = props;

  return (
    <button {...rest} type="button" className={styles.button + " " + className}>
      {children}
    </button>
  );
}
