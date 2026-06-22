/**
 * OvalTool — drag-to-draw filled ellipse.
 *
 * Mirrors RectangleTool's gesture lifecycle (snapshot preview, commit on
 * mouseup, cancel on mouseout). The only behavioural difference is rendering:
 * an ellipse inscribed in the drag bounding box instead of a filled rect.
 *
 * Design: separate file rather than a shared ShapeTool base class — keeps the
 * diff small and matches the existing one-tool-per-file pattern. Bounding-box
 * math is reused from DrawingCanvas.rectFromCorners (same two-corner drag).
 */
export class OvalTool {
  constructor(canvas) {
    this.canvas = canvas;

    // True while the user is holding the mouse down after mousedown.
    this.isDrawing = false;

    // First corner, fixed for the whole drag; paired with the current/end pos.
    this.startPos = null;
  }

  /**
   * Mousedown — begin a new oval gesture.
   *
   * Snapshot the canvas before drawing so every preview frame can restore to
   * the pre-drag artwork (see DrawingCanvas.saveSnapshot).
   */
  startStroke(event) {
    this.isDrawing = true;
    this.startPos = this.canvas.getMousePosition(event);
    this.canvas.saveSnapshot();
  }

  /**
   * Mousemove while held — rubber-band preview of the inscribed ellipse.
   *
   * Same restore-then-draw pattern as RectangleTool: without restore, each
   * mousemove would permanently stack preview pixels on the bitmap canvas.
   */
  continueStroke(event) {
    if (!this.isDrawing || !this.startPos) return;

    const currentPos = this.canvas.getMousePosition(event);
    const bounds = this.canvas.rectFromCorners(
      this.startPos.x,
      this.startPos.y,
      currentPos.x,
      currentPos.y
    );

    this.canvas.restoreSnapshot();
    this.drawOval(bounds);
  }

  /**
   * Mouseup — commit the final ellipse.
   *
   * main.js passes the event so the release corner is correct even when no
   * mousemove occurred after mousedown.
   */
  endStroke(event) {
    if (!this.isDrawing || !this.startPos) {
      this.reset();
      return;
    }

    const endPos = event
      ? this.canvas.getMousePosition(event)
      : this.startPos;

    const bounds = this.canvas.rectFromCorners(
      this.startPos.x,
      this.startPos.y,
      endPos.x,
      endPos.y
    );

    this.canvas.restoreSnapshot();

    if (this.hasSize(bounds)) {
      this.drawOval(bounds);
    }

    this.reset();
  }

  /**
   * Mouseout while dragging — discard preview without committing.
   *
   * Optional on the tool interface; main.js calls this only when defined so
   * draw/eraser tools are unaffected.
   */
  cancelStroke() {
    if (!this.isDrawing) return;

    this.canvas.restoreSnapshot();
    this.reset();
  }

  /**
   * Draw a filled ellipse inscribed in the bounding box — no stroke/border.
   *
   * Uses CanvasRenderingContext2D.ellipse() with radii half the box width/height
   * and centre at the box midpoint. fill() only (never stroke()) matches the
   * rectangle tool and requirements. Black fill matches draw/text tools.
   */
  drawOval({ x, y, width, height }) {
    const ctx = this.canvas.context;
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const radiusX = width / 2;
    const radiusY = height / 2;

    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
    ctx.fillStyle = "#000000";
    ctx.fill();
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
