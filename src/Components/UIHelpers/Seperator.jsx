import React from "react";

const Separator = ({ orientation = "horizontal", className = "" }) => {
  return (
    <div
      className={`shrink-0 bg-gray-300 ${
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]"
      } ${className}`}
      role="separator"
      aria-orientation={orientation}
    />
  );
};

export { Separator };
