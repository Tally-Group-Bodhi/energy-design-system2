"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface TypographyProps extends React.HTMLAttributes<HTMLHeadingElement> {}
export interface TypographyParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {}
export interface TypographyBlockquoteProps extends React.HTMLAttributes<HTMLQuoteElement> {}
export interface TypographyListProps extends React.HTMLAttributes<HTMLUListElement> {}
export interface TypographyCodeProps extends React.HTMLAttributes<HTMLElement> {}

/** H1 – Page title. scroll-m-20 for anchor offset, text-4xl lg:text-5xl, font-extrabold, tracking-tight */
const H1 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <h1
      ref={ref}
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight text-gray-900 lg:text-5xl",
        className
      )}
      {...props}
    />
  )
);
H1.displayName = "H1";

/** H2 – Section heading. Border bottom, text-3xl, font-semibold */
const H2 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn(
        "scroll-m-20 border-b border-border pb-2 text-3xl font-semibold tracking-tight text-gray-900 first:mt-0",
        className
      )}
      {...props}
    />
  )
);
H2.displayName = "H2";

/** H3 – Subsection heading. text-2xl, font-semibold */
const H3 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight text-gray-900",
        className
      )}
      {...props}
    />
  )
);
H3.displayName = "H3";

/** H4 – Minor heading. text-xl, font-semibold */
const H4 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <h4
      ref={ref}
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight text-gray-900",
        className
      )}
      {...props}
    />
  )
);
H4.displayName = "H4";

/** P – Body paragraph. leading-7, margin-top for non-first children */
const P = React.forwardRef<HTMLParagraphElement, TypographyParagraphProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("leading-7 text-gray-900 [&:not(:first-child)]:mt-6", className)}
      {...props}
    />
  )
);
P.displayName = "P";

/** Blockquote – Quoted text. Border left, italic, padding */
const Blockquote = React.forwardRef<HTMLQuoteElement, TypographyBlockquoteProps>(
  ({ className, ...props }, ref) => (
    <blockquote
      ref={ref}
      className={cn("mt-6 border-l-2 border-border pl-6 italic text-gray-700", className)}
      {...props}
    />
  )
);
Blockquote.displayName = "Blockquote";

/** Ul – Unordered list. list-disc, margin */
const Ul = React.forwardRef<HTMLUListElement, TypographyListProps>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)}
      {...props}
    />
  )
);
Ul.displayName = "Ul";

/** Ol – Ordered list */
const Ol = React.forwardRef<HTMLOListElement, TypographyListProps>(
  ({ className, ...props }, ref) => (
    <ol
      ref={ref}
      className={cn("my-6 ml-6 list-decimal [&>li]:mt-2", className)}
      {...props}
    />
  )
);
Ol.displayName = "Ol";

/** InlineCode – Inline code. bg-muted, font-mono, rounded */
const InlineCode = React.forwardRef<HTMLElement, TypographyCodeProps>(
  ({ className, ...props }, ref) => (
    <code
      ref={ref as React.Ref<HTMLElement>}
      className={cn(
        "relative rounded bg-gray-100 px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-gray-900",
        className
      )}
      {...props}
    />
  )
);
InlineCode.displayName = "InlineCode";

/** Lead – Introductory or muted large text. text-xl, muted color */
const Lead = React.forwardRef<HTMLParagraphElement, TypographyParagraphProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-xl text-muted-foreground", className)}
      {...props}
    />
  )
);
Lead.displayName = "Lead";

/** Large – Emphasized text. text-lg, font-semibold */
const Large = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-lg font-semibold text-gray-900", className)} {...props} />
  )
);
Large.displayName = "Large";

/** Small – Small label or caption. text-sm, leading-none, font-medium */
const Small = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <small
      ref={ref as React.Ref<HTMLElement>}
      className={cn("text-sm font-medium leading-none text-gray-700", className)}
      {...props}
    />
  )
);
Small.displayName = "Small";

/** Muted – Secondary or helper text. text-sm, muted color */
const Muted = React.forwardRef<HTMLParagraphElement, TypographyParagraphProps>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
);
Muted.displayName = "Muted";

export { H1, H2, H3, H4, P, Blockquote, Ul, Ol, InlineCode, Lead, Large, Small, Muted };
