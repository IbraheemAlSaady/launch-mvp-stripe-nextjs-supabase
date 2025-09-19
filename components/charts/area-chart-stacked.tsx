"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, Tooltip } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CHART_CONFIGS } from "./chart-theme";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: CHART_CONFIGS.desktop,
  mobile: CHART_CONFIGS.mobile,
} satisfies ChartConfig;

export function AreaChartStacked() {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        {/* <CardTitle>Area Chart - Stacked</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription> */}
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <Tooltip
              cursor={false}
              content={(props) => (
                <ChartTooltipContent 
                  active={props.active}
                  payload={props.payload}
                  label={props.label?.toString()}
                />
              )}
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill={chartConfig.mobile.color}
              fillOpacity={0.4}
              stroke={chartConfig.mobile.color}
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill={chartConfig.desktop.color}
              fillOpacity={0.4}
              stroke={chartConfig.desktop.color}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-pretty text-center text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="size-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          January - June 2024
        </div>
      </CardFooter>
    </Card>
  );
}
