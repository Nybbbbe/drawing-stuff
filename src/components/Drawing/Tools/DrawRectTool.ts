import { colorPaletteState } from "../ColorPaletteComponent";
import { TDrawing } from "../Drawings";
import { checkRectOverlap } from "../DrawingUtils";
import { Tool } from "./ToolTypes";

class DrawRectTool extends Tool {
  private canvas: HTMLCanvasElement;
  private drawingState: TDrawing;

  // mouseEvents
  public isDragging: boolean = false;
  public selectionPosStart = {
    x: 0,
    y: 0
  }
  public selectionPosEnd = {
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
      ctx.arc(this.selectionPosStart.x, this.selectionPosStart.y, 10, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      const x = Math.min(this.selectionPosStart.x, this.selectionPosEnd.x);
      const y = Math.min(this.selectionPosStart.y, this.selectionPosEnd.y);
      const w = Math.abs(this.selectionPosStart.x - this.selectionPosEnd.x);
      const h = Math.abs(this.selectionPosStart.y - this.selectionPosEnd.y);
      ctx.rect(x, y, w, h);
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
    const x = Math.min(this.selectionPosStart.x, this.selectionPosEnd.x);
    const y = Math.min(this.selectionPosStart.y, this.selectionPosEnd.y);
    const w = Math.abs(this.selectionPosStart.x - this.selectionPosEnd.x);
    const h = Math.abs(this.selectionPosStart.y - this.selectionPosEnd.y);
    this.drawingState.cells.forEach(cell => {
      if(checkRectOverlap(x, y, w, h, cell.x * gridSizeW, cell.y * gridSizeH, gridSizeW, gridSizeH)) {
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
    this.selectionPosStart = {
      x: Math.min(Math.max(this.getCanvasMousePosX(e), 0), this.canvas.width),
      y: Math.min(Math.max(this.getCanvasMousePosY(e), 0), this.canvas.height)
    }
    this.selectionPosEnd = this.selectionPosStart
  }

  private onPointerMove = (e: MouseEvent) => {
    if (this.isDragging) {
      this.selectionPosEnd = {
        x: Math.min(Math.max(this.getCanvasMousePosX(e), 0), this.canvas.width),
        y: Math.min(Math.max(this.getCanvasMousePosY(e), 0), this.canvas.height)
      }
    }
  }

  private onPointerUp = (e: MouseEvent) => {
    this.isDragging = false;
    this.handleSelection()
  }
}

export default DrawRectTool;