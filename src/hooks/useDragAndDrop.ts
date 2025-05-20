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

	// Add these scroll position refs
	const prevScrollTopRef = useRef(0);
	const prevScrollLeftRef = useRef(0);

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

	// Add a ref to store the last highlight update timestamp for debouncing
	const lastHighlightUpdateRef = useRef(0);
	// Cache column data to prevent excessive DOM queries
	const columnCacheRef = useRef<{ boardId: string | null; columns: { id: string; rect: DOMRect }[] }>({
		boardId: null,
		columns: [],
	});

	/**
	 * Validates drop targets based on configured movement constraints.
	 */
	const isValidDropTarget = useCallback(
		(sourceColumnId: string, targetColumnId: string): boolean => {
			if (!sourceColumnId || !targetColumnId) return false;

			if (allowBackwardMovement) {
				return sourceColumnId !== targetColumnId;
			}

			try {
				// Use cached column order when possible to prevent DOM thrashing
				const boardId = boardContextId.current;
				let columnIds: string[] = [];

				// Only rebuild the cache if the board ID has changed
				if (columnCacheRef.current.boardId !== boardId) {
					const columnsElements = document.querySelectorAll(
						`[data-column-id][data-board-id="${boardId}"]:not([aria-hidden="true"])`
					);

					columnsElements.forEach((col) => {
						// Only include columns that are actually visible
						if (isElementVisible(col as HTMLElement)) {
							const colId = col.getAttribute('data-column-id');
							if (colId) columnIds.push(colId);
						}
					});

					// Update cache
					columnCacheRef.current = {
						boardId,
						columns: columnIds.map((id) => ({
							id,
							rect: document.querySelector(`[data-column-id="${id}"]`)?.getBoundingClientRect() || new DOMRect(),
						})),
					};
				} else {
					// Use cached column IDs
					columnIds = columnCacheRef.current.columns.map((col) => col.id);
				}

				const sourceIndex = columnIds.indexOf(sourceColumnId);
				const targetIndex = columnIds.indexOf(targetColumnId);

				// If we can't find one of the columns in the visible set,
				// the validation should fail
				if (sourceIndex === -1 || targetIndex === -1) return false;

				return targetIndex > sourceIndex;
			} catch (e) {
				console.error('Error checking drop target validity:', e);
				return false;
			}
		},
		[allowBackwardMovement]
	);

	// Helper function to check if an element is actually visible
	const isElementVisible = (element: HTMLElement): boolean => {
		if (!element) return false;

		try {
			// Check if element or any parent is hidden
			let currentElement: HTMLElement | null = element;
			while (currentElement) {
				// Check various visibility conditions
				const styles = window.getComputedStyle(currentElement);
				if (
					styles.display === 'none' ||
					styles.visibility === 'hidden' ||
					parseFloat(styles.opacity) < 0.1 ||
					currentElement.getAttribute('aria-hidden') === 'true'
				) {
					return false;
				}

				// Check if element has zero dimensions (often means it's collapsed)
				if (currentElement.offsetWidth < 5 || currentElement.offsetHeight < 5) {
					return false;
				}

				currentElement = currentElement.parentElement;
			}

			// Additional check: is the element in the viewport?
			const rect = element.getBoundingClientRect();
			return rect.width > 0 && rect.height > 0;
		} catch (e) {
			console.error('Error checking element visibility:', e);
			return false;
		}
	};

	/**
	 * Performs hit testing to determine which column the card is currently over.
	 */
	const findTargetColumn = useCallback(
		(elementRect: DOMRect): string | null => {
			try {
				const centerX = elementRect.left + elementRect.width / 2;
				const centerY = elementRect.top + elementRect.height / 2;

				// Only check visible columns within the same board
				const boardId = boardContextId.current;
				const columnContents = document.querySelectorAll(`${columnContentSelector}[data-board-id="${boardId}"]`);

				// Debug column detection
				console.log(`Finding target column for board ${boardId}. Found ${columnContents.length} columns.`);

				// Check all column contents first with a slightly expanded hit area
				for (let i = 0; i < columnContents.length; i++) {
					const content = columnContents[i] as HTMLElement;

					// Skip hidden columns
					if (!isElementVisible(content)) continue;

					const colRect = content.getBoundingClientRect();

					// Add a small buffer (5px) to improve detection at edges
					if (
						centerX >= colRect.left - 5 &&
						centerX <= colRect.right + 5 &&
						centerY >= colRect.top - 5 &&
						centerY <= colRect.bottom + 5
					) {
						// Get the parent column's ID
						const column = content.closest('[data-column-id]') as HTMLElement;
						if (column) {
							const colId = column.getAttribute('data-column-id');
							console.log(`Found target column: ${colId} at index ${i}`);
							return colId;
						}
					}
				}

				// Fallback with more detailed logging
				console.log('No column found using primary method, trying fallback...');
				const columnsElements = document.querySelectorAll(`[data-column-id][data-board-id="${boardId}"]`);
				console.log(`Fallback found ${columnsElements.length} column elements`);

				for (let i = 0; i < columnsElements.length; i++) {
					const col = columnsElements[i] as HTMLElement;
					if (!isElementVisible(col)) {
						console.log(`Column at index ${i} is not visible, skipping`);
						continue;
					}

					const colRect = col.getBoundingClientRect();
					console.log(`Column ${i} rect:`, `left: ${colRect.left}`, `right: ${colRect.right}`, `center X: ${centerX}`);

					// Also use expanded hit area here
					if (
						centerX >= colRect.left - 5 &&
						centerX <= colRect.right + 5 &&
						centerY >= colRect.top - 5 &&
						centerY <= colRect.bottom + 5
					) {
						const colId = col.getAttribute('data-column-id');
						console.log(`Found target column with fallback: ${colId}`);
						return colId;
					}
				}

				console.log('No column found, pointer position:', centerX, centerY);
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
				// Debounce highlight updates to prevent flashing
				const now = Date.now();
				if (now - lastHighlightUpdateRef.current < 50) {
					return;
				}
				lastHighlightUpdateRef.current = now;

				// Get only columns from the current board context

				// First, reset any previous highlighting from all columns
				const allColumns = document.querySelectorAll('[data-column-id]');
				allColumns.forEach((col) => {
					col.classList.remove(dropTargetClassName);
					col.classList.remove(invalidDropTargetClassName);

					const columnContent = col.querySelector(columnContentSelector);
					if (columnContent) {
						columnContent.classList.remove(dropTargetClassName);
						columnContent.classList.remove(invalidDropTargetClassName);
					}

					col.setAttribute('aria-dropeffect', 'none');
				});

				// Only proceed with highlighting if we have a target
				if (!targetColumnId || isSourceColumn || !dragState.draggingCard) return;

				// Try to find the target column directly
				const targetColumn = document.querySelector(`[data-column-id="${targetColumnId}"]`);

				if (!targetColumn) {
					console.warn(`Target column ${targetColumnId} not found for highlighting`);
					return;
				}

				// Verify it's visible before highlighting
				if (isElementVisible(targetColumn as HTMLElement)) {
					const isValid = isValidDropTarget(dragState.draggingCard.columnId, targetColumnId);
					const classToAdd = isValid ? dropTargetClassName : invalidDropTargetClassName;

					console.log(`Highlighting column ${targetColumnId} as ${isValid ? 'valid' : 'invalid'} target`);

					// Add highlight to either content or the column itself
					const columnContent = targetColumn.querySelector(columnContentSelector);
					if (columnContent) {
						columnContent.classList.add(classToAdd);
					} else {
						targetColumn.classList.add(classToAdd);
					}

					targetColumn.setAttribute('aria-dropeffect', isValid ? 'move' : 'none');
				}
			} catch (e) {
				console.error('Error updating column highlights:', e);
			}
		},
		[dropTargetClassName, invalidDropTargetClassName, isValidDropTarget, dragState.draggingCard, columnContentSelector]
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
				// clone.style.height = `${rect.height}px`;
				clone.style.zIndex = DRAG_CONFIG.VISUAL.Z_INDEX;
				clone.style.pointerEvents = 'none';
				clone.style.opacity = '1';
				clone.style.transform = DRAG_CONFIG.VISUAL.ROTATION;
				clone.style.boxShadow = 'var(--box-shadow)';
				clone.style.transition = 'box-shadow 0.2s ease, border 0.2s ease';
				clone.setAttribute('aria-hidden', 'true');
				clone.style.cursor = DRAG_CONFIG.VISUAL.CURSOR;

				// Position relative to the container instead of the viewport
				if (boundaryRef?.current) {
					const boundaryRect = boundaryRef.current.getBoundingClientRect();
					clone.style.left = `${rect.left - boundaryRect.left + boundaryRef.current.scrollLeft}px`;
					clone.style.top = `${rect.top - boundaryRect.top + boundaryRef.current.scrollTop}px`;

					// Critical change: Append to boundary element instead of document.body
					boundaryRef.current.appendChild(clone);
				} else {
					clone.style.left = `${rect.left}px`;
					clone.style.top = `${rect.top}px`;
					document.body.appendChild(clone);
				}

				cardElement.style.opacity = DRAG_CONFIG.VISUAL.OPACITY;
				cardElement.style.border = DRAG_CONFIG.VISUAL.BORDER;

				return clone;
			} catch (e) {
				console.error('Error creating drag clone:', e);
				return null;
			}
		},
		[boundaryRef]
	);

	// Add a board context ID to track which board is active for this drag
	const boardContextId = useRef<string | null>(null);

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

				// Remove from parent instead of assuming document.body
				const parent = dragElementRef.current.parentNode;
				if (parent) {
					parent.removeChild(dragElementRef.current);
				}
			} catch (e) {
				console.error('Error removing drag element:', e);
			}
			dragElementRef.current = null;
		}

		try {
			if (dragState.draggingCard) {
				const originalCards = document.querySelectorAll(`[${cardSelector}="${dragState.draggingCard.id}"]`);
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
		boardContextId.current = null;
		setDragState({ draggingCard: null, isDragging: false });
	}, [dragState.draggingCard, updateColumnHighlights, createAccessibilityAnnouncement, cardSelector]);

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
		(e: React.MouseEvent | React.TouchEvent, cardId: string, cardColId: string) => {
			try {
				isTouch.current = 'touches' in e;

				if (!isTouch.current && (e as React.MouseEvent).button !== 0) return;

				const cardElement = e.currentTarget as HTMLDivElement;
				const rect = cardElement.getBoundingClientRect();

				const clientX = isTouch.current ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;

				const clientY = isTouch.current ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;

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

				// Reset column cache to ensure fresh column detection
				columnCacheRef.current = {
					boardId: null,
					columns: [],
				};

				// Set the board context based on the card's data attribute
				const boardId = cardElement.getAttribute('data-board-id');
				boardContextId.current = boardId;

				e.preventDefault();
			} catch (e) {
				console.error('Error in pointer down handler:', e);
			}
		},
		[updateColumnHighlights]
	);

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

			// Use clientWidth/Height instead of boundingRect width/height to account for scrolling
			const boundaryWidth = boundaryRef.current.clientWidth;
			const boundaryHeight = boundaryRef.current.clientHeight;

			let { left, top } = position;
			let hitBoundary = false;

			dragElementRef.current.style.boxShadow = '';

			// Constrain within the scroll container, not just the visible area
			if (left < 0) {
				left = 0;
				hitBoundary = true;
			}

			if (left + cardRect.width > boundaryWidth) {
				left = boundaryWidth - cardRect.width;
				hitBoundary = true;
			}

			if (top < 0) {
				top = 0;
				hitBoundary = true;
			}

			if (top + cardRect.height > boundaryHeight) {
				top = boundaryHeight - cardRect.height;
				hitBoundary = true;
			}

			if (hitBoundary) {
				dragElementRef.current.style.boxShadow = '';
				dragElementRef.current.style.border = DRAG_CONFIG.VISUAL.BOUNDARY_FEEDBACK_BORDER;

				if (isTouch.current && navigator.vibrate) {
					navigator.vibrate(10);
				}
			}

			return { left, top };
		},
		[boundaryRef]
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
			if (!draggingCard || !boundaryRef?.current) return;

			try {
				const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;

				const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

				const dx = Math.abs(clientX - pointerPositionRef.current.x);
				const dy = Math.abs(clientY - pointerPositionRef.current.y);

				console.log(clientX, clientY, dx, dy, 'dx, dy');

				const isDragging = dx > DRAG_CONFIG.THRESHOLD || dy > DRAG_CONFIG.THRESHOLD;

				if (isDragging && !dragStartedRef.current) {
					// Check if boundary element is actually visible
					if (!isElementVisible(boundaryRef.current)) {
						console.warn('Boundary element is not visible, canceling drag');
						cleanupDrag();
						return;
					}

					dragStartedRef.current = true;
					setDragState((prev) => ({ ...prev, isDragging: true }));

					// Initialize scroll position tracking
					if (boundaryRef?.current) {
						prevScrollTopRef.current = boundaryRef.current.scrollTop;
						prevScrollLeftRef.current = boundaryRef.current.scrollLeft;
					}

					const cardElement = document.querySelector(
						`[${cardSelector}="${draggingCard.id}"][data-board-id="${boardContextId.current}"]:not([aria-hidden="true"])`
					) as HTMLElement;

					if (!cardElement || !isElementVisible(cardElement)) {
						console.error('Card element not found or not visible for dragging');
						cleanupDrag();
						return;
					}

					const rect = cardElement.getBoundingClientRect();
					const clone = createDragClone(cardElement, rect);
					if (!clone) return;

					dragElementRef.current = clone;

					createAccessibilityAnnouncement(
						`Card "${draggingCard.id}" is being dragged. Press Escape to cancel, Enter to drop.`
					);
				}

				if (dragStartedRef.current && dragElementRef.current && boundaryRef.current) {
					const boundaryRect = boundaryRef.current.getBoundingClientRect();

					// Calculate position relative to the boundary element
					const newLeft = clientX - boundaryRect.left - draggingCard.offsetX + boundaryRef.current.scrollLeft;
					const newTop = clientY - boundaryRect.top - draggingCard.offsetY + boundaryRef.current.scrollTop;

					const cardRect = dragElementRef.current.getBoundingClientRect();
					const constrainedPosition = applyBoundaryConstraints({ left: newLeft, top: newTop }, cardRect);

					dragElementRef.current.style.left = `${constrainedPosition.left}px`;
					dragElementRef.current.style.top = `${constrainedPosition.top}px`;

					const dragRect = dragElementRef.current.getBoundingClientRect();
					const targetColumnId = findTargetColumn(dragRect);
					const isSourceColumn = targetColumnId === draggingCard.columnId;

					// Only update if the target column has changed to reduce flashing
					if (targetColumnId !== currentTargetColumnRef.current) {
						currentTargetColumnRef.current = targetColumnId;
						updateColumnHighlights(targetColumnId, isSourceColumn);
					}

					if (targetColumnId && !isSourceColumn) {
						const isValid = isValidDropTarget(draggingCard.columnId, targetColumnId);

						if (isValid) {
							dragElementRef.current.style.border = '0.2rem solid rgba(50, 205, 50, 0.8)';
							dragElementRef.current.style.boxShadow = '0 0 0.8rem rgba(50, 205, 50, 0.6)';
						} else {
							dragElementRef.current.style.border = '0.2rem solid rgba(255, 99, 71, 0.8)';
							dragElementRef.current.style.boxShadow = '0 0 0.8rem rgba(255, 99, 71, 0.6)';
						}
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
			createAccessibilityAnnouncement,
			isValidDropTarget,
			boundaryRef,
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
					createAccessibilityAnnouncement(`Card moved to ${targetColumnId} column.`);

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
		[dragState, onCardMove, isValidDropTarget, cleanupDrag, createAccessibilityAnnouncement]
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
						onCardMove(draggingCard.id, draggingCard.columnId, targetColumnId);
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
				window.addEventListener('touchmove', handlePointerMove as EventListener);
				window.addEventListener('touchend', handlePointerUp as EventListener);
				window.addEventListener('touchcancel', handlePointerUp as EventListener);
			} else {
				window.addEventListener('mousemove', handlePointerMove as EventListener);
				window.addEventListener('mouseup', handlePointerUp as EventListener);
			}

			window.addEventListener('keydown', handleKeyDown);
			window.addEventListener('blur', cleanupDrag);
		}

		return () => {
			window.removeEventListener('mousemove', handlePointerMove as EventListener);
			window.removeEventListener('mouseup', handlePointerUp as EventListener);
			window.removeEventListener('touchmove', handlePointerMove as EventListener);
			window.removeEventListener('touchend', handlePointerUp as EventListener);
			window.removeEventListener('touchcancel', handlePointerUp as EventListener);
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('blur', cleanupDrag);

			if (scrollIntervalRef.current !== null) {
				window.clearInterval(scrollIntervalRef.current);
				scrollIntervalRef.current = null;
			}
		};
	}, [dragState, handlePointerMove, handlePointerUp, handleKeyDown, cleanupDrag]);

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
			if (announceElement && !document.querySelector("[aria-grabbed='true']")) {
				announceElement.remove();
			}
		};
	}, []);

	console.log(dragState, 'dragState');

	return {
		handleCardMouseDown: handleCardPointerDown,
		handleCardTouchStart: handleCardPointerDown,
		isDragging: dragState.isDragging,
	};
}
