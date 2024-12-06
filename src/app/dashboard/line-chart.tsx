import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

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

// Define the shape of your chart data
interface ChartData {
  score: number;
  occurrences: number;
}

export function LineChartComponent() {
  const [chartData, setChartData] = useState<ChartData[]>([]); // Explicit type
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
          "http://localhost:8080/api/score/total-score-occurrences",
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

        // Transform data into chart format
        const formattedData: ChartData[] = Object.entries(data).map(
          ([score, occurrences]) => ({
            score: parseFloat(score),
            occurrences: Number(occurrences),
          })
        );

        setChartData(formattedData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  const chartConfig = {
    occurrences: {
      label: "Occurrences",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Score Occurrences Line Chart</CardTitle>
        <CardDescription>Occurrences of Total Scores</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <ChartContainer config={chartConfig}>
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
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.toString()}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Line
                dataKey="occurrences"
                type="natural"
                stroke="var(--color-occurrences)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing occurrences of total scores for students.
        </div>
      </CardFooter>
    </Card>
  );
}
