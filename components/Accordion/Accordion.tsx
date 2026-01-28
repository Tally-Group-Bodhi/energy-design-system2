"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface AccordionItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export interface AccordionTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isOpen?: boolean;
}

export interface AccordionContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("border-b border-[#DEDEE1]", className)}
        {...props}
      />
    );
  }
);
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  AccordionTriggerProps
>(({ className, children, isOpen, ...props }, ref) => {
  return (
    <button
      type="button"
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline",
        isOpen && "[&>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 shrink-0 transition-transform duration-200"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  AccordionContentProps
>(({ className, children, isOpen, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden text-sm transition-all",
        isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0",
        className
      )}
      {...props}
    >
      <div className="pb-4 pt-0">{children}</div>
    </div>
  );
});
AccordionContent.displayName = "AccordionContent";

export { AccordionItem, AccordionTrigger, AccordionContent };

