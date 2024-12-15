"use client";

import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
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

// Cấu hình cho chart
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

export function BarChartCustomLabelComponent() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("jwtToken");

        if (!token) {
          setError("JWT token not found.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${BASE_URL}${API_ENDPOINTS.analyzeLog}`,
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

        // Convert data into a format suitable for the chart
        const formattedData = data.map((entry: any) => ({
          function: entry.function,
          occurrences: entry.occurrences,
        }));

        setChartData(formattedData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  if (error) {
    return (
      <Card className="h-full">
        <CardHeader className="">
          <CardTitle>Total Postman Function</CardTitle>

          <CardDescription>
            There is no data for statistics
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Postman Function</CardTitle>
        <CardDescription>List postman function</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <ChartContainer config={chartConfig} className="w-full h-[500px]">
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{
                right: 16,
              }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="function"
                type="category"
                tickLine={true}
                tickMargin={10}
                axisLine={true}
                tickFormatter={(value) => value.slice(0, 3)}

              />
              <XAxis dataKey="occurrences" type="number"
                tickLine={true}
                axisLine={true}
              />

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Bar
                dataKey="occurrences"
                layout="vertical"
                fill="#FF8D29"
                radius={4}
                barSize={40}
              >
                <LabelList
                  dataKey="function"
                  position="insideLeft"
                  offset={8}
                  className="fill-[--color-label]"
                  fontSize={12}
                />
                <LabelList
                  dataKey="occurrences"
                  position="right"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>

    </Card>
  );
}
