import styles from "./boardSetting.module.scss";
import { Dispatch, SetStateAction, useState } from "react";
import FormInput from "../../../../components/FormInput";
import Section from "../../../../components/Section";
import Button from "../../../../components/Button";
import Dropdown from "../../../../components/Dropdown";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { SVG } from "../../../../SVG";

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
  const boards = useAppSelector((state) => state.boards.boards);
  const boardsName = boards.map((board) => board.title);
  const [activeBoard, setActiveBoard] = useState(
    boardsName[0] || "Pick a board"
  );
  const [delActiveBoard, setDelActiveBoard] = useState(
    boardsName[0] || "Pick a board"
  );

  const dispatch = useAppDispatch();

  return (
    <Section className={styles.boardSettings}>
      <BoardSettingForm />
      <div className={styles.updateBoard}>
        <BoardSettingForm
          isUpdating={true}
          activeBoard={activeBoard}
          boardsName={boardsName}
          setActiveBoard={setActiveBoard}
        />
      </div>
      <div className={styles.deleteBoard}>
        <div className={styles.deleteBoardText}>
          <p>Are you sure you want to delete</p>
          <Dropdown
            placement="bottom-left"
            className={styles.dropdownBtn}
            trigger={
              <Button icon={<SVG.chevronDown />}>{delActiveBoard}</Button>
            }
          >
            {boardsName.map((board) => (
              <button
                type="button"
                key={board}
                onClick={() => {
                  setDelActiveBoard(board);
                }}
              >
                {board}
              </button>
            ))}
          </Dropdown>
          <p>board?</p>
        </div>
        <Button type="button" className={styles.deleteBtn}>
          Delete
        </Button>
      </div>
    </Section>
  );
}

function BoardSettingForm({
  isUpdating = false,
  activeBoard,
  boardsName,
  setActiveBoard,
}: {
  isUpdating?: boolean;
  activeBoard?: string;
  boardsName?: string[];
  setActiveBoard?: Dispatch<SetStateAction<string>>;
}) {
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
          <Dropdown
            className={styles.dropdownBtn}
            placement="bottom-left"
            trigger={<Button icon={<SVG.chevronDown />}>{activeBoard}</Button>}
          >
            {boardsName?.map((board) => (
              <button
                type="button"
                key={board}
                onClick={() => {
                  setActiveBoard && setActiveBoard(board);
                }}
              >
                {board}
              </button>
            ))}
          </Dropdown>
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
