import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LabelList,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
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

} satisfies ChartConfig;

export function BarChartComponent({
  data,
  error,
  year,
  handleYearChange,
}: BarChartComponentProps) {

  if (error) {
    return (
      <Card className="h-full">
        <CardHeader className="">
          <CardTitle>Exams Each Year</CardTitle>

          <CardDescription>There is no data for statistics</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  // Data for BarChart
  const chartData = [
    { semester: "Spring", Exams: data.Spring },
    { semester: "Summer", Exams: data.Summer },
    { semester: "Fall", Exams: data.Fall },
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
        <ChartContainer
          config={chartConfig}
          className="w-full h-[502px]"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="semester" tickLine={true}
              axisLine={true} />
            <YAxis tickLine={true}
              axisLine={true} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="Exams"
              fill={chartConfig["exam-counts"].color}
              radius={8}
              barSize={50}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
