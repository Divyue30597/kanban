import styles from "./columnSettings.module.scss";
import Section from "../../../../components/Section";
import FormInput from "../../../../components/FormInput";
import { useEffect, useState } from "react";
import BoardDropDown from "../../../../components/BoardDropDown";
import Button from "../../../../components/Button";
import ColumnDropDown from "../../../../components/ColumnDropDown";
import { Board, Column } from "../../../../store/types";

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
];

function ColumnSettings() {
  return (
    <Section className={styles.columnSettings}>
      <UpdateForm />
      <UpdateForm isUpdating={true} />
      <DeleteColumn />
    </Section>
  );
}

function UpdateForm({ isUpdating = false }) {
  const [formState, setFormState] = useState({
    title: "",
  });

  const [board, setBoard] = useState<Board | string>(
    isUpdating ? "Pick a board" : "Board"
  );
  const [columnId, setColumnId] = useState<Column | string>(
    isUpdating ? "update a column" : "Column"
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updating =
    isUpdating &&
    board &&
    (board as Board).id !== null &&
    (board as Board).id !== "" &&
    columnId &&
    (columnId as Column).id !== null &&
    (columnId as Column).id !== "";
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (updating) {
      // console.log("Updating column", formState, board, columnId);
    } else {
      // console.log("Adding column", formState, board);
    }
  };


  useEffect(() => {
    if (isUpdating) {
      setFormState({
        title: updating ? (columnId as Column).title : "",
      });
    } else {
      setFormState({
        title: "",
      });
    }
  }, [board, columnId, isUpdating]);

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formHeader}>
        {isUpdating ? (
          <>
            <BoardDropDown activeBoard={board} setActiveBoard={setBoard} />
            <h3>to</h3>
            <ColumnDropDown
              boardId={board && (board as Board).id}
              columnId={columnId}
              setColumnId={setColumnId}
            />
          </>
        ) : (
          <>
            <h3>Add Column to</h3>
            <BoardDropDown activeBoard={board} setActiveBoard={setBoard} />
          </>
        )}
      </div>
      <div className={styles.formBody}>
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
              value={formState.title}
              onChange={handleChange}
            />
          );
        })}
      </div>
      <Button
        type="submit"
        className={isUpdating ? styles.updateSubmitBtn : ""}
      >
        {!isUpdating ? "Submit" : "Update"}
      </Button>
    </form>
  );
}

function DeleteColumn() {
  const [deleteBoard, setDeleteBoard] = useState<Board | string>(
    "Pick a board"
  );

  const [deleteColumn, setDeleteColumn] = useState<Column | string>("column");

  const handleDelete = () => {
    // console.log(
    //   "Deleting column",
    //   (deleteColumn as Column).id,
    //   (deleteBoard as Board).id
    // );
  };

  return (
    <div className={styles.deleteCol}>
      <div className={styles.deleteColBody}>
        <BoardDropDown
          activeBoard={deleteBoard}
          setActiveBoard={setDeleteBoard}
        />
        <h3>to delete a</h3>
        <ColumnDropDown
          boardId={deleteBoard && (deleteBoard as Board).id}
          columnId={deleteColumn}
          setColumnId={setDeleteColumn}
        />
      </div>
      <Button type="button" onClick={handleDelete} className={styles.deleteBtn}>
        Delete
      </Button>
    </div>
  );
}

export default ColumnSettings;
