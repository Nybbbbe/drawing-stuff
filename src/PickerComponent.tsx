import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import colorPicker, { ChosenColor } from "./ColorPicker";
import './PickerComponent.scss';

colorPicker;

class ColorPickerState {
  currentChosenColor: ChosenColor = {
    colorString: ``,
    lockedRGB: '',
    lockedNum: 0
  }

  constructor() {
      makeAutoObservable(this)
  }

  setNewChosenColor(newChosenColor: ChosenColor) {
      this.currentChosenColor = newChosenColor;
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
          <p>{colorPickerState.currentChosenColor.colorString}</p>
          <div className="show-color-div" style={{backgroundColor: colorPickerState.currentChosenColor.colorString}}></div>
        </div>
      </div>
    )
  })
)

export default PickerComponent;