import { useEffect, useRef } from "react";
import ColorPaletteComponent from "./ColorPaletteComponent";
import drawing from "./Drawings";

const DrawingComponent = () => {
  const drawingCanvasRef = useRef(null);

  useEffect(() => {
    drawing.updateRefs(drawingCanvasRef.current! as HTMLCanvasElement);
  }, [])
  
  return (
    <>
    <div className="canvas-wrapper">
      <canvas id="drawing-canvas" ref={drawingCanvasRef}></canvas>
    </div>
    < ColorPaletteComponent/>
    </>
  )
}

export default DrawingComponent;