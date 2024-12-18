import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ScoreDetails {  
  scoreDetailId: string
  postmanFunctionName: string
  scoreOfFunction: number
  totalPmtest: number
  scoreAchieve: number
  noPmtestAchieve: number
  examQuestionId: string
}
interface ScoreDetailsTableProps {
  details: ScoreDetails[];
}

export function ScoreDetailsTable({ details }: ScoreDetailsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Score Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Function Name</TableHead>
              <TableHead className="w-[100px] text-right">Score</TableHead>
              <TableHead className="w-[100px] text-right">Tests Passed</TableHead>
              <TableHead className="w-[200px]">Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {details.map((detail) => (
              <TableRow key={detail.scoreDetailId}>
                <TableCell className="font-medium">
                  {detail.postmanFunctionName}
                </TableCell>
                <TableCell className="text-right">
                  {detail.scoreAchieve}/{detail.scoreOfFunction}
                </TableCell>
                <TableCell className="text-right">
                  {detail.noPmtestAchieve}/{detail.totalPmtest}
                </TableCell>
                <TableCell>
                  <Progress
                    value={(detail.scoreAchieve / detail.scoreOfFunction) * 100}
                    className="w-full"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}