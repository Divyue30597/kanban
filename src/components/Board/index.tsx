import { HTMLProps, useRef, useEffect } from 'react';
import styles from './board.module.scss';
import columnStyles from '../Column/column.module.scss';
import Container from '../Container';
import AddTaskModal from '../Modal/addTaskModal';
import Column from '../Column';
import Card from '../Card';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectActiveBoard, selectBoardColumns } from '../../store/selectors';
import { setActiveBoard } from '../../store/features/boards/boardSlice';
import { moveCardBetweenColumns } from '../../store/thunks';
import Section from '../Section';
import Accordion from '../Accordion';

function Board(props: HTMLProps<HTMLDivElement>) {
	const { ...rest } = props;

	const dispatch = useAppDispatch();
	const activeBoard = useAppSelector(selectActiveBoard);
	const columns = useAppSelector(selectBoardColumns);
	const boards = useAppSelector((state) => state.boards.boards);

	const boardContentRef = useRef<HTMLDivElement>(null);
	const isTouchDevice = useRef(false);

	const handleCardMove = (cardId: string, sourceColumnId: string, targetColumnId: string) => {
		dispatch(
			moveCardBetweenColumns({
				cardId,
				sourceColumnId,
				destinationColumnId: targetColumnId,
			})
		);
	};

	const { handleCardMouseDown, handleCardTouchStart, isDragging } = useDragAndDrop({
		onCardMove: handleCardMove,
		dropTargetClassName: columnStyles.validDropTarget,
		invalidDropTargetClassName: columnStyles.invalidDropTarget,
		boundaryRef: boardContentRef,
	});

	useEffect(() => {
		if (!activeBoard && boards.length > 0) {
			dispatch(setActiveBoard(boards[0].id));
		}
	}, [dispatch, activeBoard, boards]);

	useEffect(() => {
		isTouchDevice.current =
			'ontouchstart' in window || navigator.maxTouchPoints > 0 || (navigator as any).msMaxTouchPoints > 0;

		if (isTouchDevice.current) {
			document.body.classList.add('touch-device');
		}

		return () => {
			document.body.classList.remove('touch-device');
		};
	}, []);

	useEffect(() => {
		const preventDefaultTouchMove = (e: TouchEvent) => {
			if (isDragging) {
				e.preventDefault();
			}
		};

		document.addEventListener('touchmove', preventDefaultTouchMove, {
			passive: false,
		});

		return () => {
			document.removeEventListener('touchmove', preventDefaultTouchMove);
		};
	}, [isDragging]);

	if (!activeBoard) {
		return (
			<div className={styles.emptyState}>
				<h2>No boards available</h2>
			</div>
		);
	}

	const handleCardDrop = (cardId: string, targetColumnId: string) => {
		const sourceColumnId = columns.find((col) =>
			col?.columnsList.find((colList) => colList.cardIds?.includes(cardId))
		)?.id;

		if (sourceColumnId && sourceColumnId !== targetColumnId) {
			handleCardMove(cardId, sourceColumnId, targetColumnId);
		}
	};

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
			<div ref={boardContentRef}>
				{columns &&
					columns?.map(
						(column) =>
							column && (
								<div key={column?.id} className={styles.columnContainer}>
									<Accordion>
										<Accordion.Header headingText={column?.title} />
										<Accordion.Body>
											<Container
												style={{
													gridTemplateColumns: `repeat(${column?.columnsList.filter((colList) => colList.isSelected)?.length || 3}, minmax(28rem, 1fr))`,
												}}
												className={styles.boardContent}
											>
												{column?.columnsList?.map(
													(col) =>
														col.isSelected && (
															<Column
																key={col?.id}
																className={styles.column}
																colId={col?.id}
																colName={col?.title}
																numOfCards={col?.cardIds?.length || 0}
																onCardDrop={handleCardDrop}
															>
																{col?.cardIds?.map((cardId) => {
																	return (
																		<Card
																			key={cardId}
																			id={cardId}
																			columnId={col.id}
																			boardId={column.boardId}
																			onMouseDown={(e) => handleCardMouseDown(e, cardId, col.id)}
																			onTouchStart={(e) => handleCardTouchStart(e, cardId, col.id)}
																		/>
																	);
																})}
															</Column>
														)
												)}
											</Container>
										</Accordion.Body>
									</Accordion>
								</div>
							)
					)}
			</div>
		</Section>
	);
}

export default Board;
