import styles from "./checkboxWithText.module.scss";

interface CheckboxWithTextProps extends React.HTMLProps<HTMLInputElement> {
  label: string;
}
export default function CheckboxWithText(props: CheckboxWithTextProps) {
  const { className, label, checked, ...rest } = props;

  const id = label.replace(/\s+/g, "-").toLowerCase();

  return (
    <div
      className={styles.checkboxWithText + (className ? ` ${className}` : "")}
    >
      <input {...rest} type="checkbox" checked={checked} id={id} />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}
