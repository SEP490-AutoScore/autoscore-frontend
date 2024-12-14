"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, Legend } from "recharts"
import { useEffect, useState } from "react"
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface ChartDataEntry {
  month: string; // Explicitly defined property for the function name (or "month")
  [testCase: string]: string | number; // Allow 'month' to be a string while test cases remain numbers
}


export function BarChartStackedComponent({ examPaperId }: { examPaperId: string }) {
  const [chartData, setChartData] = useState<ChartDataEntry[]>([]); // Explicit type for chart data
  const [chartConfig, setChartConfig] = useState<Record<string, { label: string; color: string }>>({}); // Explicit type for chart config
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      if (!examPaperId) {
        setChartData([])
        setLoading(false)
        return
      }
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
          `${BASE_URL}${API_ENDPOINTS.analyzeLogEachTest}?examPaperId=${examPaperId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (response.ok) {
          const { formattedData, generatedConfig } = formatChartData(data);
          setChartData(formattedData);
          setChartConfig(generatedConfig);
        } else {
          setError("Failed to fetch data.");
        }
      } catch (error) {
        setError("An error occurred while fetching data." + error);
      } finally {
        setLoading(false);
      }
    };

    // if (examPaperId) {
    //   fetchChartData();
    // }
    fetchChartData();
  }, [examPaperId]);

  const formatChartData = (data: Record<string, Record<string, number>>) => {
    const transformedData: ChartDataEntry[] = [];
    const dynamicConfig: Record<string, { label: string; color: string }> = {};

    Object.keys(data).forEach((functionName) => {
      const testCases = data[functionName];

      Object.keys(testCases).forEach((testCase) => {
        const testCaseCount = testCases[testCase];

        if (!dynamicConfig[testCase]) {
          dynamicConfig[testCase] = {
            label: testCase,
            color: getRandomColor(),
          };
        }

        const existingEntry = transformedData.find(
          (entry) => entry.month === functionName
        );

        if (existingEntry) {
          existingEntry[testCase] = testCaseCount;
        } else {
          const newEntry: ChartDataEntry = {
            month: functionName, // This is the function name (or month)
            [testCase]: testCaseCount, // The test case dynamically gets added as a property
          };
          transformedData.push(newEntry);
        }
      });
    });

    return { formattedData: transformedData, generatedConfig: dynamicConfig };
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-[400px]">
            <p>Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-[400px]">
            <p className="text-red-500">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Stacked + Legend</CardTitle>
        <CardDescription>Test Case Passes for Each Function</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            {Object.keys(chartConfig).map((key) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="a"
                fill={chartConfig[key].color}
                radius={[0, 0, 4, 4]}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
      <div className="flex gap-2 font-medium leading-none">
          {chartData.length > 0 ? (
            <>Trending up by 5.2% this month <TrendingUp className="h-4 w-4" /></>
          ) : (
            'No data available for analysis'
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          {chartData.length > 0 
            ? 'Showing test case pass counts for each function'
            : 'Select an exam paper to view test case pass counts'
          }
        </div>
      </CardFooter>
    </Card>
  );
}
