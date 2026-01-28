import React from "react";
import { cn } from "@/lib/utils";

export interface TableProps
  extends React.TableHTMLAttributes<HTMLTableElement> {}

export interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}

export interface TableBodyProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}

export interface TableFooterProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}

export interface TableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement> {}

export interface TableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {}

export interface TableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement> {}

export interface TableCaptionProps
  extends React.HTMLAttributes<HTMLTableCaptionElement> {}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative w-full overflow-auto">
        <table
          ref={ref}
          className={cn("w-full caption-bottom text-sm", className)}
          {...props}
        />
      </div>
    );
  }
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  TableHeaderProps
>(({ className, ...props }, ref) => {
  return (
    <thead
      ref={ref}
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  );
});
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  TableBodyProps
>(({ className, ...props }, ref) => {
  return (
    <tbody
      ref={ref}
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
});
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  TableFooterProps
>(({ className, ...props }, ref) => {
  return (
    <tfoot
      ref={ref}
      className={cn(
        "border-t bg-gray-50 font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  );
});
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={cn(
          "border-b border-[#DEDEE1] transition-colors hover:bg-gray-50 data-[state=selected]:bg-gray-50",
          className
        )}
        {...props}
      />
    );
  }
);
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, ...props }, ref) => {
    return (
      <th
        ref={ref}
        className={cn(
          "h-10 px-2 text-left align-middle font-medium text-gray-900 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
          className
        )}
        {...props}
      />
    );
  }
);
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => {
    return (
      <td
        ref={ref}
        className={cn(
          "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
          className
        )}
        {...props}
      />
    );
  }
);
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  TableCaptionProps
>(({ className, ...props }, ref) => {
  return (
    <caption
      ref={ref}
      className={cn("mt-4 text-sm text-gray-600", className)}
      {...props}
    />
  );
});
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};

