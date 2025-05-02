import { useState, useRef, useCallback, useEffect } from 'react';
import { DRAG_CONFIG } from './dragConstants';
import { UseDragAndDropProps, DragState } from './dragTypes';

/**
 * A custom hook that implements drag and drop functionality for cards between columns.
 *
 * The drag and drop process follows a physical card movement metaphor:
 * 1. Initial touch (like placing finger on a card)
 * 2. Movement beyond threshold (like lifting the card)
 * 3. Dragging with visual feedback (like carrying the card over columns)
 * 4. Drop handling (like placing the card in its new location)
 *
 * Features:
 * - Mouse and touch support
 * - Visual feedback during dragging
 * - Directional constraints (forward-only or bidirectional movement)
 * - Boundary constraints with haptic feedback
 * - Auto-scrolling when near container edges
 * - Full keyboard accessibility
 */
export function useDragAndDrop({
	onCardMove,
	dropTargetClassName,
	invalidDropTargetClassName,
	boundaryRef,
	columnContentSelector = '.column-content',
	allowBackwardMovement = false,
	cardSelector = 'data-card-id',
}: UseDragAndDropProps) {
	const [dragState, setDragState] = useState<DragState>({
		draggingCard: null,
		isDragging: false,
	});

	const dragElementRef = useRef<HTMLDivElement | null>(null);
	const dragStartedRef = useRef(false);
	const pointerPositionRef = useRef({ x: 0, y: 0 });
	const currentTargetColumnRef = useRef<string | null>(null);
	const scrollIntervalRef = useRef<number | null>(null);
	const isTouch = useRef(false);

	/**
	 * Creates an accessible announcement for screen readers.
	 *
	 * Accessibility is critical for users who can't see the visual drag operation.
	 * This function updates a visually hidden element with live announcements
	 * that describe what's happening during the drag process.
	 */
	const createAccessibilityAnnouncement = useCallback((message: string) => {
		const announce = document.getElementById('drag-announce');
		if (announce) {
			announce.textContent = message;
		}
	}, []);

	/**
	 * Validates drop targets based on configured movement constraints.
	 *
	 * This implements the business logic of card movement restrictions:
	 * - When allowBackwardMovement is false (default): Cards can only move to columns
	 *   with a higher index (to the right), mimicking a workflow progression
	 * - When allowBackwardMovement is true: Cards can move in any direction
	 *
	 * The function works by comparing the DOM positions of columns to determine
	 * their logical sequence.
	 */
	const isValidDropTarget = useCallback(
		(sourceColumnId: string, targetColumnId: string): boolean => {
			if (!sourceColumnId || !targetColumnId) return false;

			if (allowBackwardMovement) {
				return sourceColumnId !== targetColumnId;
			}

			try {
				const columnsElements =
					document.querySelectorAll('[data-column-id]');
				const columnIds: string[] = [];

				columnsElements.forEach((col) => {
					const colId = col.getAttribute('data-column-id');
					if (colId) columnIds.push(colId);
				});

				const sourceIndex = columnIds.indexOf(sourceColumnId);
				const targetIndex = columnIds.indexOf(targetColumnId);

				return targetIndex > sourceIndex;
			} catch (e) {
				console.error('Error checking drop target validity:', e);
				return false;
			}
		},
		[allowBackwardMovement]
	);

	/**
	 * Performs hit testing to determine which column the card is currently over.
	 *
	 * Uses the center point of the card for more intuitive intersection detection.
	 * This is crucial for determining the visual feedback and eventual drop target.
	 * The algorithm uses bounding rectangle intersection testing to find which column
	 * contains the center point of the dragged card.
	 */
	const findTargetColumn = useCallback(
		(elementRect: DOMRect): string | null => {
			try {
				const centerX = elementRect.left + elementRect.width / 2;
				const centerY = elementRect.top + elementRect.height / 2;

				const columnContents = document.querySelectorAll(
					columnContentSelector
				);
				for (let i = 0; i < columnContents.length; i++) {
					const content = columnContents[i];
					const colRect = content.getBoundingClientRect();

					if (
						centerX >= colRect.left &&
						centerX <= colRect.right &&
						centerY >= colRect.top &&
						centerY <= colRect.bottom
					) {
						// Get the parent column's ID
						const column = content.closest(
							'[data-column-id]'
						) as HTMLElement;
						if (column) {
							return column.getAttribute('data-column-id');
						}
					}
				}

				// Fallback to checking entire columns
				const columnsElements =
					document.querySelectorAll('[data-column-id]');
				for (let i = 0; i < columnsElements.length; i++) {
					const col = columnsElements[i];
					const colRect = col.getBoundingClientRect();

					if (
						centerX >= colRect.left &&
						centerX <= colRect.right &&
						centerY >= colRect.top &&
						centerY <= colRect.bottom
					) {
						return col.getAttribute('data-column-id');
					}
				}

				return null;
			} catch (e) {
				console.error('Error finding target column:', e);
				return null;
			}
		},
		[columnContentSelector]
	);

	/**
	 * Manages visual feedback for columns during dragging.
	 *
	 * This function:
	 * - Clears all previous highlighting from columns
	 * - Determines if the current target column is valid based on movement rules
	 * - Applies appropriate visual feedback classes (valid/invalid)
	 * - Sets ARIA attributes for accessibility
	 *
	 * The visual feedback acts like traffic lights, showing users where
	 * cards can and cannot be dropped before they actually release them.
	 */
	const updateColumnHighlights = useCallback(
		(targetColumnId: string | null, isSourceColumn = false) => {
			try {
				const columnsElements =
					document.querySelectorAll('[data-column-id]');
				columnsElements.forEach((col) => {
					col.classList.remove(dropTargetClassName);
					col.classList.remove(invalidDropTargetClassName);

					const columnContent = col.querySelector(
						columnContentSelector
					);
					if (columnContent) {
						columnContent.classList.remove(dropTargetClassName);
						columnContent.classList.remove(
							invalidDropTargetClassName
						);
					}

					col.setAttribute('aria-dropeffect', 'none');
				});

				if (
					targetColumnId &&
					!isSourceColumn &&
					dragState.draggingCard
				) {
					const targetColumn = document.querySelector(
						`[data-column-id="${targetColumnId}"]`
					);

					if (targetColumn) {
						const isValid = isValidDropTarget(
							dragState.draggingCard.columnId,
							targetColumnId
						);
						const classToAdd = isValid
							? dropTargetClassName
							: invalidDropTargetClassName;

						const columnContent = targetColumn.querySelector(
							columnContentSelector
						);

						if (columnContent) {
							columnContent.classList.add(classToAdd);
						} else {
							targetColumn.classList.add(classToAdd);
						}

						targetColumn.setAttribute(
							'aria-dropeffect',
							isValid ? 'move' : 'none'
						);
					}
				}
			} catch (e) {
				console.error('Error updating column highlights:', e);
			}
		},
		[
			dropTargetClassName,
			invalidDropTargetClassName,
			isValidDropTarget,
			dragState.draggingCard,
			columnContentSelector,
		]
	);

	/**
	 * Creates a visual clone of the card for dragging.
	 *
	 * This function creates the illusion that the user is actually moving the card
	 * by creating a "ghost" copy that follows the pointer. Meanwhile, the original
	 * card stays in place but with a visual style indicating it's being moved.
	 *
	 * The clone is absolutely positioned, has pointer events disabled, and includes
	 * a subtle rotation to enhance the "picked up" effect.
	 */
	const createDragClone = useCallback(
		(cardElement: HTMLElement, rect: DOMRect) => {
			try {
				const clone = cardElement.cloneNode(true) as HTMLDivElement;

				clone.style.position = 'absolute';
				clone.style.width = `${rect.width}px`;
				clone.style.height = `${rect.height}px`;
				clone.style.zIndex = DRAG_CONFIG.VISUAL.Z_INDEX;
				clone.style.pointerEvents = 'none';
				clone.style.opacity = '1';
				clone.style.transform = DRAG_CONFIG.VISUAL.ROTATION;
				clone.style.transition =
					'box-shadow 0.2s ease, border 0.2s ease';
				clone.setAttribute('aria-hidden', 'true');
				clone.style.cursor = DRAG_CONFIG.VISUAL.CURSOR;
				// document.body.style.cursor = DRAG_CONFIG.VISUAL.CURSOR;

				clone.style.left = `${rect.left}px`;
				clone.style.top = `${rect.top}px`;

				document.body.appendChild(clone);

				cardElement.style.opacity = DRAG_CONFIG.VISUAL.OPACITY;
				// cardElement.style.backgroundColor =
				// 	DRAG_CONFIG.VISUAL.BACKGROUND;
				cardElement.style.border = DRAG_CONFIG.VISUAL.BORDER;

				return clone;
			} catch (e) {
				console.error('Error creating drag clone:', e);
				return null;
			}
		},
		[]
	);

	/**
	 * Implements automatic scrolling when dragging near container edges.
	 *
	 * This creates a smooth scrolling experience when dragging cards beyond
	 * the visible area. When the card approaches any edge of the container,
	 * the container scrolls in that direction at a steady rate, allowing
	 * users to drag cards to areas that were initially off-screen.
	 *
	 * Uses intervals rather than per-frame updates for better performance.
	 */
	const setupAutoScrolling = useCallback(() => {
		if (!boundaryRef?.current || scrollIntervalRef.current !== null) return;

		scrollIntervalRef.current = window.setInterval(() => {
			if (!boundaryRef?.current || !dragElementRef.current) return;

			const boundary = boundaryRef.current.getBoundingClientRect();
			const cardRect = dragElementRef.current.getBoundingClientRect();
			const cardCenterY = cardRect.top + cardRect.height / 2;
			const cardCenterX = cardRect.left + cardRect.width / 2;
			const margin = DRAG_CONFIG.SCROLL.MARGIN;
			const speed = DRAG_CONFIG.SCROLL.SPEED;

			// Vertical scrolling
			if (
				boundaryRef.current.scrollHeight >
				boundaryRef.current.clientHeight
			) {
				if (cardCenterY > boundary.bottom - margin) {
					boundaryRef.current.scrollTop += speed;
				}

				if (cardCenterY < boundary.top + margin) {
					boundaryRef.current.scrollTop -= speed;
				}
			}

			// Horizontal scrolling
			if (
				boundaryRef.current.scrollWidth >
				boundaryRef.current.clientWidth
			) {
				if (cardCenterX > boundary.right - margin) {
					boundaryRef.current.scrollLeft += speed;
				}

				if (cardCenterX < boundary.left + margin) {
					boundaryRef.current.scrollLeft -= speed;
				}
			}
		}, DRAG_CONFIG.SCROLL.INTERVAL);
	}, [boundaryRef]);

	/**
	 * Enforces boundary constraints and provides boundary feedback.
	 *
	 * This prevents cards from being dragged outside the container boundaries.
	 * When a card hits a boundary:
	 * 1. The position is constrained to stay within the boundary
	 * 2. Visual feedback (glowing border) is applied to indicate the constraint
	 * 3. On touch devices, haptic feedback (vibration) is triggered
	 *
	 * These feedback mechanisms ensure users understand why card movement is limited.
	 */
	const applyBoundaryConstraints = useCallback(
		(position: { left: number; top: number }, cardRect: DOMRect) => {
			if (!boundaryRef?.current || !dragElementRef.current) {
				return position;
			}

			const boundary = boundaryRef.current.getBoundingClientRect();
			let { left, top } = position;
			let hitBoundary = false;

			dragElementRef.current.style.boxShadow = '';

			if (left < boundary.left) {
				left = boundary.left;
				hitBoundary = true;
			}

			if (left + cardRect.width > boundary.right) {
				left = boundary.right - cardRect.width;
				hitBoundary = true;
			}

			if (top < boundary.top) {
				top = boundary.top;
				hitBoundary = true;
			}

			if (top + cardRect.height > boundary.bottom) {
				top = boundary.bottom - cardRect.height;
				hitBoundary = true;
			}

			if (hitBoundary) {
				dragElementRef.current.style.boxShadow = '';
				dragElementRef.current.style.border =
					DRAG_CONFIG.VISUAL.BOUNDARY_FEEDBACK_BORDER;

				if (isTouch.current && navigator.vibrate) {
					navigator.vibrate(10);
				}
			}

			return { left, top };
		},
		[boundaryRef]
	);

	/**
	 * Comprehensive cleanup function that resets all drag state.
	 *
	 * This function handles all aspects of returning the UI to its pre-drag state:
	 * - Clears scroll intervals
	 * - Removes the drag clone element
	 * - Resets styles on the original card
	 * - Clears column highlights
	 * - Resets all state variables and refs
	 * - Clears any accessibility announcements
	 *
	 * It's the single point of responsibility for cleanup, making it easier
	 * to ensure nothing is missed, regardless of how the drag operation ends.
	 */
	const cleanupDrag = useCallback(() => {
		if (scrollIntervalRef.current !== null) {
			window.clearInterval(scrollIntervalRef.current);
			scrollIntervalRef.current = null;
		}

		// Reset the body cursor back to default
		document.body.style.cursor = '';

		if (dragElementRef.current) {
			try {
				// Reset border and shadow before removing
				dragElementRef.current.style.border = '';
				dragElementRef.current.style.boxShadow = '';

				document.body.removeChild(dragElementRef.current);
			} catch (e) {
				console.error('Error removing drag element:', e);
			}
			dragElementRef.current = null;
		}

		try {
			if (dragState.draggingCard) {
				const originalCards = document.querySelectorAll(
					`[${cardSelector}="${dragState.draggingCard.id}"]`
				);
				originalCards.forEach((card) => {
					const cardElement = card as HTMLElement;
					cardElement.style.opacity = '';
					cardElement.style.backgroundColor = '';
					cardElement.style.border = '';
					cardElement.style.transform = '';
					cardElement.removeAttribute('aria-grabbed');
				});
			}
		} catch (e) {
			console.error('Error resetting card styles:', e);
		}

		updateColumnHighlights(null);
		createAccessibilityAnnouncement('');

		dragStartedRef.current = false;
		currentTargetColumnRef.current = null;
		setDragState({ draggingCard: null, isDragging: false });
	}, [
		dragState.draggingCard,
		updateColumnHighlights,
		createAccessibilityAnnouncement,
		cardSelector,
	]);

	/**
	 * Initiates the card dragging process on pointer down.
	 *
	 * This unified handler works for both mouse and touch events and:
	 * 1. Determines the interaction type (mouse or touch)
	 * 2. Captures initial position and card metadata
	 * 3. Sets appropriate ARIA attributes for accessibility
	 * 4. Initializes the drag state
	 *
	 * The drag doesn't actually start until the pointer moves beyond
	 * a threshold distance, which helps distinguish between clicks and drags.
	 */
	const handleCardPointerDown = useCallback(
		(
			e: React.MouseEvent | React.TouchEvent,
			cardId: string,
			cardColId: string
		) => {
			try {
				isTouch.current = 'touches' in e;

				if (!isTouch.current && (e as React.MouseEvent).button !== 0)
					return;

				const cardElement = e.currentTarget as HTMLDivElement;
				const rect = cardElement.getBoundingClientRect();

				const clientX = isTouch.current
					? (e as React.TouchEvent).touches[0].clientX
					: (e as React.MouseEvent).clientX;

				const clientY = isTouch.current
					? (e as React.TouchEvent).touches[0].clientY
					: (e as React.MouseEvent).clientY;

				pointerPositionRef.current = { x: clientX, y: clientY };
				dragStartedRef.current = false;
				currentTargetColumnRef.current = cardColId || null;

				cardElement.setAttribute('aria-grabbed', 'true');
				updateColumnHighlights(null);

				setDragState({
					draggingCard: {
						id: cardId,
						columnId: cardColId,
						initialX: clientX,
						initialY: clientY,
						offsetX: clientX - rect.left,
						offsetY: clientY - rect.top,
					},
					isDragging: false,
				});

				e.preventDefault();
			} catch (e) {
				console.error('Error in pointer down handler:', e);
			}
		},
		[updateColumnHighlights]
	);

	/**
	 * Core dragging logic that handles pointer movement.
	 *
	 * This complex function handles:
	 * 1. Detecting when movement exceeds the drag threshold
	 * 2. Creating the drag clone on first significant movement
	 * 3. Setting up auto-scrolling
	 * 4. Continuously updating the clone's position to follow the pointer
	 * 5. Enforcing boundary constraints with visual feedback
	 * 6. Updating column highlights based on current position
	 * 7. Handling errors with graceful degradation
	 *
	 * This function runs continuously during the drag operation, so it's
	 * optimized to minimize unnecessary work.
	 */
	const handlePointerMove = useCallback(
		(e: MouseEvent | TouchEvent) => {
			const { draggingCard } = dragState;
			if (!draggingCard) return;

			try {
				const clientX =
					'touches' in e
						? e.touches[0].clientX
						: (e as MouseEvent).clientX;

				const clientY =
					'touches' in e
						? e.touches[0].clientY
						: (e as MouseEvent).clientY;

				const dx = Math.abs(clientX - pointerPositionRef.current.x);
				const dy = Math.abs(clientY - pointerPositionRef.current.y);

				const isDragging =
					dx > DRAG_CONFIG.THRESHOLD || dy > DRAG_CONFIG.THRESHOLD;

				if (isDragging && !dragStartedRef.current) {
					dragStartedRef.current = true;
					setDragState((prev) => ({ ...prev, isDragging: true }));

					const cardElement = document.querySelector(
						`[${cardSelector}="${draggingCard.id}"]`
					) as HTMLElement;

					if (!cardElement) {
						console.error('Card element not found for dragging');
						return;
					}

					const rect = cardElement.getBoundingClientRect();
					const clone = createDragClone(cardElement, rect);
					if (!clone) return;

					dragElementRef.current = clone;
					setupAutoScrolling();

					createAccessibilityAnnouncement(
						`Card "${draggingCard.id}" is being dragged. Press Escape to cancel, Enter to drop.`
					);
				}

				if (dragStartedRef.current && dragElementRef.current) {
					const newLeft = clientX - draggingCard.offsetX;
					const newTop = clientY - draggingCard.offsetY;

					const cardRect =
						dragElementRef.current.getBoundingClientRect();
					const constrainedPosition = applyBoundaryConstraints(
						{ left: newLeft, top: newTop },
						cardRect
					);

					dragElementRef.current.style.left = `${constrainedPosition.left}px`;
					dragElementRef.current.style.top = `${constrainedPosition.top}px`;

					const dragRect =
						dragElementRef.current.getBoundingClientRect();
					const targetColumnId = findTargetColumn(dragRect);
					const isSourceColumn =
						targetColumnId === draggingCard.columnId;

					currentTargetColumnRef.current = targetColumnId;
					updateColumnHighlights(targetColumnId, isSourceColumn);

					if (targetColumnId && !isSourceColumn) {
						const isValid = isValidDropTarget(
							draggingCard.columnId,
							targetColumnId
						);

						if (isValid) {
							dragElementRef.current.style.border =
								'2px solid rgba(50, 205, 50, 0.8)';
							dragElementRef.current.style.boxShadow =
								'0 0 8px rgba(50, 205, 50, 0.6)';
						} else {
							dragElementRef.current.style.border =
								'2px solid rgba(255, 99, 71, 0.8)';
							dragElementRef.current.style.boxShadow =
								'0 0 8px rgba(255, 99, 71, 0.6)';
						}
					} else {
						// Reset card appearance when not over a valid target
						dragElementRef.current.style.border = '1px solid #ccc';
						dragElementRef.current.style.boxShadow =
							'0 2px 4px rgba(0,0,0,0.1)';
					}
				}
			} catch (err) {
				console.error('Error in pointer move handler:', err);
				cleanupDrag();
			}
		},
		[
			dragState,
			cardSelector,
			updateColumnHighlights,
			findTargetColumn,
			applyBoundaryConstraints,
			cleanupDrag,
			createDragClone,
			setupAutoScrolling,
			createAccessibilityAnnouncement,
			isValidDropTarget,
		]
	);

	/**
	 * Finalizes the drag operation when the pointer is released.
	 *
	 * This function is responsible for:
	 * 1. Determining if an actual drag occurred (vs. just a click)
	 * 2. Checking if the drop target is valid based on movement rules
	 * 3. Executing the card move callback when appropriate
	 * 4. Cleaning up all visual effects and state
	 *
	 * It's the culmination of the drag workflow, where the card either
	 * "sticks" to its new location or returns to its starting position.
	 */
	const handlePointerUp = useCallback(
		(e: MouseEvent | TouchEvent) => {
			const { draggingCard } = dragState;
			if (!draggingCard) return;

			try {
				// If drag hasn't really started, treat as click
				if (!dragStartedRef.current) {
					cleanupDrag();
					return;
				}

				const targetColumnId = currentTargetColumnRef.current;

				// Check if we have a valid drop target
				if (
					targetColumnId &&
					targetColumnId !== draggingCard.columnId &&
					isValidDropTarget(draggingCard.columnId, targetColumnId)
				) {
					// This is critical - make a copy of the values for the callback
					const cardId = draggingCard.id;
					const sourceColumnId = draggingCard.columnId;

					// Announce the drop for accessibility
					createAccessibilityAnnouncement(
						`Card moved to ${targetColumnId} column.`
					);

					onCardMove(cardId, sourceColumnId, targetColumnId);
				}

				cleanupDrag();

				if (e.cancelable) {
					e.preventDefault();
				}
			} catch (err) {
				console.error('Error in pointer up handler:', err);
				cleanupDrag();
			}
		},
		[
			dragState,
			onCardMove,
			isValidDropTarget,
			cleanupDrag,
			createAccessibilityAnnouncement,
		]
	);

	/**
	 * Enables keyboard control for accessibility.
	 *
	 * This function provides keyboard equivalents to mouse/touch actions:
	 * - Escape key: Cancels dragging (like abruptly dropping the card)
	 * - Enter/Space keys: Confirms drop (like deliberately releasing the card)
	 *
	 * These keyboard controls are essential for users who navigate with
	 * keyboards or other assistive technologies instead of pointer devices.
	 */
	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			const { draggingCard } = dragState;
			if (!draggingCard || !dragElementRef.current) return;

			try {
				if (e.key === 'Escape') {
					cleanupDrag();
					return;
				}

				if (e.key === 'Enter' || e.key === ' ') {
					const targetColumnId = currentTargetColumnRef.current;

					if (
						targetColumnId &&
						targetColumnId !== draggingCard.columnId &&
						isValidDropTarget(draggingCard.columnId, targetColumnId)
					) {
						onCardMove(
							draggingCard.id,
							draggingCard.columnId,
							targetColumnId
						);
					}

					cleanupDrag();
					e.preventDefault();
				}
			} catch (err) {
				console.error('Error in key handler:', err);
				cleanupDrag();
			}
		},
		[dragState, cleanupDrag, onCardMove, isValidDropTarget]
	);

	/**
	 * Manages event listeners based on drag state.
	 *
	 * This effect:
	 * 1. Adds appropriate event listeners when dragging starts (mouse/touch/keyboard)
	 * 2. Removes them when dragging ends or component unmounts
	 * 3. Differentiates between touch and mouse events
	 * 4. Adds a safety cleanup for when window loses focus
	 *
	 * Using event delegation at the window level allows tracking pointer movement
	 * even when it leaves the original card's boundaries.
	 */
	useEffect(() => {
		const { draggingCard } = dragState;
		if (draggingCard) {
			if (isTouch.current) {
				window.addEventListener(
					'touchmove',
					handlePointerMove as EventListener
				);
				window.addEventListener(
					'touchend',
					handlePointerUp as EventListener
				);
				window.addEventListener(
					'touchcancel',
					handlePointerUp as EventListener
				);
			} else {
				window.addEventListener(
					'mousemove',
					handlePointerMove as EventListener
				);
				window.addEventListener(
					'mouseup',
					handlePointerUp as EventListener
				);
			}

			window.addEventListener('keydown', handleKeyDown);
			window.addEventListener('blur', cleanupDrag);
		}

		return () => {
			window.removeEventListener(
				'mousemove',
				handlePointerMove as EventListener
			);
			window.removeEventListener(
				'mouseup',
				handlePointerUp as EventListener
			);
			window.removeEventListener(
				'touchmove',
				handlePointerMove as EventListener
			);
			window.removeEventListener(
				'touchend',
				handlePointerUp as EventListener
			);
			window.removeEventListener(
				'touchcancel',
				handlePointerUp as EventListener
			);
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('blur', cleanupDrag);

			if (scrollIntervalRef.current !== null) {
				window.clearInterval(scrollIntervalRef.current);
				scrollIntervalRef.current = null;
			}
		};
	}, [
		dragState,
		handlePointerMove,
		handlePointerUp,
		handleKeyDown,
		cleanupDrag,
	]);

	/**
	 * Sets up accessibility support by creating an announcement element.
	 *
	 * This creates a visually hidden element that screen readers can access
	 * to announce changes during the drag operation. It's a crucial component
	 * for making the drag and drop interaction accessible to all users.
	 *
	 * The element is cleaned up when it's no longer needed to avoid DOM pollution.
	 */
	useEffect(() => {
		if (!document.getElementById('drag-announce')) {
			const announceElement = document.createElement('div');
			announceElement.id = 'drag-announce';
			announceElement.setAttribute('role', 'status');
			announceElement.setAttribute('aria-live', 'polite');

			announceElement.style.position = 'absolute';
			announceElement.style.width = '1px';
			announceElement.style.height = '1px';
			announceElement.style.padding = '0';
			announceElement.style.margin = '-1px';
			announceElement.style.overflow = 'hidden';
			announceElement.style.clip = 'rect(0, 0, 0, 0)';
			announceElement.style.whiteSpace = 'nowrap';
			announceElement.style.border = '0';

			document.body.appendChild(announceElement);
		}

		return () => {
			const announceElement = document.getElementById('drag-announce');
			if (
				announceElement &&
				!document.querySelector("[aria-grabbed='true']")
			) {
				announceElement.remove();
			}
		};
	}, []);

	return {
		handleCardMouseDown: handleCardPointerDown,
		handleCardTouchStart: handleCardPointerDown,
		isDragging: dragState.isDragging,
	};
}
