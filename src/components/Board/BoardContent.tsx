import { useRef, useEffect } from 'react';
import styles from './board.module.scss';
import columnStyles from '../Column/column.module.scss';
import Container from '../Container';
import Column from '../Column';
import Card from '../Card';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { useAppDispatch } from '../../store/hooks';
import { moveCardBetweenColumns } from '../../store/thunks';
import { IColumn } from '../../store/types';

interface BoardContentProps {
	column: IColumn;
}

function BoardContent({ column }: BoardContentProps) {
	const dispatch = useAppDispatch();
	const boardContentRef = useRef<HTMLDivElement>(null);

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
		columnContentSelector: `.column-content[data-board-id="${column.boardId}"]`,
	});

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

	// Add this to handle scroll events on the board container
	useEffect(() => {
		const currentRef = boardContentRef.current;

		if (currentRef && isDragging) {
			const handleScroll = () => {
				// This ensures any manual scrolling is captured and card position is updated
				// The useDragAndDrop hook will handle the position adjustments
			};

			currentRef.addEventListener('scroll', handleScroll);

			return () => {
				currentRef.removeEventListener('scroll', handleScroll);
			};
		}
	}, [isDragging]);

	const handleCardDrop = (cardId: string, targetColumnId: string) => {
		const sourceColumnId = column?.columnsList.find((colList) => colList.cardIds?.includes(cardId))?.id;

		if (sourceColumnId && sourceColumnId !== targetColumnId) {
			handleCardMove(cardId, sourceColumnId, targetColumnId);
		}
	};

	return (
		<Container
			style={{
				gridTemplateColumns: `repeat(${column?.columnsList.filter((colList) => colList.isSelected)?.length || 3}, minmax(28rem, 1fr))`,
				overflow: 'auto',
				position: 'relative',
				height: '100%', // Ensure container takes full height to allow scrolling
			}}
			className={styles.boardContent}
			ref={boardContentRef}
			data-board-id={column.boardId}
		>
			{column?.columnsList?.map(
				(col) =>
					col.isSelected && (
						<Column
							key={col?.id + '@' + column?.id}
							className={styles.column}
							colId={col?.id + '@' + column?.id}
							colName={col?.title}
							numOfCards={col?.cardIds?.length || 0}
							onCardDrop={handleCardDrop}
							data-board-id={column.boardId}
						>
							{col?.cardIds?.map((cardId: string) => {
								return (
									<Card
										key={cardId}
										id={cardId}
										columnId={col?.id + '@' + column?.id}
										boardId={column.boardId}
										onMouseDown={(e) => handleCardMouseDown(e, cardId, col.id + '@' + column?.id)}
										onTouchStart={(e) => handleCardTouchStart(e, cardId, col.id + '@' + column?.id)}
									/>
								);
							})}
						</Column>
					)
			)}
		</Container>
	);
}

export default BoardContent;
