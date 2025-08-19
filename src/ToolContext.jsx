
import { createContext, useContext, useState } from "react";

const ToolContext = createContext();

export const ToolProvider = ({ children }) => {
  const [activeTool, setActiveTool] = useState("select");
  const[shapes,setShapes]=useState([])
  const [drawing,setDrawing]=useState(false)
  const [selectedShape,setSelectedShape]=useState()
  const [defaultStyle,setDefaultstyle]=useState({
  stroke: "black",
  background: "transparent",

  strokeWidth: 2,
  strokeStyle: "solid", 

})
const [styleshape,setStyleShape]=useState()

  return (
    <ToolContext.Provider value={{ activeTool, setActiveTool,shapes,setShapes ,drawing,setDrawing,selectedShape,setSelectedShape,defaultStyle,setDefaultstyle,styleshape,setStyleShape}}>
      {children}
    </ToolContext.Provider>
  );
};

export const useTool = () => useContext(ToolContext);
