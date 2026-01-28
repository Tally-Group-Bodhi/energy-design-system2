import React from "react";
import { cn } from "@/lib/utils";

export interface BreadcrumbProps
  extends React.HTMLAttributes<HTMLElement> {}

export interface BreadcrumbListProps
  extends React.HTMLAttributes<HTMLOListElement> {}

export interface BreadcrumbItemProps
  extends React.LiHTMLAttributes<HTMLLIElement> {}

export interface BreadcrumbLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  asChild?: boolean;
}

export interface BreadcrumbPageProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

export interface BreadcrumbSeparatorProps
  extends React.HTMLAttributes<HTMLLIElement> {}

export interface BreadcrumbEllipsisProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, ...props }, ref) => {
    return (
      <nav ref={ref} aria-label="breadcrumb" className={className} {...props} />
    );
  }
);
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  BreadcrumbListProps
>(({ className, ...props }, ref) => {
  return (
    <ol
      ref={ref}
      className={cn(
        "flex flex-wrap items-center gap-1.5 break-words text-sm text-gray-600",
        className
      )}
      {...props}
    />
  );
});
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  BreadcrumbItemProps
>(({ className, ...props }, ref) => {
  return (
    <li
      ref={ref}
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  );
});
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  BreadcrumbLinkProps
>(({ className, asChild, children, ...props }, ref) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {
      ref,
      className: cn(
        "transition-colors hover:text-gray-900",
        className,
        (children as React.ReactElement).props?.className
      ),
      ...props,
    });
  }

  return (
    <a
      ref={ref}
      className={cn(
        "transition-colors hover:text-gray-900",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
});
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  BreadcrumbPageProps
>(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("font-normal text-gray-900", className)}
      {...props}
    />
  );
});
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: BreadcrumbSeparatorProps) => {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? (
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
        >
          <path d="m9 18 6-6" />
        </svg>
      )}
    </li>
  );
};
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

const BreadcrumbEllipsis = ({
  className,
  ...props
}: BreadcrumbEllipsisProps) => {
  return (
    <span
      role="presentation"
      aria-hidden="true"
      className={cn("flex h-9 w-9 items-center justify-center", className)}
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
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
      </svg>
      <span className="sr-only">More</span>
    </span>
  );
};
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};

