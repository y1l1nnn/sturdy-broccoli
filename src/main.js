import { DrawingCanvas } from "./canvas.js";
import { ToolManager } from "./toolManager.js";

const canvas = new DrawingCanvas("drawing-canvas");
const toolManager = new ToolManager(canvas);

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

canvasElement.addEventListener("mouseup", () => {
  isDrawing = false;
});

canvasElement.addEventListener("mouseout", () => {
  isDrawing = false;
});
