import { CardHeader } from "@/components/ui/card";

interface Subject {
  subjectId: number;
  subjectName: string;
  subjectCode: string;
}

interface Semester {
  semesterId: number;
  semesterName: string;
  semesterCode: string;
}

interface Important {
  importantId: number;
  importantName: string;
  importantCode: string;
  importantScrip: string;
}

interface ExamPaper {
  examPaperId: number;
  examPaperCode: string;
  examId: number;
  importants: Important[];
  isUsed: boolean;
  status: string;
  instruction: string;
  duration: number;
  subject: Subject;
}

interface Exam {
  examId: number;
  examCode: string;
  examAt: string;
  gradingAt: string;
  publishAt: string;
  semester: Semester;
  subject: Subject;
  type: string;
  status: boolean;
}

export function ExamPaperInfo({
  examPaper,
  exam,
}: {
  examPaper: ExamPaper;
  exam: Exam;
}) {
  return (
    <CardHeader>
      <div>
        <p>
          <span className="font-semibold">
            {exam.examCode}_{examPaper.examPaperCode}
          </span>
        </p>
        <p>
          <span className="font-semibold">{exam.semester.semesterName}</span>
        </p>
        <p>
          <span>Subject: </span>
          <span className="font-semibold">
            {examPaper.subject.subjectCode || "N/A"}
          </span>
        </p>
        <p>
          <span>Duration: </span>
          <span className="font-semibold">{examPaper.duration || "N/A"}</span>
          {" "} minutes
        </p>
      </div>
    </CardHeader> 
  );
}
