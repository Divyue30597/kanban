import styles from "./columnSettings.module.scss";
import Section from "../../../../components/Section";
import FormInput from "../../../../components/FormInput";
import { useEffect, useState } from "react";
import BoardDropDown from "../../../../components/BoardDropDown";
import Button from "../../../../components/Button";
import ColumnDropDown from "../../../../components/ColumnDropDown";
import { Board, Column } from "../../../../store/types";
import { SVG } from "../../../../SVG";
import { useAppDispatch } from "../../../../store/hooks";
import { deleteColumnWithRelated } from "../../../../store/thunks";
import {
  createColumn,
  updateColumn,
} from "../../../../store/features/column/columnSlice";

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
  const dispatch = useAppDispatch();

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

  const updating: boolean =
    isUpdating &&
    typeof board !== "string" &&
    board?.id !== null &&
    board?.id !== "" &&
    typeof columnId !== "string" &&
    columnId?.id !== null &&
    columnId?.id !== "";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (updating) {
      dispatch(updateColumn({ ...formState, id: (columnId as Column).id }));
    } else {
      dispatch(createColumn({ ...formState, boardId: (board as Board).id }));
    }
  };

  useEffect(() => {
    if (updating) {
      setFormState({
        title: updating ? (columnId as Column).title : "",
      });
    } else {
      setFormState({
        title: "",
      });
    }
  }, [board, columnId, updating]);

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
        disabled={!updating}
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
    dispatch(deleteColumnWithRelated((deleteColumn as Column).id));
    setDeleteBoard("Pick a board");
    setDeleteColumn("column");
  };

  const dispatch = useAppDispatch();

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
      <p className={styles.deleteAlert}>
        <SVG.alert /> Deleting a column will delete all it's cards. <br />
        This action is not reversible. Proceed with caution.
      </p>
      <Button
        type="button"
        onClick={handleDelete}
        disabled={deleteBoard === "Pick a board" || deleteColumn === "column"}
        className={styles.deleteBtn}
      >
        Delete
      </Button>
    </div>
  );
}

export default ColumnSettings;
