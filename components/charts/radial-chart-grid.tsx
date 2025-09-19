"use client"

import { TrendingUp } from "lucide-react"
import { PolarGrid, RadialBar, RadialBarChart, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { CHART_CONFIGS } from "./chart-theme"

const chartData = [
  { browser: "chrome", visitors: 275, fill: CHART_CONFIGS.chrome.color },
  { browser: "safari", visitors: 200, fill: CHART_CONFIGS.safari.color },
  { browser: "firefox", visitors: 187, fill: CHART_CONFIGS.firefox.color },
]

const chartConfig = {
  visitors: CHART_CONFIGS.visitors,
  chrome: CHART_CONFIGS.chrome,
  safari: CHART_CONFIGS.safari,
  firefox: CHART_CONFIGS.firefox,
} satisfies ChartConfig

export function RadialChartGrid() {
  return (
    <Card className="flex flex-col">
      {/* <CardHeader className="items-center pb-0">
        <CardTitle>Radial Chart - Grid</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader> */}
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart data={chartData} innerRadius={30} outerRadius={100}>
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
            <PolarGrid gridType="circle" />
            <RadialBar dataKey="visitors" />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="size-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
