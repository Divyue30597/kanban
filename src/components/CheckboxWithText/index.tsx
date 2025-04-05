import styles from "./checkboxWithText.module.scss";

interface CheckboxWithTextProps extends React.HTMLProps<HTMLInputElement> {
  label: string;
}
export default function CheckboxWithText(props: CheckboxWithTextProps) {
  const { className, label, ...rest } = props;

  const id = label.replace(/\s+/g, "-").toLowerCase();

  return (
    <div
      className={styles.checkboxWithText + (className ? ` ${className}` : "")}
    >
      <input {...rest} type="checkbox" id={id} />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}
