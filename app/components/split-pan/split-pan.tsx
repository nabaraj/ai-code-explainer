import React, { ReactElement, useEffect, useRef, useState } from "react";
import "./pan.css";
type SplitPanProps = {
  orientation?: "horizontal" | "vertical";
  leftTopContent?: string | ReactElement;
  rightBottomContent?: string | ReactElement;
  leftTitle?: string | ReactElement;
  rightTitle?: string | ReactElement;
};

export const SplitPan: React.FC<SplitPanProps> = ({
  orientation = "horizontal",
  leftTopContent = "",
  rightBottomContent = "",
  leftTitle = "",
  rightTitle = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);

  const isDraggingRef = useRef(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current || !containerRef.current || !leftRef.current)
      return;

    const rect = containerRef.current.getBoundingClientRect();

    if (orientation === "horizontal") {
      const newWidth = e.clientX - rect.left;

      // min/max (example)
      if (newWidth < 100 || newWidth > rect.width - 100) return;

      leftRef.current.style.width = `${newWidth}px`;
    } else {
      const newHeight = e.clientY - rect.top;

      if (newHeight < 100 || newHeight > rect.height - 100) return;

      leftRef.current.style.height = `${newHeight}px`;
    }
  };

  const handleMouseDown = () => {
    isDraggingRef.current = true;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div
      className="panel-container flex h-[70vh]"
      ref={containerRef}
      style={{
        display: orientation === "horizontal" ? "flex" : "block",
        // height: "100vh",
      }}
    >
      <div
        ref={leftRef}
        className="bg-white dark:bg-zinc-900 border border-zinc-300 rounded-xl shadow-sm flex flex-col"
        style={{
          width: orientation === "horizontal" ? "50%" : "100%",
          height: orientation === "vertical" ? "50%" : "100%",
        }}
      >
        {leftTitle}
        {leftTopContent ? leftTopContent : "Left"}
      </div>

      <div
        className="divider w-[5px] bg-zinc-300 cursor-col-resize"
        onMouseDown={handleMouseDown}
        style={{
          width: orientation === "horizontal" ? "5px" : "100%",
          height: orientation === "vertical" ? "5px" : "100%",
          cursor: orientation === "horizontal" ? "col-resize" : "row-resize",
        }}
      />

      <div
        style={{ flex: 1 }}
        className="bg-white dark:bg-zinc-900 border border-zinc-300 rounded-xl shadow-sm flex flex-col"
      >
        {rightTitle}
        {rightBottomContent ? rightBottomContent : "Right"}
      </div>
    </div>
  );
};
