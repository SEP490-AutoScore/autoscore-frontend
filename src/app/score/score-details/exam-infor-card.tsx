import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExamInfo {
  examName: string;
  subjectCode: string;
  semester: string;
  examCode: string;
  examDate: string;
  gradingDate: string;
  gradedBy: string;
}

export function ExamInfoCard({ examInfo }: { examInfo: ExamInfo }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Exam Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <p className="text-sm font-medium leading-none text-muted-foreground">
              Exam Name
            </p>
            <p className="text-base">{examInfo.examName}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium leading-none text-muted-foreground">
              Subject Code
            </p>
            <p className="text-base">{examInfo.subjectCode}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium leading-none text-muted-foreground">
              Semester
            </p>
            <p className="text-base">{examInfo.semester}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium leading-none text-muted-foreground">
              Exam Code
            </p>
            <p className="text-base">{examInfo.examCode}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium leading-none text-muted-foreground">
              Exam Date
            </p>
            <p className="text-base">{examInfo.examDate}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium leading-none text-muted-foreground">
              Grading Date
            </p>
            <p className="text-base">{examInfo.gradingDate}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium leading-none text-muted-foreground">
              Graded By
            </p>
            <p className="text-base">{examInfo.gradedBy}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}