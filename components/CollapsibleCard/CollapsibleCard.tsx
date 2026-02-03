"use client";

import React from "react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/Collapsible/Collapsible";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/Card/Card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/DropdownMenu/DropdownMenu";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export interface CollapsibleCardProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  /** Controlled: open state (use with onOpenChange) */
  open?: boolean;
  /** Controlled: called when open state changes */
  onOpenChange?: (open: boolean) => void;
  className?: string;
  /** Show three-dot menu in header */
  showMenu?: boolean;
}

export default function CollapsibleCard({
  title,
  children,
  defaultOpen = true,
  open: controlledOpen,
  onOpenChange,
  className,
  showMenu = true,
}: CollapsibleCardProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = React.useCallback(
    (value: boolean) => {
      if (controlledOpen === undefined) setInternalOpen(value);
      onOpenChange?.(value);
    },
    [controlledOpen, onOpenChange]
  );
  return (
    <Card className={cn("overflow-hidden shadow-none", className)}>
      <Collapsible open={open} onOpenChange={setOpen} defaultOpen={defaultOpen}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-4 pr-4">
          <CollapsibleTrigger className="flex flex-1 items-center gap-2 rounded-md text-left font-medium text-foreground hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
            <Icon name={open ? "expand_less" : "expand_more"} size={20} />
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
          </CollapsibleTrigger>
          {showMenu && (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="rounded p-1.5 hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label="Open menu"
              >
                <Icon name="more_vert" size={20} className="text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuItem variant="destructive">Remove</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="pt-0">{children}</CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
