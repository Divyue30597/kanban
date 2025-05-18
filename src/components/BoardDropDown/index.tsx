import { Dispatch, SetStateAction } from 'react';
import { useAppSelector } from '../../store/hooks';
import styles from './boardDropDown.module.scss';
import { SVG } from '../../SVG';
import Button from '../Button';
import Dropdown from '../Dropdown';
import { Board } from '../../store/types';

interface BoardDropDownProps {
	activeBoard?: Board | string;
	setActiveBoard: Dispatch<SetStateAction<string | Board>>;
}

function BoardDropDown(props: BoardDropDownProps) {
	const { activeBoard, setActiveBoard } = props;

	const boards = useAppSelector((state) => state.boards.boards);

	return (
		<Dropdown
			className={styles.dropdownBtn}
			placement="bottom-left"
			trigger={
				<Button icon={<SVG.chevronDown />}>{typeof activeBoard === 'string' ? activeBoard : activeBoard?.title}</Button>
			}
		>
			{boards?.map((board) => (
				<button type="button" key={board.id} onClick={() => setActiveBoard(board)}>
					{board.title}
				</button>
			))}
		</Dropdown>
	);
}

export default BoardDropDown;
