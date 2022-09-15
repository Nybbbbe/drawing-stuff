import { colorPickerState } from "../ColorPicker/PickerComponent";
import { colorPaletteState } from "./ColorPaletteComponent";
import { checkRectOverlap } from "./DrawingUtils";
import DrawFreeTool from "./Tools/DrawFreeTool";
import DrawRectTool from "./Tools/DrawRectTool";
import { Tool, Tools } from "./Tools/ToolTypes";

type TCell = {
  x: number,
  y: number,
  color: string
} 

export type TDrawing = {
  width: number,
  height: number,
  cells: TCell[]
}

class Drawing {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  public drawingState: TDrawing = {
    width: 16,
    height: 16,
    cells: []
  };
  private activeTool: Tool | undefined = undefined; 

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  public updateRefs = (canvas: HTMLCanvasElement) => {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d')!;
    this.setupDefaultDrawing();
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

  private draw = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // this.drawBackground();
    
    this.drawCells();
    this.drawGrid();
    
    if (this.activeTool !== undefined) {
      this.activeTool.draw(this.ctx);
    }
    
    requestAnimationFrame(this.draw)
  }

  public activateTool = (tool: Tools | undefined) => {
    if (this.activeTool !== undefined) {
      this.activeTool.terminate();
    }
    switch (tool) {
      case Tools.DRAW_FREE:
        this.activeTool = new DrawFreeTool(this.canvas, this.drawingState);
        break;
      case Tools.DRAW_LINE:
        this.activeTool = new DrawRectTool(this.canvas, this.drawingState);
        break;
      case Tools.DRAW_RECT:
        this.activeTool = new DrawRectTool(this.canvas, this.drawingState);
        break;
      case Tools.DRAW_CIRCLE:
        this.activeTool = new DrawRectTool(this.canvas, this.drawingState);
        break;
      default:
        this.activeTool = undefined;
        break;
    }
    
  }
}

const drawing = new Drawing();
export default drawing;