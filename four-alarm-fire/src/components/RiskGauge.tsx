"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LabelList,
  Label,
} from "recharts";
import { cn } from "@/lib/utils";

interface RiskGaugeProps {
  label?: string;
  riskValue?: number;
  className?: string;
  valueClassName?: string;
  labelClassName?: string;
  color?: string;
}

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return percent > 0.01 ? (
    <text
      x={x}
      y={y}
      fill="black"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null;
};

export function RiskGauge({
  riskValue = 0,
  label = "Risk Level",
  className,
  valueClassName,
  labelClassName,
  color = "#82ca9d",
}: RiskGaugeProps) {
  const data = [
    { name: "Risk", value: riskValue },
    { name: "Remaining", value: 100 - riskValue },
  ];

  const outerRadius = 80;
  const innerRadius = 60;

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center",
        className
      )}
    >
      <ResponsiveContainer width={180} height={120}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="70%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            startAngle={180}
            endAngle={0}
            paddingAngle={0}
            dataKey="value"
            isAnimationActive={true}
            animationDuration={500}
            // animationEasing="easeOutCubic"
            stroke="none"
          >
            <Cell key={`cell-0`} fill={color} />
            <Cell key={`cell-1`} fill="#e0e0e0" />
            {/* You can use LabelList for percentage labels on the slices if desired */}
            {/* <LabelList
              dataKey="value"
              content={renderCustomizedLabel}
              position="inside"
            /> */}
            <Label
              value={`${riskValue}%`}
              position="center"
              className={cn("font-bold text-xl", valueClassName)}
              style={{ fill: "black" }}
            />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {label && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
          <span className={cn("text-sm text-muted-foreground", labelClassName)}>
            {label}
          </span>
        </div>
      )}
    </div>
  );
}
