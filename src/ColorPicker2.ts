import { colorPickerState } from "./PickerComponent";

class ColorPicker2 {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  // mouseEvents
  private isDragging: boolean = false;
  private selectionPos = {
    x: 0,
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
    this.ctx.fillStyle = colorPickerState.currentChosenColor.colorString;
    this.ctx.fillRect(0, 0, gw, gh);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  private drawGradiantBW = (c1: string, c2: string) => {
    const gh = this.canvas.height
    const gw = this.canvas.width
    let grd = this.ctx.createLinearGradient(gw, 0, 0, gh);
    this.ctx.beginPath();
    grd.addColorStop(0, c1);
    grd.addColorStop(1, c2);
    this.ctx.globalAlpha = 0.5;
    this.ctx.fillStyle = grd;
    this.ctx.fillRect(0, 0, gw, gh);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  private drawSelector = () => {
    this.ctx.beginPath();
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = "black";
    this.ctx.arc(this.selectionPos.x, this.selectionPos.y, 10, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  // private findInterval = (): number[] => {
  //   // const intervals = [
  //   //   0,
  //   //   (this.canvas.height / 6),
  //   //   (this.canvas.height / 6) * 2,
  //   //   (this.canvas.height / 6) * 3,
  //   //   (this.canvas.height / 6) * 4,
  //   //   (this.canvas.height / 6) * 5,
  //   //   (this.canvas.height / 6) * 6,
  //   //   this.canvas.height
  //   // ]
  //   // for (let i = 0; i < intervals.length - 1; i++) {
  //   //   const minVal = intervals[i];
  //   //   const maxVal = intervals[i + 1];
  //   //   if (this.selectionPos >= minVal && this.selectionPos <= maxVal) {
  //   //     return [i, minVal];
  //   //   }
  //   // }
  //   // return [-1, -1]
  // }

  private getChosenColor = () => {
    // const [i, minVal] = this.findInterval();
    // const colorNum = ((this.selectionPos - minVal) / (this.canvas.height / 6)) * 255;
    // console.log(colorNum)
    // switch (i) {
    //   case 0:
    //     return `rgb(255, ${colorNum}, 0)`;
    //   case 1:
    //     return `rgb(${255 - colorNum}, 255, 0)`;
    //   case 2:
    //     return `rgb(0, 255, ${colorNum})`;
    //   case 3:
    //     return `rgb(0, ${255 - colorNum}, 255)`;
    //   case 4:
    //     return `rgb(${colorNum}, 0, 255)`;
    //   case 5:
    //     return `rgb(255, 0, ${255 - colorNum})`;
    // }
  }

  private draw = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    if (colorPickerState.currentChosenColor.colorString !== '') {
      this.drawSelector();
      this.drawBackground();
    }
    
    // this.drawGradiant(1, "rgb(255, 255, 0)", "rgb(0, 255, 0)");
    // this.drawGradiant(2, "rgb(0, 255, 0)", "rgb(0, 255, 255)");
    // this.drawGradiant(3, "rgb(0, 255, 255)", "rgb(0, 0, 255)");
    // this.drawGradiant(4, "rgb(0, 0, 255)", "rgb(255, 0, 255)");
    // this.drawGradiant(5, "rgb(255, 0, 255)", "rgb(255, 0, 0)");

    

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
  }

  private onPointerMove = (e: MouseEvent) => {
    if (this.isDragging) {
      this.selectionPos = {
        x: Math.min(Math.max(this.getCanvasMousePosX(e), 0), this.canvas.width),
        y: Math.min(Math.max(this.getCanvasMousePosY(e), 0), this.canvas.height)
      }
    }
    
  }

  private onPointerUp = (e: MouseEvent) => {
    this.isDragging = false;
  }
}

const colorPicker2 = new ColorPicker2();
export default colorPicker2;