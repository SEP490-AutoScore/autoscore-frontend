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
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

interface ChartDataItem {
    score: number;
    count: number;
}

export function BarChartScoreGroupComponent({ examPaperId }: { examPaperId: string }) {
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
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (!response.ok) {
                    throw new Error(`Error fetching chart data: ${response.statusText}`);
                }
                const data = await response.json();
                const scoreMap: Record<number, number> = {};
                data.forEach((item: any) => {
                    const roundedScore = Math.floor(item.totalScore);
                    scoreMap[roundedScore] = (scoreMap[roundedScore] || 0) + 1;
                });
                const formattedData = Object.entries(scoreMap).map(([score, count]) => ({
                    score: parseInt(score, 10),
                    count,
                }));
                setChartData(formattedData.sort((a, b) => a.score - b.score));
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else setError("An error occurred while fetching data.");
            } finally {
                setLoading(false);
            }
        };
        fetchChartData();
    }, [examPaperId]);

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Score Distribution</CardTitle>
                    <CardDescription>No data available for the analysis.</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Score Distribution</CardTitle>
                <CardDescription>Distribution of students' scores</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <ChartContainer config={chartConfig} className="w-full h-[500px]">
                        <BarChart data={chartData} barSize={60}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="score"
                                tickLine
                                axisLine
                                tickMargin={10}
                                label={{ value: "Score (Rounded)", position: "bottom", dy: 10 }}
                            />
                            <YAxis
                                tickLine
                                axisLine
                                tickMargin={10}
                            />
                            <Tooltip
                                content={({ payload }) => {
                                    if (payload && payload.length > 0) {
                                        const { score, count } = payload[0].payload;
                                        return (
                                            <div className="p-2 bg-white shadow-lg rounded">
                                                <div><strong>Score: </strong>{score}</div>
                                                <div><strong>Number of Students: </strong>{count}</div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar dataKey="count" fill="#FF8D29" radius={8} />
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="leading-none text-muted-foreground">
                    Total Students: {chartData.reduce((sum, item) => sum + item.count, 0)}
                </div>
            </CardFooter>
        </Card>
    );
}
