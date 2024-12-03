"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface BarChartComponentProps {
  data: { studentCode: string; totalScore: number }[];
}

export function BarChartComponent({ data }: BarChartComponentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Student Scores</CardTitle>
        <CardDescription>Scores by Student</CardDescription>
      </CardHeader>
      <CardContent>
        <BarChart width={600} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="studentCode" />
          <Bar dataKey="totalScore" fill="#8884d8" radius={4} />
        </BarChart>
      </CardContent>
    </Card>
  );
}
