import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "success"
    | "warning"
    | "error"
    | "info";
  size?: "sm" | "md" | "lg" | "icon";
  fullWidth?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  disabled,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary:
      "bg-[#2C365D] text-white hover:bg-[#1e2840] focus:ring-[#2C365D]",
    secondary:
      "bg-[#00D2A2] text-white hover:bg-[#00b890] focus:ring-[#00D2A2]",
    outline:
      "border-2 border-[#2C365D] text-[#2C365D] bg-transparent hover:bg-[#2C365D] hover:text-white focus:ring-[#2C365D]",
    ghost:
      "text-[#2C365D] bg-transparent hover:bg-[#2C365D]/10 focus:ring-[#2C365D]",
    success:
      "bg-[#008000] text-white hover:bg-[#006600] focus:ring-[#008000]",
    warning:
      "bg-[#C53B00] text-white hover:bg-[#a03000] focus:ring-[#C53B00]",
    error: "bg-[#C40000] text-white hover:bg-[#a00000] focus:ring-[#C40000]",
    info: "bg-[#0074C4] text-white hover:bg-[#005a9a] focus:ring-[#0074C4]",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-base rounded-lg",
    lg: "px-6 py-3 text-lg rounded-lg",
    icon: "size-9 p-0 rounded-md",
  };

  const widthStyles = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

