import styles from "./boardSetting.module.scss";
import { Dispatch, SetStateAction, useState } from "react";
import FormInput from "../../../../components/FormInput";
import Section from "../../../../components/Section";
import Button from "../../../../components/Button";
import Dropdown from "../../../../components/Dropdown";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { SVG } from "../../../../SVG";
import BoardDropDown from "../../../../components/BoardDropDown";

const boardInputs = [
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

function BoardSettings() {
  const [delActiveBoard, setDelActiveBoard] = useState("Pick a board");

  const dispatch = useAppDispatch();

  return (
    <Section className={styles.boardSettings}>
      <BoardSettingForm />
      <div className={styles.updateBoard}>
        <BoardSettingForm isUpdating={true} />
      </div>
      <div className={styles.deleteBoard}>
        <div className={styles.deleteBoardText}>
          <p>Are you sure you want to delete</p>
          <BoardDropDown
            activeBoard={delActiveBoard}
            setActiveBoard={setDelActiveBoard}
          />
          <p>board?</p>
        </div>
        <Button type="button" className={styles.deleteBtn}>
          Delete
        </Button>
      </div>
    </Section>
  );
}

function BoardSettingForm({ isUpdating = false }: { isUpdating?: boolean }) {
  const [activeBoard, setActiveBoard] = useState("Pick a board");
  const [formState, setFormState] = useState({
    title: isUpdating ? activeBoard : "",
    description: isUpdating ? "" : "",
  });

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form className={styles.form} onSubmit={handleOnSubmit}>
      {isUpdating ? (
        <div className={styles.updateBoard}>
          <p>Update </p>
          <BoardDropDown
            activeBoard={activeBoard}
            setActiveBoard={setActiveBoard}
          />
          <p>board</p>
        </div>
      ) : (
        <h3>Add Board</h3>
      )}
      {boardInputs.map((input) => {
        const {
          id,
          name,
          label,
          required,
          type,
          placeholder,
          errorMessage,
          pattern,
        } = input;

        return (
          <FormInput
            id={id}
            key={name}
            name={name}
            label={label}
            type={type}
            placeholder={placeholder}
            required={required}
            errorMessage={errorMessage}
            pattern={pattern}
            value={formState[name as keyof typeof formState]}
            onChange={handleOnChange}
          />
        );
      })}
      <Button
        type="submit"
        className={isUpdating ? styles.updateSubmitBtn : ""}
      >
        {isUpdating ? "Update" : "Submit"}
      </Button>
    </form>
  );
}

export default BoardSettings;
