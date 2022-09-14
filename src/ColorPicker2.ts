import { intercept, observe } from "mobx";
import { colorPickerState } from "./PickerComponent";
import { extractRGB } from "./utils";

class ColorPicker2 {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  // mouseEvents
  private isDragging: boolean = false;
  private selectionPos = {
    x: 500,
    y: 0
  }

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  public updateRefs = (canvas: HTMLCanvasElement) => {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d')!;
    this.resize();
    window.addEventListener('resize', this.resize);
    this.handleMouseEvents();
    const detectFirstPickerChange = observe(colorPickerState, "currentChosenColor", change => {
      const chosenColor = this.getChosenColor();
      colorPickerState.setNewFinalColor(chosenColor);
      return null
    });
    requestAnimationFrame(this.draw);
  }

  private resize = () => {
    this.canvas.width = 500;
    this.canvas.height = 500;
  }

  private drawBackground = () => {
    const gh = this.canvas.height
    const gw = this.canvas.width
    const grdB = this.ctx.createLinearGradient(0, 0, 0, gh);
    const grdW = this.ctx.createLinearGradient(gw, 0, 0, 0);

    this.ctx.globalCompositeOperation = 'destination-over';

    grdB.addColorStop(0, "rgba(0, 0, 0, 0)");
    grdB.addColorStop(1, "rgba(0, 0, 0, 1)");
    grdW.addColorStop(0, "rgba(255, 255, 255, 0)");
    grdW.addColorStop(1, "rgba(255, 255, 255, 1)");
    this.ctx.beginPath();

    this.ctx.fillStyle = grdB;
    this.ctx.fillRect(0, 0, gw, gh);
    this.ctx.fillStyle = grdW;
    this.ctx.fillRect(0, 0, gw, gh);
    this.ctx.fillStyle = colorPickerState.currentChosenColor;
    this.ctx.fillRect(0, 0, gw, gh);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  private drawSelector = () => {
    this.ctx.beginPath();
    this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = "black";
    this.ctx.arc(this.selectionPos.x, this.selectionPos.y, 10, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.stroke();
  }

  private getChosenColor = () => {
    const x = this.selectionPos.x;
    const y = this.selectionPos.y;
    const rgb = extractRGB(colorPickerState.currentChosenColor)
    const xP = 1 - (x / this.canvas.width);
    const yP = 1 - (y / this.canvas.height);
    const potential_w = 255 * yP;

    rgb.r = (rgb.r * yP) + ((potential_w - (rgb.r * yP)) * xP);
    rgb.g = (rgb.g * yP) + ((potential_w - (rgb.g * yP)) * xP)
    rgb.b = (rgb.b * yP) + ((potential_w - (rgb.b * yP)) * xP)

    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
  }

  private draw = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    if (colorPickerState.currentChosenColor !== '') {
      this.drawSelector();
      this.drawBackground();
    }

    requestAnimationFrame(this.draw)
  }

  private handleMouseEvents = () => {
    this.canvas.addEventListener('mousedown', this.onPointerDown);
    this.canvas.addEventListener('mousemove', this.onPointerMove);
    this.canvas.addEventListener('mouseup', this.onPointerUp);
    window.addEventListener('mouseup', this.onPointerUp);
    window.addEventListener('mousemove', this.onPointerMove);
  }

  private getCanvasMousePosY = (e: MouseEvent): number => {
    const rect = this.canvas.getBoundingClientRect();
    return e.clientY - rect.top - 10;
  }

  private getCanvasMousePosX = (e: MouseEvent): number => {
    const rect = this.canvas.getBoundingClientRect();
    return e.clientX - rect.left - 10;
  }

  private onPointerDown = (e: MouseEvent) => {
    this.isDragging = true;
    this.selectionPos = {
      x: Math.min(Math.max(this.getCanvasMousePosX(e), 0), this.canvas.width),
      y: Math.min(Math.max(this.getCanvasMousePosY(e), 0), this.canvas.height)
    }
    const chosenColor = this.getChosenColor();
    colorPickerState.setNewFinalColor(chosenColor);
  }

  private onPointerMove = (e: MouseEvent) => {
    if (this.isDragging) {
      this.selectionPos = {
        x: Math.min(Math.max(this.getCanvasMousePosX(e), 0), this.canvas.width),
        y: Math.min(Math.max(this.getCanvasMousePosY(e), 0), this.canvas.height)
      }
      const chosenColor = this.getChosenColor();
      colorPickerState.setNewFinalColor(chosenColor);
    }
  }

  private onPointerUp = (e: MouseEvent) => {
    this.isDragging = false;
  }
}

const colorPicker2 = new ColorPicker2();
export default colorPicker2;