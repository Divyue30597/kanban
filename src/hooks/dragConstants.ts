export const DRAG_CONFIG = {
  THRESHOLD: 5,
  VISUAL: {
    ROTATION: "rotate(3deg)",
    OPACITY: "0.6",
    BACKGROUND: "#f5f5f5",
    BORDER: "0.2rem dashed #ccc",
    Z_INDEX: "1000",
    BOUNDARY_FEEDBACK_BORDER:
      "solid 0.2rem #ff6b6b",
    BOUNDARY_FEEDBACK_OVER_RIGHT_COLUMN_BORDER:
      "0.2rem solid rgba(50, 205, 50, 0.8) !important",
    BOUNDARY_FEEDBACK_OVER_RIGHT_COLUMN_BOX_SHADOW:
      "0 0 1.2rem rgba(50, 205, 50, 0.4) !important",
    BOUNDARY_FEEDBACK_OVER_WRONG_COLUMN_BORDER:
      "0.2rem solid #ff6b6b !important",
    BOUNDARY_FEEDBACK_OVER_WRONG_COLUMN_BOX_SHADOW:
      "0 0 1.2rem rgba(255, 99, 71, 0.4)",
    CURSOR: "grabbing !important",
  },
  SCROLL: {
    MARGIN: 50,
    SPEED: 10,
    INTERVAL: 16,
  },
  ANIMATION: {
    DURATION: "0.3s",
    EASING: "ease",
  },
};
