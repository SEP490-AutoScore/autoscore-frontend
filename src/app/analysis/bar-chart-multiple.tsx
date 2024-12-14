"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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

type StudentScores = {
  averageResponseTime: number;
  totalRunDuration: number;
};

type ApiResponse = Record<string, StudentScores>;

const chartConfig = {
  averageResponseTime: {
    label: "Average Response Time",
    color: "hsl(var(--chart-1))",
  },
  totalRunDuration: {
    label: "Total Run Duration",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function BarChartMultipleComponent({ examPaperId }: { examPaperId: string }) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!examPaperId) return;
    setLoading(true);

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setError("JWT token not found.");
      setLoading(false);
      return;
    }

    fetch(
      `http://localhost:8080/api/score/get-total-run-and-average-response-time?examPaperId=${examPaperId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json() as Promise<ApiResponse>;
      })
      .then((data) => {
        const formattedData = Object.entries(data).map(([studentId, scores]) => {
          const { averageResponseTime, totalRunDuration } = scores;
          return { studentId, averageResponseTime, totalRunDuration };
        });
        setChartData(formattedData);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [examPaperId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Analysis</CardTitle>
        <CardDescription>
          Average Response Time and Total Run Duration by Students
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading chart data...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart data={chartData} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis hide={true}
  dataKey="studentId"
  tickLine={false}
  tickMargin={10}
  axisLine={false}
  tickFormatter={(value) => value}
/>

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar
                dataKey="averageResponseTime"
                fill="#FF8D29"
                radius={4}
              />
              <Bar
                dataKey="totalRunDuration"
                fill="#FFBB7F"
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    
    </Card>
  );
}
