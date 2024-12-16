"use client";

import { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
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
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Error fetching chart data: ${response.statusText}`);
        }
        const data = await response.json();
        const mappedData = data
          .map((item: any) => ({
            student: item.studentCode,
            score: item.totalScore,
          }))
          .sort((a: ChartDataItem, b: ChartDataItem) => a.score - b.score);
        setChartData(mappedData);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message)
        } else setError("An error occurred while fetching data.")
      } finally {
        setLoading(false);
      }
    };
    fetchChartData();
  }, [examPaperId]);

  if (error) {
    return (
      <Card>
        <CardHeader className="">
          <CardTitle>Student Scores</CardTitle>
          <CardDescription>
            No data available for the analysis.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Scores</CardTitle>
        <CardDescription>
          Scores for each student.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <ChartContainer config={chartConfig} className="w-full h-[500px] ">
            <BarChart accessibilityLayer data={chartData} barSize={100}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="student"
                tickLine={true}
                tickMargin={10}
                axisLine={true}
              />
              <YAxis
                tickLine={true}
                axisLine={true}
                tickMargin={10}
                tickFormatter={(value) => Math.floor(value).toString()}
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
          Total Students: {chartData.length}
        </div>
      </CardFooter>
    </Card>
  );
}
