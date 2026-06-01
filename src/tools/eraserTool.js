export class EraserTool {
  constructor(canvas) {
    this.canvas = canvas;
    this.isDrawing = false;
  }

  startStroke(event) {
    this.isDrawing = true;
    const pos = this.canvas.getMousePosition(event);
    this.canvas.context.beginPath();
    this.canvas.context.moveTo(pos.x, pos.y);
  }

  continueStroke(event) {
    if (!this.isDrawing) return;

    const pos = this.canvas.getMousePosition(event);
    this.canvas.context.lineWidth = 20;
    this.canvas.context.lineCap = "round";
    this.canvas.context.lineJoin = "round";
    this.canvas.context.clearRect(pos.x - 10, pos.y - 10, 20, 20);
  }

  endStroke() {
    this.isDrawing = false;
    this.canvas.context.closePath();
  }
}
