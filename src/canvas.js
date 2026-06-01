export class DrawingCanvas {
  constructor(canvasId) {
    this.element = document.getElementById(canvasId);
    this.context = this.element.getContext("2d");
  }

  getMousePosition(event) {
    const rect = this.element.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  clear() {
    this.context.fillStyle = "#ffffff";
    this.context.fillRect(0, 0, this.element.width, this.element.height);
  }
}
