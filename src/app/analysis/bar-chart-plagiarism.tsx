"use client";

import { useEffect, useState } from "react";
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

interface PlagiarismData {
    studentCodePlagiarism: string;
    plagiarismPercentage: number;
}

export function BarChartPlagiarismComponent({ examPaperId }: { examPaperId: string }) {
    const [chartData, setChartData] = useState<PlagiarismData[]>([]);
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
                    `${BASE_URL}${API_ENDPOINTS.codePlagiarismDetails}?examPaperId=${examPaperId}`,
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
                const mappedData = data.map((item: any) => ({
                    studentCodePlagiarism: item.studentCodePlagiarism,
                    plagiarismPercentage: parseFloat(item.plagiarismPercentage.replace('%', '')),
                }));
                setChartData(mappedData);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An error occurred while fetching data.");
                }
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
                    <CardTitle>Student Plagiarism</CardTitle>
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
                <CardTitle>Student Plagiarism</CardTitle>
                <CardDescription>
                    Percentage of plagiarism each student.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <ChartContainer config={chartConfig} className="w-full h-[500px]">
                        <BarChart data={chartData} barSize={60}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="studentCodePlagiarism"
                                tickLine={true}
                                tickMargin={10}
                                axisLine={true}
                            />
                            <YAxis
                                tickLine={true}
                                axisLine={true}
                                tickMargin={10}
                                label={{
                                    value: "",
                                    angle: -90,
                                    position: "insideLeft",
                                }}
                            />
                            <Tooltip
                                content={({ payload }) => {
                                    if (payload && payload.length > 0) {
                                        const { studentCodePlagiarism, plagiarismPercentage } = payload[0].payload;
                                        return (
                                            <div className="p-2 bg-white shadow-lg rounded">
                                                <div>
                                                    <strong>Student: </strong>
                                                    {studentCodePlagiarism}
                                                </div>
                                                <div>
                                                    <strong>Plagiarism: </strong>
                                                    {plagiarismPercentage}%
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar dataKey="plagiarismPercentage" fill="#FF8D29" radius={8} />
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