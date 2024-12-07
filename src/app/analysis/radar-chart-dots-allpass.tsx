"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

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

const chartConfig = {
  passCount: {
    label: "Pass Count",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function RadarChartDotsAllPassComponent({ examPaperId }: { examPaperId: string }) {
  const [chartData, setChartData] = useState<{ functionName: string; passCount: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setError("JWT token not found.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/api/score/analyze-log-all-pass?examPaperId=${examPaperId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data = await response.json();
        const formattedData = Object.entries(data).map(([key, value]) => ({
          functionName: key,
          passCount: value as number, // Ensure type safety
        }));
        setChartData(formattedData);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [examPaperId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle>Radar Chart - Pass Analysis</CardTitle>
        <CardDescription>
          Analyzing pass count for each function
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="functionName" />
            <PolarGrid />
            <Radar
              dataKey="passCount"
              fill="var(--color-passCount)"
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Data fetched successfully <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
