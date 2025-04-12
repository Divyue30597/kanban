import React, { ButtonHTMLAttributes } from "react";
import styles from "./button.module.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export default function Button(props: ButtonProps) {
  const { children, icon, className, type, ...rest } = props;

  return (
    <button
      {...rest}
      type={type || "button"}
      className={styles.button + " " + className}
    >
      {children}
      {icon && <span className={styles.icon}>{icon}</span>}
    </button>
  );
}
