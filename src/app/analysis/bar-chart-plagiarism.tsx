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
                <CardDescription>Percentage of plagiarism per student.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>Error: {error}</p>
                ) : (
                    <BarChart
                        width={500}
                        height={300}
                        data={chartData}
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="studentCodePlagiarism"
                            tickLine={true}
                            axisLine={true} />
                        <YAxis
                            label={{ value: "Plagiarism (%)", angle: -90, position: "insideLeft" }}
                            tickLine={true}
                            axisLine={true}
                        />
                        <Tooltip
                            formatter={(value: number) => `${value}%`}
                            labelFormatter={(label: string) => `Student: ${label}`}

                        />
                        <Bar dataKey="plagiarismPercentage" fill="#FF5733" radius={4} />
                    </BarChart>
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
