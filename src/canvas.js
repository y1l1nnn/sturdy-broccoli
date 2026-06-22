export class DrawingCanvas {
  constructor(canvasId) {
    this.element = document.getElementById(canvasId);
    this.context = this.element.getContext("2d");

    // Holds a pixel copy of the canvas taken at the start of a drag gesture.
    // Used by shape tools (e.g. rectangle) to preview without permanently
    // altering the canvas on every mousemove.
    this.snapshot = null;
  }

  getMousePosition(event) {
    const rect = this.element.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  /**
   * Capture the current canvas pixels before a drag begins.
   *
   * Why this exists (Milestone 1 — canvas foundation):
   * The app has no scene graph or separate preview layer — everything is drawn
   * directly onto the canvas bitmap. Shape tools need to show a live preview
   * while dragging, then either commit or discard on release. Without a
   * snapshot, each mousemove would leave behind ghost shapes. Saving once at
   * mousedown and restoring before each preview redraw keeps existing artwork
   * intact while the user adjusts the shape.
   */
  saveSnapshot() {
    this.snapshot = this.context.getImageData(
      0,
      0,
      this.element.width,
      this.element.height
    );
  }

  /**
   * Restore the canvas to the last saved snapshot.
   *
   * Called before drawing a preview rect on mousemove, and again before
   * committing or cancelling on mouseup/mouseout. No-op if no snapshot exists
   * (e.g. tool called restore without a prior save).
   */
  restoreSnapshot() {
    if (this.snapshot) {
      this.context.putImageData(this.snapshot, 0, 0);
    }
  }

  /**
   * Clear the in-memory snapshot after a drag gesture finishes.
   *
   * Prevents stale snapshots from being restored by a later unrelated action,
   * and allows the ImageData buffer to be garbage-collected.
   */
  clearSnapshot() {
    this.snapshot = null;
  }

  /**
   * Compute an axis-aligned rectangle from two opposite corner points.
   *
   * Drag direction does not matter: the user may drag up-left, down-right, etc.
   * We normalise by taking the min corner as origin and abs deltas as size.
   *
   * Placed on DrawingCanvas (rather than inside the tool) so geometry stays in
   * one reusable place — the rectangle tool only needs start + current position.
   */
  rectFromCorners(x1, y1, x2, y2) {
    return {
      x: Math.min(x1, x2),
      y: Math.min(y1, y2),
      width: Math.abs(x2 - x1),
      height: Math.abs(y2 - y1),
    };
  }

  clear() {
    this.context.fillStyle = "#ffffff";
    this.context.fillRect(0, 0, this.element.width, this.element.height);
  }
}
