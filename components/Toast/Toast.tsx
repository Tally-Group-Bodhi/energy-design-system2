"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ToastProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  duration?: number;
  children: React.ReactNode;
}

export interface ToastProviderProps {
  children: React.ReactNode;
}

export interface ToastViewportProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export interface ToastActionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  altText: string;
}

export interface ToastCloseProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export interface ToastTitleProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export interface ToastDescriptionProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const ToastContext = React.createContext<{
  toasts: Array<{ id: string; message: string; duration: number }>;
  addToast: (message: string, duration?: number) => void;
  removeToast: (id: string) => void;
}>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
});

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = React.useState<
    Array<{ id: string; message: string; duration: number }>
  >([]);

  const addToast = React.useCallback((message: string, duration = 5000) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, duration }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

const ToastViewport = React.forwardRef<
  HTMLDivElement,
  ToastViewportProps
>(({ className, ...props }, ref) => {
  const { toasts } = React.useContext(ToastContext);

  return (
    <div
      ref={ref}
      className={cn(
        "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
        className
      )}
      {...props}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} id={toast.id} message={toast.message} />
      ))}
    </div>
  );
});
ToastViewport.displayName = "ToastViewport";

const Toast = ({
  id,
  message,
}: {
  id: string;
  message: string;
}) => {
  const { removeToast } = React.useContext(ToastContext);

  return (
    <div
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border border-[#DEDEE1] bg-white p-6 pr-8 shadow-lg transition-all"
      )}
    >
      <div className="grid gap-1">
        <div className="text-sm font-semibold text-gray-900">{message}</div>
      </div>
      <button
        className={cn(
          "absolute right-2 top-2 rounded-md p-1 text-gray-600 opacity-0 transition-opacity hover:text-gray-900 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
        )}
        onClick={() => removeToast(id)}
      >
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
          className="h-4 w-4"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </div>
  );
};

const ToastAction = React.forwardRef<
  HTMLButtonElement,
  ToastActionProps
>(({ className, altText, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-[#DEDEE1] bg-transparent px-3 text-sm font-medium ring-offset-white transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2C365D] focus:ring-offset-2",
        className
      )}
      {...props}
    >
      {altText}
    </button>
  );
});
ToastAction.displayName = "ToastAction";

const ToastClose = React.forwardRef<HTMLButtonElement, ToastCloseProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "absolute right-2 top-2 rounded-md p-1 text-gray-600 opacity-0 transition-opacity hover:text-gray-900 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100",
          className
        )}
        {...props}
      >
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
          className="h-4 w-4"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
        <span className="sr-only">Close</span>
      </button>
    );
  }
);
ToastClose.displayName = "ToastClose";

const ToastTitle = React.forwardRef<HTMLDivElement, ToastTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("text-sm font-semibold text-gray-900", className)}
        {...props}
      />
    );
  }
);
ToastTitle.displayName = "ToastTitle";

const ToastDescription = React.forwardRef<
  HTMLDivElement,
  ToastDescriptionProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("text-sm opacity-90 text-gray-600", className)}
      {...props}
    />
  );
});
ToastDescription.displayName = "ToastDescription";

export {
  ToastViewport,
  ToastAction,
  ToastClose,
  ToastTitle,
  ToastDescription,
  useToast,
};

