"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, TrendingUp } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";

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

const placeholderData = [
  { functionName: "Function A", passCount: 0 },
  { functionName: "Function B", passCount: 0 },
  { functionName: "Function C", passCount: 0 },
]

export function RadarChartDotsAllPassComponent({ examPaperId }: { examPaperId: string }) {
  const [chartData, setChartData] = useState<{ functionName: string; passCount: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaceholderData, setIsPlaceholderData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!examPaperId) {
        setChartData(placeholderData)
        setIsPlaceholderData(true)
        return
      }
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setError("JWT token not found.");
        setIsPlaceholderData(true)
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${BASE_URL}${API_ENDPOINTS.analyzeLogAllPass}?examPaperId=${examPaperId}`,
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
        setChartData(formattedData.length > 0 ? formattedData : placeholderData);
        setIsPlaceholderData(formattedData.length === 0);
      } catch (err: unknown) {
        // setError(err.message || "An unexpected error occurred.");
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred.");
        }
        setChartData(placeholderData)
        setIsPlaceholderData(true);
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

  const displayData = chartData.length > 0 ? chartData : placeholderData

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
          className="mx-auto aspect-video max-h-[250px]"
        >
          <RadarChart data={displayData}>
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
          {/* Data fetched successfully <TrendingUp className="h-4 w-4" /> */}
          {loading ? (
            "Loading data..."
          ) : error ? (
            <>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Error: {error}
            </>
          ) : isPlaceholderData ? (
            <>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              No data available. Showing placeholder data.
            </>
          ) : (
            <>
              <TrendingUp className="h-4 w-4 text-green-500" />
               {chartData.length} function{chartData.length !== 1 ? 's' : ''}
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
