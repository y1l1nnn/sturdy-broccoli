/**
 * RectangleTool — drag-to-draw filled rectangle.
 *
 * Milestone 2: tool logic only. Not yet registered in toolManager or wired in
 * main.js (Milestone 3). Implements the same startStroke / continueStroke /
 * endStroke interface as other tools, plus cancelStroke for mouseout.
 *
 * Design: one class, one file — matches DrawingTool, EraserTool, TextTool.
 * Interaction state (start corner, isDrawing) lives here; pixel snapshot
 * lifecycle is delegated to DrawingCanvas (Milestone 1).
 */
export class RectangleTool {
  constructor(canvas) {
    this.canvas = canvas;

    // True while the user is holding the mouse down after mousedown.
    this.isDrawing = false;

    // First corner, set once at mousedown and kept fixed for the whole drag.
    this.startPos = null;
  }

  /**
   * Mousedown — begin a new rectangle gesture.
   *
   * We snapshot the canvas *before* any preview pixels are drawn so restore
   * always returns to the pre-drag artwork (see canvas.saveSnapshot).
   */
  startStroke(event) {
    this.isDrawing = true;
    this.startPos = this.canvas.getMousePosition(event);
    this.canvas.saveSnapshot();
  }

  /**
   * Mousemove while held — redraw preview from snapshot each frame.
   *
   * Why restore-then-draw on every move: the canvas has no layers. Without
   * restoring first, each move would stack another preview rect permanently.
   * One restore + one fillRect per move gives a clean rubber-band effect.
   */
  continueStroke(event) {
    if (!this.isDrawing || !this.startPos) return;

    const currentPos = this.canvas.getMousePosition(event);
    const rect = this.canvas.rectFromCorners(
      this.startPos.x,
      this.startPos.y,
      currentPos.x,
      currentPos.y
    );

    this.canvas.restoreSnapshot();
    this.drawRect(rect);
  }

  /**
   * Mouseup — commit the final rectangle onto the canvas.
   *
   * Accepts the mouse event so the release point is accurate even when the
   * user didn't move the mouse after mousedown (no continueStroke fired).
   * Milestone 3 will pass this event from main.js on mouseup.
   */
  endStroke(event) {
    if (!this.isDrawing || !this.startPos) {
      this.reset();
      return;
    }

    const endPos = event
      ? this.canvas.getMousePosition(event)
      : this.startPos;

    const rect = this.canvas.rectFromCorners(
      this.startPos.x,
      this.startPos.y,
      endPos.x,
      endPos.y
    );

    // Restore to pre-drag state, then paint the committed shape on top.
    this.canvas.restoreSnapshot();

    if (this.hasSize(rect)) {
      this.drawRect(rect);
    }

    this.reset();
  }

  /**
   * Mouseout while dragging — discard preview without committing.
   *
   * Separate from endStroke so leaving the canvas cancels rather than
   * finishing the shape. main.js will call this only when the tool defines it
   * (optional method — draw/eraser tools don't need it).
   */
  cancelStroke() {
    if (!this.isDrawing) return;

    this.canvas.restoreSnapshot();
    this.reset();
  }

  /**
   * Draw a filled rectangle — no stroke/border (per requirements).
   *
   * Uses fillRect only, never strokeRect. Black matches draw and text tools.
   * Kept as a private helper so preview (continueStroke) and commit
   * (endStroke) share identical rendering and stay in sync.
   */
  drawRect({ x, y, width, height }) {
    const ctx = this.canvas.context;
    ctx.fillStyle = "#000000";
    ctx.fillRect(x, y, width, height);
  }

  /**
   * Skip zero-area shapes when the user clicks without dragging.
   */
  hasSize({ width, height }) {
    return width > 0 && height > 0;
  }

  /**
   * Clear gesture state and release the snapshot buffer.
   */
  reset() {
    this.isDrawing = false;
    this.startPos = null;
    this.canvas.clearSnapshot();
  }
}
