import { HTMLProps, useEffect } from 'react';
import styles from './board.module.scss';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectActiveBoard, selectBoardColumns } from '../../store/selectors';
import { setActiveBoard } from '../../store/features/boards/boardSlice';
import Section from '../Section';
import Accordion from '../Accordion';
import BoardContent from './BoardContent';

function Board(props: HTMLProps<HTMLDivElement>) {
	const { ...rest } = props;

	const dispatch = useAppDispatch();
	const activeBoard = useAppSelector(selectActiveBoard);
	const columns = useAppSelector(selectBoardColumns);
	const boards = useAppSelector((state) => state.boards.boards);

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
			{columns &&
				columns?.map(
					(column) =>
						column && (
							<Accordion key={column?.id}>
								<Accordion.Header headingText={column?.title} />
								<Accordion.Body>
									<BoardContent column={column} />
								</Accordion.Body>
							</Accordion>
						)
				)}
		</Section>
	);
}

export default Board;
