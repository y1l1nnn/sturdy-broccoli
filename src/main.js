import { DrawingCanvas } from "./canvas.js";
import { ToolManager } from "./toolManager.js";

const canvas = new DrawingCanvas("drawing-canvas");
const toolManager = new ToolManager(canvas);

// Shared drag flag: true from mousedown until mouseup or mouseout.
let isDrawing = false;

const canvasElement = canvas.element;

canvasElement.addEventListener("mousedown", (e) => {
  isDrawing = true;
  const currentTool = toolManager.getCurrentTool();
  currentTool.startStroke(e);
});

canvasElement.addEventListener("mousemove", (e) => {
  if (isDrawing) {
    const currentTool = toolManager.getCurrentTool();
    currentTool.continueStroke(e);
  }
});

/**
 * Mouseup — finish the gesture.
 *
 * Shape tools (rectangle, oval) need endStroke(e) to commit using the release
 * position. Draw/eraser also define endStroke for path cleanup. Passing the
 * event matters when the user releases without a preceding mousemove.
 */
canvasElement.addEventListener("mouseup", (e) => {
  if (isDrawing) {
    toolManager.getCurrentTool().endStroke(e);
  }
  isDrawing = false;
});

/**
 * Mouseout — stop drawing; shape tools cancel an in-progress preview.
 *
 * cancelStroke is optional (duck-typed) so tools that don't define it — draw,
 * text, eraser — keep their previous behaviour of simply stopping the drag.
 */
canvasElement.addEventListener("mouseout", () => {
  if (isDrawing) {
    const tool = toolManager.getCurrentTool();
    if (typeof tool.cancelStroke === "function") {
      tool.cancelStroke();
    }
  }
  isDrawing = false;
});
