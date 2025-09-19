"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis, Tooltip } from "recharts";

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
  { browser: "chrome", visitors: 275, fill: CHART_CONFIGS.chrome.color },
  { browser: "safari", visitors: 200, fill: CHART_CONFIGS.safari.color },
  { browser: "firefox", visitors: 187, fill: CHART_CONFIGS.firefox.color },
  { browser: "edge", visitors: 173, fill: CHART_CONFIGS.edge.color },
  { browser: "other", visitors: 90, fill: CHART_CONFIGS.other.color },
];

const chartConfig = {
  visitors: CHART_CONFIGS.visitors,
  chrome: CHART_CONFIGS.chrome,
  safari: CHART_CONFIGS.safari,
  firefox: CHART_CONFIGS.firefox,
  edge: CHART_CONFIGS.edge,
  other: CHART_CONFIGS.other,
} satisfies ChartConfig;

export function BarChartMixed() {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        {/* <CardTitle>Bar Chart - Mixed</CardTitle>
        <CardDescription>January - June 2024</CardDescription> */}
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="browser"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <XAxis dataKey="visitors" type="number" hide />
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
            <Bar dataKey="visitors" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-pretty text-center text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="size-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Results for the top 5 browsers
        </div>
      </CardFooter>
    </Card>
  );
}
