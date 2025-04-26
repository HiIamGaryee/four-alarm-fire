"use client";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const chartData = [{ creditScore: 720 }];

const chartConfig: ChartConfig = {
  creditScore: {
    label: "Credit Score",
    color: "hsl(var(--chart-1))",
  },
};

export default function Dashboard() {
  return (
    <div>
      <SidebarTrigger className="ml-5 mt-5" />
      <h1 className="text-3xl font-semibold mt-5 ml-5">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4 mt-5 mr-5">
        <div>
          <Card className="flex flex-col ml-5 col-span-1">
            <CardContent className="flex flex-1 items-center pb-0">
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square w-full"
              >
                <RadialBarChart
                  data={chartData}
                  startAngle={0}
                  endAngle={250}
                  innerRadius={80}
                  outerRadius={110}
                >
                  <PolarGrid
                    gridType="circle"
                    radialLines={false}
                    stroke="none"
                    className="first:fill-green-200 last:fill-white"
                    polarRadius={[86, 74]}
                  />
                  <RadialBar
                    dataKey="creditScore"
                    className="fill-green-600"
                    cornerRadius={10}
                  />
                  <PolarRadiusAxis
                    tick={false}
                    tickLine={false}
                    axisLine={false}
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-4xl font-bold"
                              >
                                {chartData[0].creditScore.toLocaleString()}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-muted-foreground"
                              >
                                Credit Score
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </PolarRadiusAxis>
                </RadialBarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col ml-5 col-span-2">
          <div className="grid grid-cols-3 gap-4 mb-5">
            <Card>
              <CardHeader>
                <CardTitle>Income Data</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="text-4xl font-medium">6,500</h3>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Debt-to-Income</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="text-4xl font-medium">32%</h3>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Utilization Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="text-4xl font-medium">20%</h3>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl pt-1">
                  Eligibility Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-medium pb-2">
                  You are eligible for the best rates.
                </h3>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
