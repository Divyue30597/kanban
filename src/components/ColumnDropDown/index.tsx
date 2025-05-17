import { Dispatch, SetStateAction } from 'react';
import { useAppSelector } from '../../store/hooks';
import styles from './columnDropDown.module.scss';
import { SVG } from '../../SVG';
import Button from '../Button';
import Dropdown from '../Dropdown';
import { Board } from '../../store/types';
import { Column } from '../../store/types';

interface ColumnDropDownProps {
	boardId?: Board | string;
	columnId?: Column | string;
	setColumnId: Dispatch<SetStateAction<string | Column>>;
}

function ColumnDropDown(props: ColumnDropDownProps) {
	const { boardId, columnId, setColumnId } = props;
	const columns = useAppSelector((state) => state.columns.columns);
	const boardColumns = columns.filter((column) => column.boardId === boardId);

	console.log(boardColumns, 'boardColumns');
	console.log(boardId, 'boardId');

	return (
		<Dropdown
			className={styles.dropdownBtn}
			placement="bottom-left"
			trigger={
				<Button
					icon={<SVG.chevronDown />}
					disabled={boardId === 'Pick a board' || !boardId}
				>
					{!columnId
						? 'Pick a column'
						: typeof columnId !== 'string'
							? columnId.title
							: columnId}
				</Button>
			}
		>
			{boardColumns?.map((boardCol) => (
				<button
					type="button"
					key={boardCol.title}
					onClick={() => {
						setColumnId(boardCol as Column);
					}}
				>
					{boardCol.title}
				</button>
			))}
		</Dropdown>
	);
}

export default ColumnDropDown;
