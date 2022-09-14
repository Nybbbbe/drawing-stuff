import { colorPickerState } from "../ColorPicker/PickerComponent";
import { colorPaletteState } from "./ColorPaletteComponent";
import { checkOverlap } from "./DrawingUtils";

type TCell = {
  x: number,
  y: number,
  color: string
} 

type TDrawing = {
  width: number,
  height: number,
  cells: TCell[]
}

class Drawing {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  // mouseEvents
  private isDragging: boolean = false;
  private selectionPosStart = {
    x: 0,
    y: 0
  }
  private selectionPosEnd = {
    x: 0,
    y: 0
  }

  public drawingState: TDrawing = {
    width: 16,
    height: 16,
    cells: []
  };

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  public updateRefs = (canvas: HTMLCanvasElement) => {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d')!;
    this.setupDefaultDrawing();
    this.handleMouseEvents();
    this.resize();
    window.addEventListener('resize', this.resize);
    requestAnimationFrame(this.draw);
  }

  private setupDefaultDrawing = () => {
    for (let w = 0; w < this.drawingState.width; w++) {
      for (let h = 0; h < this.drawingState.height; h++) {
        const newCell = {
          x: w,
          y: h,
          color: 'rgba(255, 255, 255, 0)'
        }
        this.drawingState.cells.push(newCell);
      }
    }
  }

  private resize = () => {
    this.canvas.width = window.innerHeight - 32;
    this.canvas.height = window.innerHeight - 32;
  }

  private drawBackground = () => {
    const cW = this.canvas.width
    const cH = this.canvas.height

    this.ctx.beginPath();
    this.ctx.fillStyle = colorPickerState.currentFinalColor;
    this.ctx.fillRect(0, 0, cW, cH);
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.stroke();
  }

  private drawGrid = () => {
    const cW = this.canvas.width
    const cH = this.canvas.height

    const gridNumW = this.drawingState.width
    const gridNumH = this.drawingState.height
    const gridSizeW = cW / gridNumW;
    const gridSizeH = cH / gridNumH;
    for (let i = 0; i < gridNumW + 1; i++) {
      // horz lines
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle="rgba(0, 0, 0, 1)";
      this.ctx.beginPath();
      this.ctx.moveTo(gridSizeW * i, 0);
      this.ctx.lineTo(gridSizeW * i, cH);
      this.ctx.stroke();
      // vert lines
      this.ctx.beginPath();
      this.ctx.moveTo(0, gridSizeH * i);
      this.ctx.lineTo(cW, gridSizeH * i);
      this.ctx.stroke();
    }
  }

  private drawCells = () => {
    const cW = this.canvas.width
    const cH = this.canvas.height
    const gridNumW = this.drawingState.width
    const gridNumH = this.drawingState.height
    const gridSizeW = cW / gridNumW;
    const gridSizeH = cH / gridNumH;

    this.drawingState.cells.forEach(cell => {
      this.ctx.beginPath();
      this.ctx.fillStyle = cell.color;
      this.ctx.fillRect(gridSizeW * cell.x, gridSizeH * cell.y, gridSizeW, gridSizeH);
      this.ctx.stroke();
    })
  }

  private drawSelector = () => {
    this.ctx.beginPath();
    this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = "black";
    this.ctx.arc(this.selectionPosStart.x, this.selectionPosStart.y, 10, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "black";
    const x = Math.min(this.selectionPosStart.x, this.selectionPosEnd.x);
    const y = Math.min(this.selectionPosStart.y, this.selectionPosEnd.y);
    const w = Math.abs(this.selectionPosStart.x - this.selectionPosEnd.x);
    const h = Math.abs(this.selectionPosStart.y - this.selectionPosEnd.y);
    this.ctx.rect(x, y, w, h);
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.stroke();
  }

  private draw = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // this.drawBackground();
    
    this.drawCells();
    this.drawGrid();
    
    if (this.isDragging) {
      this.drawSelector();
    }
    

    requestAnimationFrame(this.draw)
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
      if(checkOverlap(x, y, w, h, cell.x * gridSizeW, cell.y * gridSizeH, gridSizeW, gridSizeH)) {
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

const drawing = new Drawing();
export default drawing;