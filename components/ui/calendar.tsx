import * as React from "react";
import { cn } from "@/lib/utils";

type CalendarProps = React.InputHTMLAttributes<HTMLInputElement> & {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
};

export function Calendar({ className, selected, onSelect, ...props }: CalendarProps) {
  return (
    <input
      type="date"
      className={cn(
        "h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2",
        className
      )}
      value={selected ? selected.toISOString().slice(0, 10) : ""}
      onChange={(event) => {
        const value = event.target.value;
        onSelect?.(value ? new Date(value) : undefined);
      }}
      {...props}
    />
  );
}
