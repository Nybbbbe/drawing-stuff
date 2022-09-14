import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import colorPicker, { ChosenColor } from "./ColorPicker";
import colorPicker2 from "./ColorPicker2";
import './PickerComponent.scss';

colorPicker;
colorPicker2;

class ColorPickerState {
  currentChosenColor: string= '';
  currentFinalColor: string = '';

  constructor() {
      makeAutoObservable(this)
  }

  setNewChosenColor(newChosenColor: string) {
      this.currentChosenColor = newChosenColor;
  }

  setNewFinalColor(newFinalColor: string) {
    this.currentFinalColor = newFinalColor;
}
}

export const colorPickerState = new ColorPickerState();

const PickerComponent = (observer(() => {
  const canvasRef = useRef(null);
  const canvasRef2 = useRef(null);

  useEffect(() => {
    colorPicker.updateRefs(canvasRef.current! as HTMLCanvasElement);
    colorPicker2.updateRefs(canvasRef2.current! as HTMLCanvasElement);
  }, [])

  return (
    <div id="pickerContainer">
      <div className="canvas-wrapper">
        <canvas id="picker-canvas" ref={canvasRef}></canvas>
      </div>
      <div>
        <h2>Current color:</h2>
        <p>{colorPickerState.currentChosenColor}</p>
        <div className="show-color-div" style={{backgroundColor: colorPickerState.currentChosenColor}}></div>
        <div className="canvas-wrapper">
          <canvas id="picker-canvas-2" ref={canvasRef2}></canvas>
        </div>
        <div className="show-color-div" style={{backgroundColor: colorPickerState.currentFinalColor}}></div>
      </div>
    </div>
  ) 
}))

export default PickerComponent;