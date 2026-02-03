import * as React from "react";
import { cn } from "@/lib/utils";

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Material Symbol name (e.g. "home", "add", "expand_more") */
  name: string;
  /** Size in CSS (e.g. 24, "1.5rem") */
  size?: number | string;
}

const Icon = React.forwardRef<HTMLSpanElement, IconProps>(
  ({ className, name, size = 24, style, ...props }, ref) => {
    const sizeStyle =
      typeof size === "number"
        ? { fontSize: `${size}px`, width: size, height: size }
        : { fontSize: size, width: size, height: size };

    return (
      <span
        ref={ref}
        className={cn("material-symbols-outlined inline-block shrink-0", className)}
        style={{ ...sizeStyle, ...style }}
        aria-hidden
        {...props}
      >
        {name}
      </span>
    );
  }
);
Icon.displayName = "Icon";

export { Icon };
