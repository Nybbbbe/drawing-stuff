import { colorPickerState } from "./PickerComponent";

class ColorPicker {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  // mouseEvents
  private isDragging: boolean = false;
  private selectionPos: number = 0;

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
    requestAnimationFrame(this.draw);
  }

  private resize = () => {
    this.canvas.width = 64;
    this.canvas.height = window.innerHeight - 32;
  }

  private drawGradiant = (i: number, c1: string, c2: string) => {
    const gh = this.canvas.height / 6
    const gw = this.canvas.width
    const y = gh * i;
    let grd = this.ctx.createLinearGradient(0, y, 0, y + gh);
    this.ctx.beginPath();
    grd.addColorStop(0, c1);
    grd.addColorStop(1, c2);
    this.ctx.fillStyle = grd;
    this.ctx.fillRect(0, y, gw, gh);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  private drawSelector = () => {
    this.ctx.beginPath();
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = "black";  
    this.ctx.rect(0, this.selectionPos - 20, this.canvas.width, 10);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  private findInterval = (): number[] => {
    const intervals = [
      0,
      (this.canvas.height / 6),
      (this.canvas.height / 6) * 2,
      (this.canvas.height / 6) * 3,
      (this.canvas.height / 6) * 4,
      (this.canvas.height / 6) * 5,
      (this.canvas.height / 6) * 6,
      this.canvas.height
    ]
    for (let i = 0; i < intervals.length - 1; i++) {
      const minVal = intervals[i];
      const maxVal = intervals[i + 1];
      if (this.selectionPos >= minVal && this.selectionPos <= maxVal) {
        console.log(i, maxVal)
        return [i, maxVal];
      }
    }
    return [-1, -1, -1]
  }

  private getChosenColor = () => {
    const [i, maxVal] = this.findInterval();
    const colorNum = (this.selectionPos / maxVal) * 255;
    console.log(colorNum)
    switch (i) {
      case 0:
        return `rgb(255, ${colorNum}, 0)`;
      case 1:
        return `rgb(${colorNum}, 255, 0)`;
      case 2:
        return `rgb(0, 255, ${colorNum})`;
      case 3:
        return `rgb(0, ${colorNum}, 255)`;
      case 4:
        return `rgb(${colorNum}, 0, 255)`;
      case 5:
        return `rgb(255, 0, ${colorNum})`;
    }
  }

  private draw = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawGradiant(0, "rgb(255, 0, 0)", "rgb(255, 255, 0)");
    this.drawGradiant(1, "rgb(255, 255, 0)", "rgb(0, 255, 0)");
    this.drawGradiant(2, "rgb(0, 255, 0)", "rgb(0, 255, 255)");
    this.drawGradiant(3, "rgb(0, 255, 255)", "rgb(0, 0, 255)");
    this.drawGradiant(4, "rgb(0, 0, 255)", "rgb(255, 0, 255)");
    this.drawGradiant(5, "rgb(255, 0, 255)", "rgb(255, 0, 0)");

    this.drawSelector();

    requestAnimationFrame(this.draw)
  }

  private handleMouseEvents = () => {
    this.canvas.addEventListener('mousedown', this.onPointerDown);
    this.canvas.addEventListener('mousemove', this.onPointerMove);
    this.canvas.addEventListener('mouseup', this.onPointerUp);
    window.addEventListener('mouseup', this.onPointerUp);
    window.addEventListener('mousemove', this.onPointerMove);
  }

  private getCanvasMousePos = (e: MouseEvent): number => {
    const rect = this.canvas.getBoundingClientRect();
    return e.clientY - rect.top;
  }

  private onPointerDown = (e: MouseEvent) => {
    this.isDragging = true;
    this.selectionPos = Math.min(Math.max(this.getCanvasMousePos(e), 0), this.canvas.height);
    colorPickerState.setNewColor(this.getChosenColor()!);
  }

  private onPointerMove = (e: MouseEvent) => {
    if (this.isDragging) {
      this.selectionPos = Math.min(Math.max(this.getCanvasMousePos(e), 0), this.canvas.height);
      colorPickerState.setNewColor(this.getChosenColor()!);
    }
    
  }

  private onPointerUp = (e: MouseEvent) => {
    this.isDragging = false;
  }
}

const colorPicker = new ColorPicker();
export default colorPicker;