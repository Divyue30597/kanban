# Kanban Board

A modern, accessible drag-and-drop Kanban board implementation built with React.

## Features

- **Intuitive Drag and Drop**: Smooth drag-and-drop functionality for cards between columns
- **Touch & Mouse Support**: Works seamlessly on both desktop and touch devices
- **Visual Feedback**: Clear visual indicators for drop targets and boundary constraints
- **Directional Constraints**: Configure to only allow forward movement of cards (or enable bidirectional)
- **Accessibility**: Keyboard navigation, screen reader announcements, and ARIA attributes
- **Responsive Design**: Adapts to different screen sizes and devices
- **Error Handling**: Robust error management for a stable user experience

## Usage

```jsx
import { useDragAndDrop } from "./hooks/useDragAndDrop";
import styles from "./styles.module.scss";

function Board() {
  const { handleCardMouseDown, handleCardTouchStart, isDragging } =
    useDragAndDrop({
      onCardMove: (cardId, sourceColumnId, targetColumnId) => {
        // Handle card movement logic here
      },
      dropTargetClassName: styles.validDropTarget,
      invalidDropTargetClassName: styles.invalidDropTarget,
      boundaryRef: boardContentRef,
      allowBackwardMovement: false, // Only allow cards to move forward
    });

  return (
    <div ref={boardContentRef}>
      {columns.map((column) => (
        <div key={column.id} data-column-id={column.id}>
          <h2>{column.name}</h2>
          <div className="column-content">
            {column.cards.map((card) => (
              <div
                key={card.id}
                data-card-id={card.id}
                onMouseDown={(e) => handleCardMouseDown(e, card)}
                onTouchStart={(e) => handleCardTouchStart(e, card)}
              >
                {card.title}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

## Configuration Options

The `useDragAndDrop` hook accepts these configuration options:

| Option                       | Type      | Description                                                            |
| ---------------------------- | --------- | ---------------------------------------------------------------------- |
| `onCardMove`                 | Function  | Callback when a card is moved to a new column                          |
| `dropTargetClassName`        | String    | CSS class to apply to valid drop targets                               |
| `invalidDropTargetClassName` | String    | CSS class to apply to invalid drop targets                             |
| `boundaryRef`                | RefObject | Reference to the boundary container element                            |
| `columnContentSelector`      | String    | CSS selector for column content container (default: ".column-content") |
| `allowBackwardMovement`      | Boolean   | Whether to allow cards to move to columns on the left (default: false) |
| `cardSelector`               | String    | CSS selector for cards (default: "[data-card-id]")                     |

## Roadmap

### Short-Term Enhancements

- Card positioning at specific locations (top/middle/bottom)
- Visual indicators showing where card will be placed
- Auto-sorting options for cards

### Medium-Term Features

- Data persistence with localStorage/IndexedDB
- Undo/redo functionality
- Filtering and searching capabilities
- Column management (add/remove/rename)
- Work-in-progress limits for columns

### Long-Term Features

- Swimlanes for horizontal categorization
- Multiple board views (kanban/list/calendar)
- Analytics and insights
- Team collaboration features

### Accessibility improvements

This implementation follows accessibility best practices:

- Keyboard navigation support (Enter/Space to drop, Escape to cancel)
- ARIA attributes for screen readers
- Focus management
- Screen reader announcements during drag operations


PS - Most of this project is built using [Anthropic's Claude Sonnet 3.7 model](https://www.anthropic.com/claude)
