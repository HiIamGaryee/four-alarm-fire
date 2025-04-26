"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ThresholdConfig {
  value: number;
  color: string;
}

interface GaugeMeterProps {
  value?: number;
  min?: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  label?: string;
  className?: string;
  valueClassName?: string;
  arcClassName?: string;
  labelClassName?: string;
  thresholds?: ThresholdConfig[];
}

const GaugeMeter = ({
  value = 0,
  min = 0,
  max = 100,
  size = "md",
  showValue = true,
  label,
  className,
  valueClassName,
  arcClassName,
  labelClassName,
  thresholds = [
    { value: 33, color: "green" },
    { value: 66, color: "orange" },
    { value: 100, color: "red" },
  ],
}: GaugeMeterProps) => {
  const [displayValue, setDisplayValue] = useState<number>(0);

  // Size dimensions
  const sizes = {
    sm: {
      width: 120,
      height: 60 + 20,
      thickness: 8,
      fontSize: "text-xl",
      labelSize: "text-xs",
    },
    md: {
      width: 180,
      height: 90 + 30,
      thickness: 12,
      fontSize: "text-3xl",
      labelSize: "text-sm",
    },
    lg: {
      width: 240,
      height: 120 + 40,
      thickness: 16,
      fontSize: "text-4xl",
      labelSize: "text-base",
    },
  };

  const { width, height, thickness, fontSize, labelSize } =
    sizes[size] || sizes.md;

  // Calculate normalized percentage
  const percentage = Math.min(
    Math.max(((value - min) / (max - min)) * 100, 0),
    100,
  );

  // Animation effect
  useEffect(() => {
    const animationDuration = 1000;
    const startTime = Date.now();
    const startValue = displayValue;

    const updateValue = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;

      if (elapsed < animationDuration) {
        const progress = elapsed / animationDuration;
        setDisplayValue(startValue + (percentage - startValue) * progress);
        requestAnimationFrame(updateValue);
      } else {
        setDisplayValue(percentage);
      }
    };

    requestAnimationFrame(updateValue);
  }, [percentage, displayValue]);

  // SVG parameters
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = centerX - thickness / 2;
  const startAngle = 180 * (Math.PI / 180);
  const endAngle = 0 * (Math.PI / 180);

  // Calculate color based on thresholds
  const getColor = (percent: number): string => {
    for (let i = 0; i < thresholds.length; i++) {
      if (percent <= thresholds[i].value) {
        return thresholds[i].color;
      }
    }
    return thresholds[thresholds.length - 1].color;
  };

  // Calculate arc path
  const describeArc = (
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
  ): string => {
    const start = {
      x: x + radius * Math.cos(startAngle),
      y: y + radius * Math.sin(startAngle),
    };

    const end = {
      x: x + radius * Math.cos(endAngle),
      y: y + radius * Math.sin(endAngle),
    };

    const largeArcFlag = Math.abs(endAngle - startAngle) <= Math.PI ? "0" : "1";
    const sweepFlag = endAngle > startAngle ? "1" : "0";

    return [
      "M",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      sweepFlag,
      0,
      end.x,
      end.y,
    ].join(" ");
  };

  // Calculate filled arc path based on percentage
  const calculateFilledArc = (): string => {
    const fillPercentage = displayValue / 100;
    const angleRange = endAngle - startAngle;
    const fillAngle = startAngle + angleRange * fillPercentage;

    return describeArc(centerX, centerY, radius, startAngle, fillAngle);
  };

  // Format displayed value
  const formattedValue = Math.round(displayValue);

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <svg width={width} height={height} className="">
        {/* Background track */}
        <path
          d={describeArc(centerX, centerY, radius, startAngle, endAngle)}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={thickness}
          strokeLinecap="round"
        />

        {/* Filled arc */}
        <path
          d={calculateFilledArc()}
          fill="none"
          stroke={getColor(displayValue)}
          strokeWidth={thickness}
          strokeLinecap="round"
          className={cn("transition-all duration-300", arcClassName)}
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showValue && (
          <span className={cn("font-semibold", fontSize, valueClassName)}>
            {formattedValue}%
          </span>
        )}
        {label && (
          <span
            className={cn(
              "text-muted-foreground mt-1",
              labelSize,
              labelClassName,
            )}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
};

export { GaugeMeter };
