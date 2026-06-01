export class DrawingTool {
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
    this.canvas.context.lineWidth = 2;
    this.canvas.context.lineCap = "round";
    this.canvas.context.lineJoin = "round";
    this.canvas.context.strokeStyle = "#000000";
    this.canvas.context.lineTo(pos.x, pos.y);
    this.canvas.context.stroke();
  }

  endStroke() {
    this.isDrawing = false;
    this.canvas.context.closePath();
  }
}
