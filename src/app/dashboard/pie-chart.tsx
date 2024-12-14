"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart, Cell, Legend } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Define the type for chart data
type ChartDataItem = {
  name: string;
  value: number;
  fill: string;
};

// Define the chart configuration with colors
const chartConfig: ChartConfig = {
  excellent: {
    label: "Excellent (9-10)",
    color: "#4CAF50", // Green
  },
  good: {
    label: "Good (8-9)",
    color: "#2196F3", // Blue
  },
  fair: {
    label: "Fair (5-8)",
    color: "#FFC107", // Yellow
  },
  poor: {
    label: "Poor (4-5)",
    color: "#FF9800", // Orange
  },
  bad: {
    label: "Bad (0-4)",
    color: "#F44336", // Red
  },
};

export function PieChartComponent() {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const token = localStorage.getItem("jwtToken");

        if (!token) {
          setError("JWT token not found.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          "http://localhost:8080/api/score/score-categories",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Map API data to chart format
        const formattedData: ChartDataItem[] = [
          { name: "Excellent (9-10)", value: data.excellent, fill: chartConfig.excellent.color },
          { name: "Good (8-9)", value: data.good, fill: chartConfig.good.color },
          { name: "Fair (5-8)", value: data.fair, fill: chartConfig.fair.color },
          { name: "Poor (4-5)", value: data.poor, fill: chartConfig.poor.color },
          { name: "Bad (0-4)", value: data.bad, fill: chartConfig.bad.color },
        ];

        setChartData(formattedData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data.");
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  const totalScores = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0);
  }, [chartData]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Score Distribution</CardTitle>
        <CardDescription>Score categories from Excellent to Bad</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <ChartContainer
            config={chartConfig} // Add the missing config prop
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                strokeWidth={5}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
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
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalScores.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Total Scores
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
              <Legend />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
     
    </Card>
  );
}
