import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Subject {
    subjectId: number;
    subjectName: string;
    subjectCode: string;
}

interface Semester {
    semesterName: string;
    semesterCode: string;
}

interface ExamPaper {
    examPaperId: number;
    examPaperCode: string;
    subject: Subject | null; // Subject can be null
    semester: Semester | null; // Semester can be null
    duration: number | null; // Duration can be null
}

export function ExamPaperInfo({ examPaper }: { examPaper: ExamPaper }) {
    return (
        <Card className="border shadow-md">
            <CardHeader>
                <CardTitle>Exam Paper</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                        <p className="font-semibold">Exam Code:</p>
                        <p>{examPaper.examPaperCode || "N/A"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Subject:</p>
                        <p>
                            {examPaper.subject
                                ? `${examPaper.subject.subjectName || "N/A"} (${examPaper.subject.subjectCode || "N/A"})`
                                : "N/A"}
                        </p>
                    </div>
                    <div>
                        <p className="font-semibold">Semester:</p>
                        <p>
                            {examPaper.semester
                                ? `${examPaper.semester.semesterName || "N/A"} (${examPaper.semester.semesterCode || "N/A"})`
                                : "N/A"}
                        </p>
                    </div>
                    <div>
                        <p className="font-semibold">Duration:</p>
                        <p>{examPaper.duration !== null && examPaper.duration >= 0 ? `${examPaper.duration} minutes` : "N/A"}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
