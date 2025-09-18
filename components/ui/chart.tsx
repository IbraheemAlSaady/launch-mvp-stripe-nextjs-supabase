"use client";

import * as React from "react";
import { ResponsiveContainer } from "recharts";

// Chart configuration type
export interface ChartConfig {
  [k: string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
    color?: string;
    theme?: Record<string, string>;
  };
}

// Chart container component
const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig;
    children: React.ComponentProps<typeof ResponsiveContainer>["children"];
  }
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`flex aspect-video justify-center text-xs ${className || ''}`}
      {...props}
    >
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
});
ChartContainer.displayName = "ChartContainer";

// Chart tooltip component
const ChartTooltip = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    active?: boolean;
    payload?: Array<{
      color: string;
      dataKey: string;
      name: string;
      value: number;
      payload: Record<string, unknown>;
    }>;
    label?: string;
  }
>(({ active, payload, label, className, ...props }, ref) => {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={`rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 shadow-md ${className || ''}`}
      {...props}
    >
      {label && (
        <div className="font-medium text-slate-900 dark:text-slate-100 mb-1">
          {label}
        </div>
      )}
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-slate-600 dark:text-slate-400">
            {entry.name}:
          </span>
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
});
ChartTooltip.displayName = "ChartTooltip";

// Chart tooltip content wrapper
const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ChartTooltip>
>((props, ref) => {
  return <ChartTooltip ref={ref} {...props} />;
});
ChartTooltipContent.displayName = "ChartTooltipContent";

export { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig };