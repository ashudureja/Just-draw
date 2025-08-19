import React, { useRef } from "react";
import { useTool } from "./ToolContext";
import { PiPaletteLight } from "react-icons/pi";

// --- CONFIGURATION CONSTANTS ---
const STROKE_COLOR_OPTIONS = [
  "#000000",
  "#ef4444",
    "#FF00FF",
  "#f97316",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
];

const BACKGROUND_COLOR_OPTIONS = [
  "transparent",


  // --- Neon colors ---
  "#39FF14", // neon green
  "#FF073A", // neon red/pink
  "#00FFFF", // neon cyan
  "#FF6EC7", // neon magenta
  "#FFD700", // neon yellow/gold
  "#FF00FF", // neon fuchsia
];


const STROKE_WIDTH_OPTIONS = [
  { value: 1, label: "Fine" },
  { value: 2, label: "Normal" },
  { value: 3, label: "Bold" },
  { value: 4, label: "Extra Bold" },
  { value: 5, label: "Heavy" },

];

const STROKE_STYLE_OPTIONS = [
  { value: "solid", label: "Solid" },
  { value: "dashed", label: "Dashed" },
  { value: "dotted", label: "Dotted" },
];

// --- SVG ICONS ---
const StrokeWidthIcon = ({ width }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <line
      x1="2"
      y1="12"
      x2="22"
      y2="12"
      strokeWidth={width}
      strokeLinecap="round"
    />
  </svg>
);

const StrokeStyleIcon = ({ style }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <line
      x1="2"
      y1="12"
      x2="22"
      y2="12"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeDasharray={
        style === "dashed" ? "6, 4" : style === "dotted" ? "2, 3" : "none"
      }
    />
  </svg>
);

const PaletteIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM12 10a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm-4 4a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm8 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
  </svg>
);


const Sidebox = () => {
  const { shapes, setShapes, styleshape, setStyleShape,defaultStyle,setDefaultstyle } = useTool();

  // Refs for the hidden color input fields
  const customStrokeColorInputRef = useRef(null);
  const customBackgroundColorInputRef = useRef(null);



  if (!styleshape) return null;


  const updateShape = (updates) => {
    setShapes((prev) =>
      prev.map((shape) =>
        shape.id === styleshape.id ? { ...shape, ...updates } : shape
      )
    );
    setDefaultstyle((prev) => ({ ...prev, ...updates }));
  };

  // Helper function to check if a color is one of the preset options
  const isCustomColor = (color, options) => {
    return !options.includes(color) && color !== "transparent";
  };

  return (
    <div className="absolute top-1/2 -translate-y-1/2 left-4 z-[999] bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-64 flex flex-col gap-4">
      <h3 className="text-sm font-bold text-gray-800 border-b pb-2">
        Styling Options
      </h3>

      {/* --- Stroke Color --- */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 mb-2">
          Stroke Color
        </h4>
        <div className="flex flex-wrap gap-2 items-center">
          {STROKE_COLOR_OPTIONS.map((color) => (
            <button
              key={color}
              onClick={() => updateShape({ stroke: color })}
              aria-label={`Color ${color}`}
              className={`w-5 h-5 rounded-full  transition-transform transform hover:scale-102 focus:outline-none ${
                defaultStyle.stroke === color
                  ? "ring-1 ring-offset-2 ring-[#e0dfff]"
                  : "ring-0"
              }`}
              style={{
                backgroundColor: color,
              }}
            />
          ))}

          <div className="relative w-5 h-5 flex items-center justify-center">
           <PiPaletteLight className="text-3xl" />
            <input
              ref={customStrokeColorInputRef}
              type="color"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => updateShape({ stroke: e.target.value })}
              value={styleshape.stroke}
            />
          </div>
        </div>
      </div>

      {/* --- Background Color --- */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 mb-2">
          Background Color
        </h4>
        <div className="flex flex-wrap gap-2 items-center">
          {BACKGROUND_COLOR_OPTIONS.map((color) => (
            <button
              key={color}
              onClick={() => updateShape({ background: color })}
              aria-label={`Color ${color}`}
              className={`w-5 h-5 rounded-full  transition-transform transform hover:scale-102 focus:outline-none ${
                defaultStyle.background === color
                  ? "ring-1 ring-offset-2 ring-[#e0dfff]"
                  : "ring-0"
              } ${color === "transparent" ? "bg-white" : ""}`}
              style={{
                backgroundColor: color,
              }}
            >
              {color === "transparent" && (
                <div className="w-5 h-5 rounded-full  border border-[#e0dfff]"><svg viewBox="0 0 100 100" className="w-full h-full">
                  <line
                    x1="0"
                    y1="100"
                    x2="100"
                    y2="0"
                    stroke="#ef4444"
                    strokeWidth="5"
                  />
                </svg></div>
              )}
            </button>
          ))}

          <div className="relative w-5 h-5 flex items-center justify-center">
          <PiPaletteLight className="text-3xl" />
            <input
              ref={customStrokeColorInputRef}
              type="color"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => updateShape({ background: e.target.value })}
              value={styleshape.stroke}
            />
          </div>
        </div>
      </div>

      {/* --- Stroke Width --- */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 mb-2">
          Stroke Width
        </h4>
        <div className="flex gap-2 items-center">
          {STROKE_WIDTH_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              title={label}
              onClick={() => updateShape({ strokeWidth: value })}
              className={`p-1 rounded-md transition-colors  ${
                defaultStyle.strokeWidth === value
                  ? "bg-[#e0dfff] text-black"
                  : "bg-[#f6f6f9] text-gray-600 "
              }`}
            >
              <StrokeWidthIcon width={value} />
            </button>
          ))}
        </div>
      </div>

      {/* --- Stroke Style --- */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 mb-2">
          Stroke Style
        </h4>
        <div className="flex gap-2">
          {STROKE_STYLE_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              title={label}
              onClick={() => updateShape({ strokeStyle: value })}
              className={`p-1 rounded-md ${
                defaultStyle.strokeStyle === value
                 ? "bg-[#e0dfff] text-black"
                  : "bg-[#f6f6f9] text-gray-600 "
              }`}
            >
              <StrokeStyleIcon style={value} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebox;
