import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import UpdateExam from "@/app/exam/exam-papers/update-exam-form"

interface ExamDetailContentProps {
  examData: {
    examId: number;
    examCode: string;
    examAt: string;
    gradingAt: string;
    publishAt: string;
    semester: {
      semesterName: string;
      semesterCode: string;
    };
    subject: {
      subjectName: string;
      subjectCode: string;
    };
    type: string;
    status: boolean;
  };
}

export function ExamDetailContent({ examData }: ExamDetailContentProps) {
  return (
    <>
      <div className="flex items-center justify-between space-y-2 mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Exam Details</h2>
          <p className="text-muted-foreground">
            Here's a list of exam papers in this exam!
          </p>
        </div>
      </div>
      <Card className="shadow-none">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Information</CardTitle>
              <CardDescription>
                This is some information about the exam.
              </CardDescription>
            </div>
            <UpdateExam examId={examData.examId} />
          </div>
        </CardHeader>
        <CardContent>
          {/* Three-column layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Column 1: Exam Date and Subject */}
            <div>
              <div className="mb-2">
                <p className="font-semibold text-md">Exam Code</p>
                <p className="text-sm text-muted-foreground">
                  {examData.examCode}
                </p>
              </div>
              <div className="mb-2">
                <p className="font-semibold text-md">Created At</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(examData.examAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Column 2: Grading Date and Semester */}
            <div>
              <div className="mb-2">
                <p className="font-semibold text-md">Semester</p>
                <p className="text-sm text-muted-foreground">
                  {examData.semester.semesterName} (
                  {examData.semester.semesterCode})
                </p>
              </div>
              <div className="mb-2">
                <p className="font-semibold text-md">Grading At</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(examData.gradingAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Column 3: Publish Date and Type */}
            <div>
              <div className="mb-2">
                <p className="font-semibold text-md">Exam Type</p>
                <p className="text-sm text-muted-foreground">{examData.type}</p>
              </div>
              <div className="mb-2">
                <p className="font-semibold text-md">Public At</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(examData.publishAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
