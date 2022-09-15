export enum Tools {
  DRAW_FREE = 'draw-free',
  DRAW_LINE = 'draw-line',
  DRAW_RECT = 'draw-rect',
  DRAW_CIRCLE = 'draw-cirlce'
}

export const readyTools = [
  Tools.DRAW_RECT,
  Tools.DRAW_FREE
]

export class Tool {
  constructor() {}
  public draw = (ctx: CanvasRenderingContext2D): void => {
    console.log("Draw not implemented");
  }
  public terminate = (): void => {
    console.log("Terminate not implemented");
  }
}