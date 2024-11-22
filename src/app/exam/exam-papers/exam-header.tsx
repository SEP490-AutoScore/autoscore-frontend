import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExamDetailContentProps {
    examData: {
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
        <Card>
            <CardHeader>
                <CardTitle>{examData.examCode}</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Three-column layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Column 1: Exam Date and Subject */}
                    <div>
                        <p>
                            <strong>Exam Date:</strong> {new Date(examData.examAt).toLocaleString()}
                        </p>
                        <p>
                            <strong>Subject:</strong> {examData.subject.subjectName} ({examData.subject.subjectCode})
                        </p>
                    </div>

                    {/* Column 2: Grading Date and Semester */}
                    <div>
                        <p>
                            <strong>Grading Date:</strong> {new Date(examData.gradingAt).toLocaleString()}
                        </p>
                        <p>
                            <strong>Semester:</strong> {examData.semester.semesterName} ({examData.semester.semesterCode})
                        </p>
                    </div>

                    {/* Column 3: Publish Date and Type */}
                    <div>
                        <p>
                            <strong>Publish Date:</strong> {new Date(examData.publishAt).toLocaleString()}
                        </p>
                        <p>
                            <strong>Type:</strong> {examData.type}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
