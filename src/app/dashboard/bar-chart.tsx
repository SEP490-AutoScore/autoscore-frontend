import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { ChartContainer } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BarChartComponentProps = {
  data: {
    Spring: number;
    Summer: number;
    Fall: number;
  };

  error: string | null;
  year: string;
  handleYearChange: (value: string) => void;
};

const chartConfig = {
  "exam-counts": {
    label: "Exam Counts",
    color: "#FF8D29",
  },
};

export function BarChartComponent({ data, error, year, handleYearChange }: BarChartComponentProps) {

  if (error) {
    return (
      <Card className="h-full">
        <CardHeader className="">
          <CardTitle>Exams Each Year</CardTitle>

          <CardDescription>
            There is no data for statistics
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Data for BarChart
  const chartData = [
    { semester: "Spring", count: data.Spring },
    { semester: "Summer", count: data.Summer },
    { semester: "Fall", count: data.Fall },
  ];

  // Generate years from current year to 10 years ago
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, index) => (currentYear - index).toString());

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle>Exams Each Year</CardTitle>
        <CardDescription>Exams counts per semester for selected year</CardDescription>

        {/* Dropdown select to choose year */}
        <div className="absolute top-2 right-2">
          <Select onValueChange={handleYearChange} defaultValue={year}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="w-full h-[500px]">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="semester" tickLine={true}
              axisLine={true} />
            <YAxis tickLine={true}
              axisLine={true} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="count"
              fill={chartConfig["exam-counts"].color}
              barSize={150} // Set the width of the bars
            />

          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
