import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ChartData {
  score: number;
  occurrences: number;
}

export function LineChartComponent() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
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
          `${BASE_URL}${API_ENDPOINTS.totalScoreOccurrences}`,
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
        // Transform data: round scores to the nearest integer
        const formattedData: ChartData[] = Object.entries(data)
          .map(([score, occurrences]) => ({
            score: Math.round(parseFloat(score)),
            occurrences: Number(occurrences),
          }))
          .reduce((acc, item) => {

            const existing = acc.find((entry) => entry.score === item.score);
            if (existing) {
              existing.occurrences += item.occurrences;
            } else {
              acc.push(item);
            }
            return acc;
          }, [] as ChartData[])
          .sort((a, b) => a.score - b.score);
        setChartData(formattedData);
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else setError("Failed to fetch data");
        setLoading(false);
      }
    };
    fetchChartData();
  }, []);

  const chartConfig = {
    occurrences: {
      label: "Student count: ",
      color: "#FF8D29",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Student Each Score</CardTitle>
        <CardDescription>Number of students with achieved scores</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <ChartContainer config={chartConfig} className="w-full h-[500px]">
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="score"
                tickLine={true}
                axisLine={true}
                tickMargin={8}
                tickFormatter={(value) => value.toString()}
              />
              <YAxis
                tickLine={true}
                axisLine={true}
                tickMargin={10}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Line
                dataKey="occurrences"
                type="natural"
                stroke="#FF8D29"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
