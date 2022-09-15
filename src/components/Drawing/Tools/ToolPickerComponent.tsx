import { useState } from "react";
import { capitalizeString } from "../../../utils";
import DrawToolComponent from "./DrawToolComponent";
import SelectToolComponent from "./SelectToolComponent";
import './Tools.scss';

export const tools = [
  'draw',
  'select'
]

const ToolPickerComponent = () => {
  const [toolPicked, setToolPicked] = useState('');

  return (
    <div className="tool-picker-wrapper">
      {tools.map(tool => {
        return (
          <button key={tool} onClick={() => setToolPicked(tool)}>{capitalizeString(tool)}</button>
        )
      })}
      {toolPicked === 'draw' &&
        < DrawToolComponent/>
      }
      {toolPicked === 'select' &&
        < SelectToolComponent/>
      }
    </div>
  )
}

export default ToolPickerComponent;