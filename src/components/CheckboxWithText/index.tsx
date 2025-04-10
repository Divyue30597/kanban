import { toggleSubtaskDone } from "../../store/features/cards/cardSlice";
import { useAppDispatch } from "../../store/hooks";
import styles from "./checkboxWithText.module.scss";

interface CheckboxWithTextProps extends React.HTMLProps<HTMLInputElement> {
  label: string;
  cardId: string;
  index: number;
}
export default function CheckboxWithText(props: CheckboxWithTextProps) {
  const { className, label, checked, cardId, index, ...rest } = props;
  const dispatch = useAppDispatch();
  const id = label.replace(/\s+/g, "-").toLowerCase();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleSubtaskDone({ cardId, index }));
  };

  return (
    <div
      className={styles.checkboxWithText + (className ? ` ${className}` : "")}
    >
      <input
        {...rest}
        type="checkbox"
        checked={checked}
        id={id}
        onChange={handleChange}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}
