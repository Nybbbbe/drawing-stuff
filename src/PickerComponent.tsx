import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import colorPicker from "./ColorPicker";
import './PickerComponent.scss';

colorPicker;

class ColorPickerState {
  currentColor = '';

  constructor() {
      makeAutoObservable(this)
  }

  setNewColor(newColor: string) {
      this.currentColor = newColor;
  }
}

export const colorPickerState = new ColorPickerState();

const PickerComponent = (observer(() => {
  const canvasRef = useRef(null);
    useEffect(() => {
      colorPicker.updateRefs(canvasRef.current! as HTMLCanvasElement);
    }, [])

    return (
      <div id="pickerContainer">
        <canvas id="picker-canvas" ref={canvasRef}></canvas>
        <div>
          <h2>Current color:</h2>
          <p>{colorPickerState.currentColor}</p>
          <div className="show-color-div" style={{backgroundColor: colorPickerState.currentColor}}></div>
        </div>
      </div>
    )
  })
)

export default PickerComponent;