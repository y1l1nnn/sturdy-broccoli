import { DrawingTool } from "./tools/drawingTool.js";
import { TextTool } from "./tools/textTool.js";
import { EraserTool } from "./tools/eraserTool.js";

export class ToolManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.currentToolName = null;

    this.tools = {
      draw: new DrawingTool(canvas),
      text: new TextTool(canvas),
      eraser: new EraserTool(canvas),
    };

    this.toolDefinitions = [
      { id: "draw", name: "Draw", icon: "✏️" },
      { id: "text", name: "Text", icon: "T" },
      { id: "eraser", name: "Eraser", icon: "🗑️" },
    ];

    this.selectTool("draw");
    this.createToolbar();
  }

  createToolbar() {
    const container = document.getElementById("tools-container");

    this.toolDefinitions.forEach((toolDef) => {
      const button = document.createElement("button");
      button.className = "tool-button";
      button.id = `tool-${toolDef.id}`;
      button.innerHTML = `
        <span class="tool-icon">${toolDef.icon}</span>
        <span>${toolDef.name}</span>
      `;

      button.addEventListener("click", () => {
        this.selectTool(toolDef.id);
      });

      container.appendChild(button);
    });
  }

  selectTool(toolId) {
    if (this.currentToolName) {
      const oldButton = document.getElementById(`tool-${this.currentToolName}`);
      if (oldButton) {
        oldButton.classList.remove("active");
      }
    }

    this.currentToolName = toolId;
    const newButton = document.getElementById(`tool-${toolId}`);
    if (newButton) {
      newButton.classList.add("active");
    }
  }

  getCurrentTool() {
    return this.tools[this.currentToolName];
  }
}
