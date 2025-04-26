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
import { GaugeMeter } from "@/components/ui/gauge-meter";
import React, { useEffect } from "react";
import { useUploadStore } from "@/stores/upload";
import { RiskGauge } from "@/components/RiskGauge";

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
  const [data, setData] = React.useState<{
    creditScore: number;
    riskPercent: number;
    incomeMonthly: number;
    debtsMonthly: number;
    utilization: number;
    monthlySpending: number[];
    rentPayments: number[];
  }>({
    creditScore: 0,
    riskPercent: 0,
    incomeMonthly: 0,
    debtsMonthly: 0,
    utilization: 0,
    monthlySpending: [],
    rentPayments: [],
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("aiReport");
      if (stored) {
        const parsed = JSON.parse(stored);
        setData({
          creditScore: parsed.creditScore || 0,
          riskPercent: parsed.riskPercent || 0,
          incomeMonthly: parsed.incomeData || 0,
          debtsMonthly: parsed.debtToIncome
            ? parsed.debtToIncome * (parsed.incomeData || 1)
            : 0,
          utilization: parsed.utilizationRate || 0,
          monthlySpending: parsed.spending || [],
          rentPayments: parsed.rentTimeline || [],
        });
      }
    } catch (error) {
      console.error("Error parsing stored AI report:", error);
      // Handle the error appropriately, maybe set default data or show a message
    }
  }, []);

  const getRiskColor = (riskValue: number): string => {
    if (riskValue < 40) {
      return "green";
    } else if (riskValue <= 70) {
      return "yellow";
    } else {
      return "red";
    }
  };

  const riskColor = getRiskColor(data.riskPercent);

  const { parsedData } = useUploadStore();

  console.log(parsedData);

  return (
    <div className="p-4">
      <SidebarTrigger className="mb-4" />
      <h1 className="text-2xl md:text-3xl font-semibold mb-6">Dashboard</h1>

      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="flex justify-center items-center">
          <CardContent className="flex items-center pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square w-[200px] md:w-[250px] lg:w-[286px]"
            >
              <RadialBarChart
                data={[{ creditScore: Math.max(data.creditScore, 1) }]}
                startAngle={0}
                endAngle={250}
                innerRadius={80}
                outerRadius={110}
              >
                <PolarGrid
                  gridType="circle"
                  radialLines={false}
                  stroke="none"
                  polarRadius={[86, 74]}
                />
                <RadialBar
                  dataKey="creditScore"
                  className="fill-green-600"
                  cornerRadius={10}
                />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
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
                              className="fill-foreground text-2xl md:text-4xl font-bold"
                            >
                              {data.creditScore > 0
                                ? data.creditScore.toLocaleString()
                                : "-"}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground text-sm"
                            >
                              Credit Score
                            </tspan>
                          </text>
                        );
                      }
                      return null;
                    }}
                  />
                </PolarRadiusAxis>
              </RadialBarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                title: "Income Data",
                value: data.incomeMonthly ? `RM ${data.incomeMonthly}` : "-",
              },
              {
                title: "Debt-to-Income",
                value: data.debtsMonthly ? `RM ${data.debtsMonthly}` : "-",
              },
              {
                title: "Utilization Rate",
                value: data.utilization
                  ? `${(data.utilization * 100).toFixed(1)}%`
                  : "-",
              },
            ].map((item) => (
              <Card key={item.title}>
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="text-2xl md:text-4xl font-medium">
                    {item.value}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">
                Eligibility Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-medium">
                {data.creditScore >= 600
                  ? "You are eligible for the best rates."
                  : data.creditScore > 0
                    ? "You may have average rates."
                    : "-"}
              </h3>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Monthly Spending
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center pb-0 w-full">
            <ChartContainer config={barConfig} className="mx-auto w-full">
              <BarChart
                data={
                  data.monthlySpending.length
                    ? data.monthlySpending.map((value, idx) => ({
                        month:
                          [
                            "Jan",
                            "Feb",
                            "Mar",
                            "Apr",
                            "May",
                            "Jun",
                            "Jul",
                            "Aug",
                            "Sep",
                            "Oct",
                            "Nov",
                            "Dec",
                          ][idx] || "",
                        spending: value,
                      }))
                    : []
                }
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

        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Rent Payments Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center pb-0 w-full">
            <ChartContainer config={lineConfig} className="mx-auto w-full">
              <LineChart
                data={
                  data.rentPayments.length
                    ? data.rentPayments.map((value, idx) => ({
                        month:
                          [
                            "Jan",
                            "Feb",
                            "Mar",
                            "Apr",
                            "May",
                            "Jun",
                            "Jul",
                            "Aug",
                            "Sep",
                            "Oct",
                            "Nov",
                            "Dec",
                          ][idx] || "",
                        payments: value,
                      }))
                    : []
                }
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

        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Risk Meter</CardTitle>
          </CardHeader>
          <CardContent>
            <RiskGauge
              riskValue={data.riskPercent}
              label="Risk Level"
              color={riskColor}
            />
            {/* <GaugeMeter
              value={data.creditScore > 0 ? 100 - data.creditScore / 10 : 50}
              size="md"
              label="Risk Meter"
              showValue
            /> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
