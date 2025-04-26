"use client";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const chartData = [{ creditScore: 720 }];

const spendingData = [
  { month: "Jan", spending: 2000 },
  { month: "Feb", spending: 1800 },
  { month: "Mar", spending: 1900 },
  { month: "Apr", spending: 2100 },
  { month: "May", spending: 2200 },
  { month: "Jun", spending: 2300 },
  { month: "Jul", spending: 2400 },
  { month: "Aug", spending: 2500 },
  { month: "Sep", spending: 2600 },
  { month: "Oct", spending: 2700 },
  { month: "Nov", spending: 2800 },
  { month: "Dec", spending: 2900 },
];

const rentPaymentsData = [
  { month: "Jan", payments: 2000 },
  { month: "Feb", payments: 1800 },
  { month: "Mar", payments: 1900 },
  { month: "Apr", payments: 2100 },
  { month: "May", payments: 2200 },
  { month: "Jun", payments: 2300 },
  { month: "Jul", payments: 2400 },
  { month: "Aug", payments: 2500 },
  { month: "Sep", payments: 2600 },
  { month: "Oct", payments: 2700 },
  { month: "Nov", payments: 2800 },
  { month: "Dec", payments: 2900 },
];

const barConfig = {
  spending: {
    label: "Spending",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const lineConfig = {
  payments: {
    label: "Payments",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

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
          <Card className="ml-5 col-span-1">
            <CardContent className="flex flex-1 items-center pb-0">
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square w-[286px]"
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
      <div className="grid grid-cols-3 gap-4 mt-5 ml-5">
        <Card className="col-span-1 border-none shadow-none">
          <CardTitle className="text-xl pt-1 mb-5">Monthly Spending</CardTitle>
          <CardContent className="flex flex-1 items-center pb-0 w-full">
            <ChartContainer config={barConfig} className="mx-auto w-full">
              <BarChart
                data={spendingData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="spending" fill="blue" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="col-span-1 border-none shadow-none">
          <CardTitle className="text-xl pt-1 mb-5">
            Rent Payments Timeline
          </CardTitle>
          <CardContent className="flex flex-1 items-center pb-0 w-full">
            <ChartContainer config={lineConfig} className="mx-auto w-full">
              <LineChart
                data={rentPaymentsData}
                margin={{ right: 12, left: 12 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={8}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Line
                  dataKey="payments"
                  stroke="blue"
                  dot={{ fill: "blue" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
