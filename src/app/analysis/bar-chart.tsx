"use client";

import { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip } from "recharts";
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
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface ChartDataItem {
  student: string;
  score: number;
}


export function BarChartComponent({ examPaperId }: { examPaperId: string }) {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);



  useEffect(() => {
    if (!examPaperId) return;

    const fetchChartData = async () => {
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
          `${BASE_URL}${API_ENDPOINTS.studentScoresBarChart}?examPaperId=${examPaperId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error fetching chart data: ${response.statusText}`);
        }

        const data = await response.json(); // Parse dữ liệu JSON từ API
        // Map dữ liệu để phù hợp với biểu đồ và sắp xếp theo điểm số tăng dần
        const mappedData = data
        .map((item: any) => ({
          student: item.studentCode,
          score: item.totalScore,
        }))
        .sort((a: ChartDataItem, b: ChartDataItem) => a.score - b.score); // Sort by score
      
        setChartData(mappedData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [examPaperId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Scores</CardTitle>
        <CardDescription>
        Scores of each student for exam paper
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              {/* Hide the studentCode on the X-axis */}
              <XAxis
                dataKey="student"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                hide // This will hide the student codes from the X-axis
              />
              {/* Tooltip to display studentCode and score when hovering */}
              <Tooltip
                content={({ payload }) => {
                  if (payload && payload.length > 0) {
                    const { student, score } = payload[0].payload;
                    return (
                      <div className="p-2 bg-white shadow-lg rounded">
                        <div><strong>Student Code: </strong>{student}</div>
                        <div><strong>Score: </strong>{score}</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="score" fill="#FF8D29" radius={8} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
       
        </div>
      </CardFooter>
    </Card>
  );
}
