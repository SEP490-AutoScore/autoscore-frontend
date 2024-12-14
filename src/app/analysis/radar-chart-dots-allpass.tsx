"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
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
    label: "Count",
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
    return (
      <Card>
        <CardHeader className="items-center">
          <CardTitle>Radar Chart - Pass Analysis</CardTitle>
          <CardDescription>
            No data available for the analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-0 flex justify-center items-center h-full">
          <p>No data available for this exam paper.</p>
        </CardContent>
     
      </Card>
    );
  }


  return (
    <Card>
      <CardHeader className="">
        <CardTitle>Pass All Pmtest</CardTitle>
        <CardDescription>
        Students passing all pmtest.
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
              fill="#FF8D29"
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    
    </Card>
  );
}
