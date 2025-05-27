import { HTMLProps, useEffect } from 'react';
import styles from './board.module.scss';
import AddTaskModal from '../Modal/addTaskModal';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectActiveBoard, selectBoardColumns } from '../../store/selectors';
import { setActiveBoard } from '../../store/features/boards/boardSlice';
import Section from '../Section';
import Accordion from '../Accordion';
import BoardContent from './BoardContent';
import { IColumn } from '../../store/types';
import { useLocation } from 'react-router';

function Board(props: HTMLProps<HTMLDivElement>) {
	const { ...rest } = props;

	const pathname = useLocation().pathname;

	console.log(pathname, 'pathname');

	const dispatch = useAppDispatch();
	const activeBoard = useAppSelector(selectActiveBoard);
	const columns = useAppSelector(selectBoardColumns);
	const boards = useAppSelector((state) => state.boards.boards);

	console.log(activeBoard, 'activeBoard');

	useEffect(() => {
		if (!activeBoard && boards.length > 0) {
			dispatch(setActiveBoard(boards[0].id));
		}
	}, [dispatch, activeBoard, boards]);

	useEffect(() => {
		const isTouchDevice =
			'ontouchstart' in window || navigator.maxTouchPoints > 0 || (navigator as any).msMaxTouchPoints > 0;

		if (isTouchDevice) {
			document.body.classList.add('touch-device');
		}

		return () => {
			document.body.classList.remove('touch-device');
		};
	}, []);

	if (!activeBoard) {
		return (
			<div className={styles.emptyState}>
				<h2>No boards available</h2>
			</div>
		);
	}

	return (
		<Section {...rest}>
			<div className={styles.boardHeader}>
				<div className={styles.boardHeaderContent}>
					<h1>{activeBoard?.title}</h1>
					<p>{activeBoard.description}</p>
				</div>
				<div className={styles.boardHeaderActions}>
					<AddTaskModal />
				</div>
			</div>
			{columns &&
				columns?.map(
					(column: IColumn) =>
						column && (
							<div key={column?.id} className={styles.columnContainer}>
								<Accordion>
									<Accordion.Header headingText={column?.title} />
									<Accordion.Body>
										<BoardContent column={column} />
									</Accordion.Body>
								</Accordion>
							</div>
						)
				)}
		</Section>
	);
}

export default Board;
