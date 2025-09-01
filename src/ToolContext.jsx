import React, { createContext, useContext, useState, useRef, useLayoutEffect, useEffect } from "react";

// --- 1. ToolContext.js ---
const ToolContext = createContext();

export const ToolProvider = ({ children }) => {
  const [activeTool, setActiveTool] = useState("select");
  const [shapes, setShapes] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [selectedShape, setSelectedShape] = useState(null);
  const [defaultStyle, setDefaultstyle] = useState({
    stroke: "black",
    background: "transparent",
    strokeWidth: 2,
    strokeStyle: "solid",
  });
  const [styleshape, setStyleShape] = useState();

  // State for history management
  const [history, setHistory] = useState([[]]); // Start with an initial empty canvas state
  const [historyIndex, setHistoryIndex] = useState(0);

  console.log(history)

  // Undo function
  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setShapes(history[newIndex]);
    }
  };

  // Redo function
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setShapes(history[newIndex]);
    }
  };

  // Function to update history with new state
  const updateHistory = (newShapes) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newShapes);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  return (
    <ToolContext.Provider
      value={{
        activeTool,
        setActiveTool,
        shapes,
        setShapes,
        drawing,
        setDrawing,
        selectedShape,
        setSelectedShape,
        defaultStyle,
        setDefaultstyle,
        styleshape,
        setStyleShape,
        // Expose history state and functions
        history,
        setHistory,
        historyIndex,
        setHistoryIndex,
        undo,
        redo,
        updateHistory,
      }}
    >
      {children}
    </ToolContext.Provider>
  );
};

export const useTool = () => useContext(ToolContext);
