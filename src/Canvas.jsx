import React, { useRef, useLayoutEffect, useEffect, useState } from "react";
import { useTool } from "./ToolContext";


const createImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

const generateShape = (id, x1, y1, x2, y2, type, defaultStyle, options = {}) => {
  switch (type) {
    case "line":
    case "rectangle":
    case "diamond":
    case "circle":
    case "arrow":
      return { id, x1, y1, x2, y2, type, ...defaultStyle };
    case "pencil":
      return { id, type, points: [{ x: x1, y: y1 }], ...defaultStyle };
    case "text":

      return {
        id,
        type,
        x1,
        y1,
        x2: x2 || x1 + 100, 
        y2: y2 || y1 + 24,  
        text: options.text || "",
        ...defaultStyle,
        fontSize: options.fontSize || 24,
        fontFamily: options.fontFamily || "sans-serif",
      };
    case "image":
      return {
        id,
        type,
        x1,
        y1,
        x2,
        y2,
        ...defaultStyle,
        image: options.image,
      };
    default:
      return null;
  }
};

const distance = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

const Canvas = () => {
  const {
    activeTool,
    setActiveTool,
    shapes,
    setShapes,
    drawing,
    setDrawing,
    selectedShape,
    setSelectedShape,
    defaultStyle,
    setStyleShape,
    undo,
    redo,
    updateHistory,
  } = useTool();
  
  const canvasRef = useRef(null);
  const imageInputRef = useRef(null);
  const textAreaRef = useRef(null);
  

  const [action, setAction] = useState("none");
  const [writingElement, setWritingElement] = useState(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        event.preventDefault();
        undo();
      }
      if ((event.ctrlKey || event.metaKey) && event.key === 'y') {
        event.preventDefault();
        redo();
      }
      if (event.key === 'Escape' && action === "writing") {
        finishTextEditing();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, action]);

  // Auto-focus textarea when writing starts (like reference code)
  useEffect(() => {
    if (action === "writing" && textAreaRef.current && writingElement) {
      setTimeout(() => {
        textAreaRef.current.focus();
        textAreaRef.current.value = writingElement.text || "";
      }, 0);
    }
  }, [action, writingElement]);

  useEffect(() => {
    if (activeTool === "image") {
      imageInputRef.current.click();
    }
  }, [activeTool]);

  
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.textBaseline = "top";

    shapes?.forEach((shape) => {
      
      if (action === "writing" && writingElement && writingElement.id === shape.id) {
        return;
      }

      context.strokeStyle = shape.stroke || "black";
      context.lineWidth = shape.strokeWidth || 2;
      context.fillStyle = shape.background || "transparent";

      if (shape.strokeStyle === "dashed") context.setLineDash([8, 4]);
      else if (shape.strokeStyle === "dotted") context.setLineDash([2, 6]);
      else context.setLineDash([]);

      const width = shape.x2 - shape.x1;
      const height = shape.y2 - shape.y1;
      const centerX = shape.x1 + width / 2;
      const centerY = shape.y1 + height / 2;

      switch (shape.type) {
        case "line":
          context.beginPath();
          context.moveTo(shape.x1, shape.y1);
          context.lineTo(shape.x2, shape.y2);
          context.stroke();
          break;
        case "rectangle":
          if (shape.background && shape.background !== "transparent") 
            context.fillRect(shape.x1, shape.y1, width, height);
          context.strokeRect(shape.x1, shape.y1, width, height);
          break;
        case "diamond":
          context.beginPath();
          context.moveTo(centerX, shape.y1);
          context.lineTo(shape.x2, centerY);
          context.lineTo(centerX, shape.y2);
          context.lineTo(shape.x1, centerY);
          context.closePath();
          if (shape.background && shape.background !== "transparent") context.fill();
          context.stroke();
          break;
        case "circle":
          context.beginPath();
          const radius = Math.sqrt(width ** 2 + height ** 2) / 2;
          context.arc(centerX, centerY, radius, 0, Math.PI * 2);
          if (shape.background && shape.background !== "transparent") context.fill();
          context.stroke();
          break;
        case "arrow":
          context.beginPath();
          context.moveTo(shape.x1, shape.y1);
          context.lineTo(shape.x2, shape.y2);
          const headLength = 15;
          const angle = Math.atan2(shape.y2 - shape.y1, shape.x2 - shape.x1);
          context.moveTo(shape.x2, shape.y2);
          context.lineTo(shape.x2 - headLength * Math.cos(angle - Math.PI / 6), 
                        shape.y2 - headLength * Math.sin(angle - Math.PI / 6));
          context.moveTo(shape.x2, shape.y2);
          context.lineTo(shape.x2 - headLength * Math.cos(angle + Math.PI / 6), 
                        shape.y2 - headLength * Math.sin(angle + Math.PI / 6));
          context.stroke();
          break;
        case "pencil":
          context.beginPath();
          if (shape.points.length > 1) {
            context.moveTo(shape.points[0].x, shape.points[0].y);
            for (let i = 1; i < shape.points.length; i++) {
              context.lineTo(shape.points[i].x, shape.points[i].y);
            }
            context.stroke();
          }
          break;
        case "text":
         
          context.font = `${shape.fontSize || 24}px ${shape.fontFamily || "sans-serif"}`;
          context.fillStyle = shape.stroke || "black";
          const lines = (shape.text || "").split('\n');
          lines.forEach((line, index) => {
            context.fillText(line, shape.x1, shape.y1 + (index * (shape.fontSize || 24) * 1.2));
          });
          break;
        case "image":
          if (shape.image && shape.image.complete) {
            context.drawImage(shape.image, shape.x1, shape.y1, width, height);
          }
          break;
        default: 
          break;
      }
    });
    context.setLineDash([]);
  }, [shapes, action, writingElement]);

  const selectionChecker = (x, y) => {
    const context = canvasRef.current.getContext("2d");
    for (let i = shapes.length - 1; i >= 0; i--) {
      const shape = shapes[i];
      const { x1, y1, x2, y2 } = shape;
      
      if (shape.type === "rectangle" || shape.type === "diamond" || shape.type === "circle" || shape.type === "image") {
        if (x >= Math.min(x1, x2) && x <= Math.max(x1, x2) && 
            y >= Math.min(y1, y2) && y <= Math.max(y1, y2)) return shape;
      } else if (shape.type === "line" || shape.type === "arrow") {
        const dist = Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1) / distance(x1, y1, x2, y2);
        if (dist < 5) return shape;
      } else if (shape.type === "pencil") {
        const nearPoint = shape.points.some(p => distance(x, y, p.x, p.y) < 5);
        if (nearPoint) return shape;
      } else if (shape.type === "text") {
       
        if (x >= x1 && x <= x2 && y >= y1 && y <= y2) return shape;
      }
    }
    return null;
  };

  
  const updateElement = (id, x1, y1, x2, y2, type, options = {}) => {
    const newShapes = [...shapes];
    const index = newShapes.findIndex(shape => shape.id === id);
    
    if (index !== -1) {
      if (type === "text") {
       
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.font = `${options.fontSize || 24}px ${options.fontFamily || "sans-serif"}`;
        const textWidth = context.measureText(options.text || "").width;
        const textHeight = options.fontSize || 24;
        
        newShapes[index] = {
          ...newShapes[index],
          x1,
          y1,
          x2: x1 + Math.max(textWidth, 20), 
          y2: y1 + textHeight,
          text: options.text || "",
          fontSize: options.fontSize || 24,
          fontFamily: options.fontFamily || "sans-serif",
        };
      } else {
        newShapes[index] = { ...newShapes[index], x1, y1, x2, y2 };
      }
      setShapes(newShapes);
    }
  };

  const finishTextEditing = () => {
    if (action === "writing" && writingElement) {
      updateHistory(shapes);
      setAction("none");
      setWritingElement(null);
      setActiveTool("select");
    }
  };

  const handleMouseDown = (e) => {
    if (action === "writing") return; 

    const { clientX, clientY } = e;
    const { top, left } = canvasRef.current.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;

    if (activeTool === "select") {
      const selectedElement = selectionChecker(x, y);
      if (selectedElement) {
        if (selectedElement.type === "text") {
          
          setAction("writing");
          setWritingElement(selectedElement);
          return;
        }
        const offsetX = x - selectedElement.x1;
        const offsetY = y - selectedElement.y1;
        setSelectedShape({ ...selectedElement, offsetX, offsetY });
        setStyleShape(selectedElement);
        setDrawing(true);
      }
    } else if (activeTool === "eraser") {
      const selectedElement = selectionChecker(x, y);
      if (selectedElement) {
        const newShapes = shapes.filter((s) => s.id !== selectedElement.id);
        setShapes(newShapes);
        updateHistory(newShapes);
      }
    } else if (activeTool === 'text') {
      
      const id = Date.now();
      const newShape = generateShape(id, x, y, x + 100, y + 24, "text", defaultStyle, { text: "" });
      setShapes(prev => [...prev, newShape]);
      setAction("writing");
      setWritingElement(newShape);
      setDrawing(false);
    } else {
      setDrawing(true);
      const id = Date.now();
      const newShape = generateShape(id, x, y, x, y, activeTool, defaultStyle);
      if (newShape) {
        setShapes((prev) => [...prev, newShape]);
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!drawing || action === "writing") return;
    
    const { clientX, clientY } = e;
    const { top, left } = canvasRef.current.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;

    if (selectedShape && activeTool === "select") {
      const { id, offsetX, offsetY } = selectedShape;
      const newShapes = shapes.map((shape) => {
        if (shape.id === id) {
          const newX1 = x - offsetX;
          const newY1 = y - offsetY;
          if (shape.type === 'pencil') {
            const dx = newX1 - shape.points[0].x;
            const dy = newY1 - shape.points[0].y;
            return { ...shape, points: shape.points.map(p => ({ x: p.x + dx, y: p.y + dy })) };
          }
          if (shape.type === 'text') {
            const width = shape.x2 - shape.x1;
            const height = shape.y2 - shape.y1;
            return { ...shape, x1: newX1, y1: newY1, x2: newX1 + width, y2: newY1 + height };
          }
          const width = shape.x2 - shape.x1;
          const height = shape.y2 - shape.y1;
          return { ...shape, x1: newX1, y1: newY1, x2: newX1 + width, y2: newY1 + height };
        }
        return shape;
      });
      setShapes(newShapes);
    } else if (drawing && activeTool !== "select" && activeTool !== "eraser" && activeTool !== "text") {
      const currentShape = shapes[shapes.length - 1];
      const newShapes = [...shapes];
      if (currentShape.type === "pencil") {
        newShapes[shapes.length - 1] = { ...currentShape, points: [...currentShape.points, { x, y }] };
      } else {
        newShapes[shapes.length - 1] = { ...currentShape, x2: x, y2: y };
      }
      setShapes(newShapes);
      setStyleShape(shapes[shapes.length - 1]);
    }
  };

  const handleMouseUp = () => {
    if (action === "writing") return; 
    
    if (drawing) {
      updateHistory(shapes);
    }
    if (activeTool !== "eraser" && activeTool !== "pencil" && activeTool !== "text") {
      setActiveTool("select");
    }
    setDrawing(false);
    setSelectedShape();
  };


  const handleTextBlur = (event) => {
    if (writingElement && action === "writing") {
      const newText = event.target.value;
      updateElement(writingElement.id, writingElement.x1, writingElement.y1, null, null, "text", {
        text: newText,
        fontSize: writingElement.fontSize,
        fontFamily: writingElement.fontFamily,
      });
      finishTextEditing();
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const img = await createImage(event.target.result);
          const id = Date.now();
          const aspectRatio = img.width / img.height;
          const newWidth = 400;
          const newHeight = newWidth / aspectRatio;
          const x = (canvasRef.current.width - newWidth) / 2;
          const y = (canvasRef.current.height - newHeight) / 2;

          const newShape = generateShape(id, x, y, x + newWidth, y + newHeight, "image", defaultStyle, { image: img });
          const newShapes = [...shapes, newShape];
          setShapes(newShapes);
          updateHistory(newShapes);
        } catch (error) {
          console.error("Error loading image:", error);
        }
      };
      reader.readAsDataURL(file);
    }
    setActiveTool("select");
    e.target.value = null;
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ position: "absolute", background: "#FDF6E9", zIndex: 1 }}
      />

    <div className="absolute flex bottom-4 space-x-2 right-5 z-10" >
       <div className="flex flex-col items-center justify-center"> <button onClick={()=>undo()} className=" bg-white rounded-sm border shadow-lg  cursor-pointer px-3 py-1">Undo </button>
       <h5 className="text-[8px] mt-1 hidden lg:block">CTRL+Z</h5></div>
       <div className="flex flex-col items-center justify-center"> <button onClick={()=>redo()} className=" bg-white border shadow-lg  cursor-pointer px-3 py-1 rounded-sm">Redo </button>
       <h5 className="text-[8px] mt-1 hidden lg:block">CTRL+Y</h5></div>
    </div>
      
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        style={{ display: "none" }}
      />
      
     
      {action === "writing" && writingElement && (
        <textarea
          ref={textAreaRef}
          onBlur={handleTextBlur}
          style={{
            position: "absolute", 
            top: writingElement.y1 - 2,
            left: writingElement.x1,
            font: `${writingElement.fontSize || 24}px ${writingElement.fontFamily || "sans-serif"}`,
            margin: 0,
            padding: 0,
            border: "1px dashed #007bff",
            outline: 0,
            resize: "auto",
            overflow: "hidden",
            whiteSpace: "pre",
            background: "rgba(255, 255, 255, 0.9)",
            zIndex: 1000,
            minWidth: "50px",
            minHeight: `${writingElement.fontSize || 24}px`,
          }}
        />
      )}
    </>
  );
};

export default Canvas;