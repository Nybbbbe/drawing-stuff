class ColorPicker {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  // mouseEvents
  private isDragging: boolean = false;
  private selectionPos: number = 0;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
    window.addEventListener('resize', this.resize)
    document.body.appendChild(this.canvas);
    this.resize();
    this.handleMouseEvents()
    requestAnimationFrame(this.draw)
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

  private onPointerDown = (e: MouseEvent) => {
    this.isDragging = true;
    this.selectionPos = e.clientY;
  }

  private onPointerMove = (e: MouseEvent) => {
    if (this.isDragging) {
      this.selectionPos = e.clientY;
    }
  }

  private onPointerUp = (e: MouseEvent) => {
    this.isDragging = false;
  }
}

const colorPicker = new ColorPicker();
export default colorPicker;