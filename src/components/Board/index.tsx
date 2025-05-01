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

function Board(props: HTMLProps<HTMLDivElement>) {
	const { ...rest } = props;

	const dispatch = useAppDispatch();
	const activeBoard = useAppSelector(selectActiveBoard);
	const columns = useAppSelector(selectBoardColumns);
	const boards = useAppSelector((state) => state.boards.boards);

	const boardRef = useRef<HTMLDivElement | null>(null);
	const boardContentRef = useRef<HTMLDivElement>(null);
	const isTouchDevice = useRef(false);

	const handleCardMove = (
		cardId: string,
		sourceColumnId: string,
		targetColumnId: string
	) => {
		dispatch(
			moveCardBetweenColumns({
				cardId,
				sourceColumnId,
				destinationColumnId: targetColumnId,
			})
		);
	};

	const { handleCardMouseDown, handleCardTouchStart, isDragging } =
		useDragAndDrop({
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
			'ontouchstart' in window ||
			navigator.maxTouchPoints > 0 ||
			(navigator as any).msMaxTouchPoints > 0;

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
			col?.cardIds?.includes(cardId)
		)?.id;

		if (sourceColumnId && sourceColumnId !== targetColumnId) {
			handleCardMove(cardId, sourceColumnId, targetColumnId);
		}
	};

	return (
		<Section ref={boardRef} {...rest}>
			<div className={styles.boardHeader}>
				<div className={styles.boardHeaderContent}>
					<h1>{activeBoard?.title}</h1>
					<p>{activeBoard.description}</p>
				</div>
				<div className={styles.boardHeaderActions}>
					<AddTaskModal />
				</div>
			</div>
			<div ref={boardContentRef} className={styles.boardContent}>
				<Container
					{...rest}
					style={{
						gridTemplateColumns: `repeat(${
							columns?.length || 3
						}, minmax(28rem, 1fr))`,
					}}
				>
					{columns &&
						columns?.map((column) => column && (
							<Column
								key={column?.id}
								className={styles.column}
								colId={column?.id}
								colName={column?.title}
								numOfCards={column?.cardIds?.length || 0}
								onCardDrop={handleCardDrop}
							>
								{column?.cardIds?.map((cardId) => {
									return (
										<Card
											key={cardId}
											id={cardId}
											columnId={column.id}
											boardId={column.boardId}
											onMouseDown={(e) =>
												handleCardMouseDown(
													e,
													cardId,
													column.id
												)
											}
											onTouchStart={(e) =>
												handleCardTouchStart(
													e,
													cardId,
													column.id
												)
											}
										/>
									);
								})}
							</Column>
						))}
				</Container>
			</div>
		</Section>
	);
}

export default Board;
