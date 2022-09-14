import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";
import './Drawings.scss';

class ColorPaletteState {
  currentColorPalette: string[] = [];
  selectedColor: string = ''

  constructor() {
      makeAutoObservable(this)
  }

  setNewChosenColor(newSelectedColor: string) {
      this.selectedColor = newSelectedColor;
  }

  addColorToPalette(newColor: string) {
    this.currentColorPalette = [...this.currentColorPalette, newColor];
  }
}

export const colorPaletteState = new ColorPaletteState();

const ColorPaletteComponent = observer(() => {
  const selectColor = (color: string) => {
    colorPaletteState.setNewChosenColor(color);
  }

  return (
    <div className="color-palette-wrapper">
      {colorPaletteState.currentColorPalette.map(color => {
        return (
          <div className="show-color-div" onClick={() => selectColor(color)} style={{backgroundColor: color}}></div>
        )
      })}
    </div>
  )
});

export default ColorPaletteComponent;