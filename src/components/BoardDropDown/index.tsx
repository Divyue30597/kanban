import { Dispatch, SetStateAction } from "react";
import { useAppSelector } from "../../store/hooks";
import styles from "./boardDropDown.module.scss";
import { SVG } from "../../SVG";
import Button from "../Button";
import Dropdown from "../Dropdown";

interface BoardDropDownProps {
  activeBoard?: string;
  setActiveBoard?: Dispatch<SetStateAction<string>>;
}

function BoardDropDown(props: BoardDropDownProps) {
  const { setActiveBoard, activeBoard } = props;

  const boards = useAppSelector((state) => state.boards.boards);
  const boardsName = boards.map((board) => board.title);

  return (
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
  );
}

export default BoardDropDown;
