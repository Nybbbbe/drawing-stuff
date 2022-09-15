import { colorPaletteState } from "../ColorPaletteComponent";
import { TDrawing } from "../Drawings";
import { checkPointOverlap, checkRectOverlap } from "../DrawingUtils";
import { Tool } from "./ToolTypes";

class DrawFreeTool extends Tool {
  private canvas: HTMLCanvasElement;
  private drawingState: TDrawing;

  // mouseEvents
  public isDragging: boolean = false;
  public selectionPos = {
    x: 0,
    y: 0
  }

  constructor(canvas: HTMLCanvasElement, drawingState: TDrawing) {
    super();
    this.canvas = canvas;
    this.drawingState = drawingState;
    this.handleMouseEvents();
  }

  public draw = (ctx: CanvasRenderingContext2D): void => {
    if (this.isDragging) {
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255, 255, 255, 1)';
      ctx.lineWidth = 5;
      ctx.strokeStyle = "black";
      ctx.arc(this.selectionPos.x, this.selectionPos.y, 10, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
      ctx.stroke();
    }
  }

  public terminate = (): void => {
    this.canvas.removeEventListener('mousedown', this.onPointerDown);
    this.canvas.removeEventListener('mousemove', this.onPointerMove);
    this.canvas.removeEventListener('mouseup', this.onPointerUp);
  }

  private handleSelection = () => {
    const cW = this.canvas.width
    const cH = this.canvas.height
    const gridNumW = this.drawingState.width
    const gridNumH = this.drawingState.height
    const gridSizeW = cW / gridNumW;
    const gridSizeH = cH / gridNumH;
    const x = this.selectionPos.x;
    const y = this.selectionPos.y;
    this.drawingState.cells.forEach(cell => {
      if(checkPointOverlap(x, y, cell.x * gridSizeW, cell.y * gridSizeH, gridSizeW, gridSizeH)) {
        cell.color = colorPaletteState.selectedColor;
      }
    })
  }

  private handleMouseEvents = () => {
    this.canvas.addEventListener('mousedown', this.onPointerDown);
    this.canvas.addEventListener('mousemove', this.onPointerMove);
    this.canvas.addEventListener('mouseup', this.onPointerUp);
  }

  private getCanvasMousePosY = (e: MouseEvent): number => {
    const rect = this.canvas.getBoundingClientRect();
    return e.clientY - rect.top;
  }

  private getCanvasMousePosX = (e: MouseEvent): number => {
    const rect = this.canvas.getBoundingClientRect();
    return e.clientX - rect.left;
  }

  private onPointerDown = (e: MouseEvent) => {
    this.isDragging = true;
    this.selectionPos = {
      x: Math.min(Math.max(this.getCanvasMousePosX(e), 0), this.canvas.width),
      y: Math.min(Math.max(this.getCanvasMousePosY(e), 0), this.canvas.height)
    }
    this.handleSelection();
  }

  private onPointerMove = (e: MouseEvent) => {
    if (this.isDragging) {
      this.selectionPos = {
        x: Math.min(Math.max(this.getCanvasMousePosX(e), 0), this.canvas.width),
        y: Math.min(Math.max(this.getCanvasMousePosY(e), 0), this.canvas.height)
      }
      this.handleSelection();
    }
  }

  private onPointerUp = (e: MouseEvent) => {
    this.isDragging = false;
  }
}

export default DrawFreeTool;