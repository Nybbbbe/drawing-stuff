import { useState } from "react"
import { toastError } from "../../../Notifications";
import drawing from "../Drawings";
import { readyTools, Tools } from "./ToolTypes";

const DrawToolComponent = () => {
  const [activeTool, setActiveTool] = useState<Tools | undefined>(undefined);

  const activateDrawTool = (tool: Tools) => {
    if (activeTool === tool) {
      setActiveTool(undefined);
      drawing.activateTool(undefined);
      return;
    }
    if (readyTools.includes(tool)) {
      setActiveTool(tool);
      drawing.activateTool(tool);
    } else {
      toastError(`Tool ${tool} is not ready!`)
    }
  }

  return (
    <div>
      <h1>Draw:</h1>
      <div className="tool-wrapper">
        <div>
          <button onClick={() => activateDrawTool(Tools.DRAW_FREE)}
          className={activeTool === Tools.DRAW_FREE? 'active' : ''}>Free</button>
          <div className="divider-horizontal-m"></div>
          <button onClick={() => activateDrawTool(Tools.DRAW_LINE)}
          className={activeTool === Tools.DRAW_LINE? 'active' : ''}>Line</button>
        </div>
        <div>
          <button onClick={() => activateDrawTool(Tools.DRAW_RECT)}
          className={activeTool === Tools.DRAW_RECT? 'active' : ''}>Rectangle</button>
          <div className="divider-horizontal-m"></div>
          <button onClick={() => activateDrawTool(Tools.DRAW_CIRCLE)}
          className={activeTool === Tools.DRAW_CIRCLE? 'active' : ''}>Cirlcle</button>
        </div>
      </div>
    </div>
  )
}

export default DrawToolComponent;