export class TextTool {
  constructor(canvas) {
    this.canvas = canvas;
  }

  startStroke(event) {
    const pos = this.canvas.getMousePosition(event);
    const text = prompt("Enter text:");
    if (text) {
      this.canvas.context.font = "20px Arial";
      this.canvas.context.fillStyle = "#000000";
      this.canvas.context.textBaseline = "top";
      this.canvas.context.fillText(text, pos.x, pos.y);
    }
  }

  continueStroke() {
    // Text tool doesn't require continuous drawing
  }
}
