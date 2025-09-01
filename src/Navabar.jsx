import React from "react";
import { useTool } from "./ToolContext";
import {
  Lock, Hand, MousePointer2, Square, Diamond, Circle, ArrowRight,
  Minus, Pencil, Type, Image as ImageIcon, Eraser, Shapes
} from "lucide-react";

const ToolButton = ({ icon: Icon, shortcut, isActive, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative flex h-10 w-10 items-center justify-center rounded-md transition-colors ${
      isActive
        ? "bg-violet-100 text-violet-600"
        : "text-gray-700 hover:bg-gray-100"
    }`}
  >
    <Icon size={16} />
    {shortcut && (
      <span className="absolute bottom-1 right-1 text-[10px] text-gray-400">
        {shortcut}
      </span>
    )}
  </button>
);

const Navbar = () => {
  const { activeTool, setActiveTool } = useTool();

  const tools = [
    { id: "select", icon: MousePointer2, shortcut: "1" },
    { id: "rectangle", icon: Square, shortcut: "2" },
    { id: "diamond", icon: Diamond, shortcut: "3" },
    { id: "circle", icon: Circle, shortcut: "4" },
    { id: "arrow", icon: ArrowRight, shortcut: "5" },
    { id: "line", icon: Minus, shortcut: "6" },
    { id: "pencil", icon: Pencil, shortcut: "7" },
    { id: "text", icon: Type, shortcut: "8" },
    { id: "image", icon: ImageIcon, shortcut: "9" },
    { id: "eraser", icon: Eraser, shortcut: "0" },
  ];

  return (
    <div className="w-full flex items-center fixed z-[999] justify-between p-4">
      <div></div>
      <nav className="flex items-center gap-1 rounded-lg bg-white p-1 shadow-lg border border-black/50">
        <ToolButton icon={Lock} />
        <ToolButton icon={Hand} />
        <div className="mx-1 h-6 w-px bg-gray-200" />
        {tools.map((tool) => (
          <ToolButton
            key={tool.id}
            icon={tool.icon}
            shortcut={tool.shortcut}
            isActive={activeTool === tool.id}
            onClick={() => setActiveTool(tool.id)}
          />
        ))}
        <div className="mx-1 h-6 w-px bg-gray-200" />
        <ToolButton icon={Shapes} />
      </nav>
      <button className="bg-blue-500 text-white rounded-md hover:bg-blue-600">
       
      </button>
    </div>
  );
};

export default Navbar;
