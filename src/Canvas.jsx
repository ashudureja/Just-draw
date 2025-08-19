import React, { useRef, useLayoutEffect } from "react";
import { useTool } from "./ToolContext";
import { CoinsIcon } from "lucide-react";

// Create simple shape object without roughjs
const generateShape = (id, x1, y1, x2, y2, type, defaultStyle) => {
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
        text: "",
        fontSize: 24,
        fontFamily: "sans-serif",
        ...defaultStyle,
      };
    case "image":
      return {
        id,
        type,
        x1,
        y1,
        x2: x1 + 100,
        y2: y1 + 100,
        src: "",
        ...defaultStyle,
      };
    default:
      return null;
  }
};

const distance = (x1, y1, x2, y2) =>
  Math.abs(Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2));

const Canvas = () => {
  const {
    activeTool,
    shapes,
    setShapes,
    drawing,
    setDrawing,
    selectedShape,
    setSelectedShape,
    defaultStyle,
    setDefaultstyle,
  } = useTool();
  const canvasRef = useRef(null);

  // Render shapes
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    shapes?.forEach((shape) => {
      // Apply stroke settings
      context.strokeStyle = shape.stroke || "black";
      context.lineWidth = shape.strokeWidth || 2;
      context.fillStyle = shape.background || "transparent";

      if (shape.strokeStyle === "dashed") {
        context.setLineDash([8, 4]); // pattern for dashed
      } else if (shape.strokeStyle === "dotted") {
        context.setLineDash([2, 6]); // pattern for dotted
      } else {
        context.setLineDash([]); // solid
      }

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
          if (shape.background && shape.background !== "transparent" && width > 0 && height > 0) {
            context.fillRect(shape.x1, shape.y1, width, height);
          }
          context.strokeRect(shape.x1, shape.y1, width, height);
          break;

        case "diamond":
          context.beginPath();
          context.moveTo(centerX, shape.y1);
          context.lineTo(shape.x2, centerY);
          context.lineTo(centerX, shape.y2);
          context.lineTo(shape.x1, centerY);
          context.closePath();
          if (shape.background && shape.background !== "transparent" && width > 0 && height > 0) {
            context.fill();
          }
          context.stroke();
          break;

        case "circle":
          context.beginPath();
          const radius = Math.sqrt(width * width + height * height) / 2;
          context.arc(centerX, centerY, radius, 0, Math.PI * 2);
          if (shape.background && shape.background !== "transparent" && width > 0 && height > 0) {
            context.fill();
          }
          context.stroke();
          break;

        case "arrow":
          context.beginPath();
          // Arrow line
          context.moveTo(shape.x1, shape.y1);
          context.lineTo(shape.x2, shape.y2);

          // Arrow head
          const headLength = 15;
          const angle = Math.atan2(shape.y2 - shape.y1, shape.x2 - shape.x1);

          context.moveTo(shape.x2, shape.y2);
          context.lineTo(
            shape.x2 - headLength * Math.cos(angle - Math.PI / 6),
            shape.y2 - headLength * Math.sin(angle - Math.PI / 6)
          );

          context.moveTo(shape.x2, shape.y2);
          context.lineTo(
            shape.x2 - headLength * Math.cos(angle + Math.PI / 6),
            shape.y2 - headLength * Math.sin(angle + Math.PI / 6)
          );
          context.stroke();
          break;

        case "pencil":
          context.beginPath();
          const points = shape.points;
          if (points.length > 1) {
            context.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
              context.lineTo(points[i].x, points[i].y);
            }
            context.stroke();
          }
          break;

        case "text":
          context.font = `${shape.fontSize || 24}px ${
            shape.fontFamily || "sans-serif"
          }`;
          context.fillStyle = shape.stroke || "black";
          context.fillText(shape.text || "Text", shape.x1, shape.y1);
          break;

        case "image":
          if (shape.src) {
            const img = new Image();
            img.onload = () => {
              context.drawImage(img, shape.x1, shape.y1, width, height);
            };
            img.src = shape.src;
          } else {
            // Placeholder for image
            context.strokeRect(shape.x1, shape.y1, width, height);
            context.fillStyle = "#f0f0f0";
            context.fillRect(shape.x1, shape.y1, width, height);
            context.fillStyle = "#999";
            context.font = "12px sans-serif";
            context.fillText("Image", shape.x1 + 10, shape.y1 + 20);
          }
          break;

        default:
          break;
      }
    });

    // Reset dash after drawing
    context.setLineDash([]);
  }, [shapes]);

  const selectionChecker = (x, y) => {
    for (let shape of shapes) {
      if (shape.type === "rectangle") {
        console.log("rectangle", shape);
        const { x1, x2, y1, y2 } = shape;
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);

        if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
          return shape;
        }
      }
      if (shape.type === "diamond") {
        console.log("diamond", shape);
        const { x1, x2, y1, y2 } = shape;
        const width = shape.x2 - shape.x1;
        const height = shape.y2 - shape.y1;
        const centerX = shape.x1 + width / 2;
        const centerY = shape.y1 + height / 2;
        const dx = Math.abs(x - centerX);
        const dy = Math.abs(y - centerY);
        if (dx / (width / 2) + dy / (height / 2) <= 1) {
          return shape;
        }
      }
      if (shape.type === "circle") {
        const { x1, x2, y1, y2 } = shape;
        const width = shape.x2 - shape.x1;
        const height = shape.y2 - shape.y1;
        const centerX = shape.x1 + width / 2;
        const centerY = shape.y1 + height / 2;
        const radius = Math.abs((x2 - x1) / 2);
        const dist = distance(x, y, centerX, centerY);
        if (dist <= radius) {
          return shape;
        }
      }
      if (shape.type === "line" || shape.type==="arrow") {
        const { x1, x2, y1, y2 } = shape;
        const distAB = distance(x1, y1, x2, y2);
        const distAC = distance(x1, y1, x, y);
        const distBC = distance(x, y, x2, y2);
        const margin = 1; //bcoz float values will give problem fr distance to be exact zero(ab cancels with ac and cb) therefore we are giving margin of 1
        if (Math.abs(distAB - (distAC + distBC)) < margin) {
          return shape;
        }
      }
      if (shape.type === "pencil") {
        const { points } = shape;
        const verify = points.find((obj) => {
      //find will return first instance it will get and return it, here we can also see is pont lies inide line point array for not but i wont be pixel perfect therefore we are using distance techniqu with some margin
      const margin=5
          const dist=distance(x,y,obj.x,obj.y)
          return dist < margin; // within 5px radius (margin)
        });

        
        if (verify) return shape;
      }
    }
    return null;
  };

 const handleMouseDown = (e) => {
  const canvas = canvasRef.current;
  const { top, left } = canvas.getBoundingClientRect();
  const x = e.clientX - left;
  const y = e.clientY - top;

  if (activeTool === "select") {
    const selectedElement = selectionChecker(x, y);
    if (selectedElement) {
      let offsetX, offsetY;
      if (selectedElement.type === "pencil") {
        offsetX = x - selectedElement.points[0].x;
        offsetY = y - selectedElement.points[0].y;
      } else {
        offsetX = x - selectedElement.x1;
        offsetY = y - selectedElement.y1;
      }
      setSelectedShape({ ...selectedElement, offsetX, offsetY });
    }
  } else {
    setDrawing(true);
    const id = Date.now();
    const newShape = generateShape(id, x, y, x, y, activeTool, defaultStyle);
    if (newShape) setShapes((prev) => [...prev, newShape]);
  }
};

 const handleMouseMove = (e) => {
  const canvas = canvasRef.current;
  const { top, left } = canvas.getBoundingClientRect();
  const x = e.clientX - left;
  const y = e.clientY - top;

  if (selectedShape && activeTool === "select") {
    setShapes((prev) =>
      prev.map((shape) => {
        if (shape.id !== selectedShape.id) return shape;

        const moveX = x - selectedShape.offsetX;
        const moveY = y - selectedShape.offsetY;

        if (shape.type === "pencil") {
          const firstPoint = shape.points[0];
          const dx = moveX - firstPoint.x;
          const dy = moveY - firstPoint.y;
          return {
            ...shape,
            points: shape.points.map((p) => ({
              x: p.x + dx,
              y: p.y + dy,
            })),
          };
        } else {
          const width = shape.x2 - shape.x1;
          const height = shape.y2 - shape.y1;
          return {
            ...shape,
            x1: moveX,
            y1: moveY,
            x2: moveX + width,
            y2: moveY + height,
          };
        }
      })
    );
  } else if (drawing) {
    const index = shapes.length - 1;
    const currentShape = shapes[index];
    if (!currentShape) return;

    const shapesCopy = [...shapes];
    if (currentShape.type === "pencil") {
      shapesCopy[index] = {
        ...currentShape,
        points: [...currentShape.points, { x, y }],
      };
    } else {
      shapesCopy[index] = { ...currentShape, x2: x, y2: y };
    }
    setShapes(shapesCopy);
  }
};


  const handleMouseUp = () => {
    setDrawing(false);
    setSelectedShape();
  };

  console.log(shapes);
  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ position: "absolute", background: "white", zIndex: 1 }}
    />
  );
};

export default Canvas;
