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

- [ ] Add access based on user role
- [ ] Admin user should be able to create board and give access to other users.
- [ ] Make the user before signing in to select something they are interested in getting.
- [ ] Set limit to number of tasks and columns that can be added to board.
- [ ] User Access management
- [ ] Make useDragAndDrop generic so that it can be used for any scenario where drag and drop is required.
- [ ] Every action on the page should be done by a keyboard action. Keep actions less, but there should be a way to start that action using keyboard shortcut.
- [ ] If possible get the screentime through the device, so that the user can get an indepth analysis.
- [ ] Think of creating a mobile application as well.
- [ ] Try to add more gamification to this project, by mostly adding a reward system (think of how this can be achived and be more rewardful)
- [ ] An indepth modal / page / notes for the cards added to jira, mostly creating a WYSIWYG editor.
- [ ] This should be generic to all user, they can be from different field. 
- [ ] If some page needs to be shared, try to provide a link (private / public and write / read only) or pdf option to share.
