import * as React from "react";
import { cn } from "@/lib/utils";

type PopoverProps = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
};

function Popover({ open, children }: PopoverProps) {
  if (!open) {
    return null;
  }

  return <div className="relative inline-block">{children}</div>;
}

function PopoverContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "absolute z-20 mt-2 w-56 rounded-md border border-slate-200 bg-white p-4 shadow-lg",
        className
      )}
      {...props}
    />
  );
}

export { Popover, PopoverContent };
