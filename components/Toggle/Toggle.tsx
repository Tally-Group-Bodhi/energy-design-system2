import React from "react";
import { cn } from "@/lib/utils";

export interface ToggleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, pressed, onPressedChange, ...props }, ref) => {
    const [internalPressed, setInternalPressed] = React.useState(pressed || false);
    const isPressed = pressed !== undefined ? pressed : internalPressed;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const newPressed = !isPressed;
      setInternalPressed(newPressed);
      onPressedChange?.(newPressed);
      props.onClick?.(e);
    };

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-pressed={isPressed}
        data-state={isPressed ? "on" : "off"}
        className={cn(
          "inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2C365D] focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          isPressed
            ? "bg-[#2C365D] text-white hover:bg-[#1e2840]"
            : "bg-transparent text-gray-900 hover:bg-gray-100",
          className
        )}
        onClick={handleClick}
        {...props}
      />
    );
  }
);
Toggle.displayName = "Toggle";

export default Toggle;

