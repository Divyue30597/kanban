import styles from "./columnSettings.module.scss";
import Section from "../../../../components/Section";
import FormInput from "../../../../components/FormInput";
import { useState } from "react";
import BoardDropDown from "../../../../components/BoardDropDown";

const COLUMN_INPUT = [
  {
    id: "title",
    label: "Title",
    type: "text",
    required: true,
    pattern: "^[\\w\\s\\p{P}\\p{S}]+$",
    placeholder: "e.g. Design Weekly",
    name: "title",
    errorMessage: "Heading is required.",
  },
  {
    id: "description",
    label: "Description",
    type: "textarea",
    pattern: "^[\\w\\s\\p{P}\\p{S}]+$",
    minLength: 10,
    maxLength: 200,
    required: true,
    placeholder:
      "e.g. Create wireframes and high-fidelity designs for the app's main screens.",
    name: "description",
    errorMessage: "Description is required.",
  },
];

function ColumnSettings() {
  return (
    <Section className={styles.columnSettings}>
      <UpdateForm />
    </Section>
  );
}

function UpdateForm() {
  const [formState, setFormState] = useState({
    title: "",
    description: "",
  });
  const [board, setBoard] = useState("Pick a board");

  return (
    <form className={styles.form}>
      <div className={styles.formHeader}>
        <h3>Add Column to</h3>
        <BoardDropDown activeBoard={board} setActiveBoard={setBoard} />
      </div>
      {COLUMN_INPUT.map((input) => {
        const {
          id,
          name,
          label,
          type,
          required,
          pattern,
          placeholder,
          errorMessage,
        } = input;
        return (
          <FormInput
            label={label}
            id={id}
            name={name}
            type={type}
            required={required}
            pattern={pattern}
            placeholder={placeholder}
            errorMessage={errorMessage}
            value={""}
            // onChange={}
          />
        );
      })}
    </form>
  );
}

export default ColumnSettings;
