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
            <CardContent className="space-y-4">
                <p>
                    <strong>Exam Date:</strong> {new Date(examData.examAt).toLocaleString()}
                </p>
                <p>
                    <strong>Grading Date:</strong> {new Date(examData.gradingAt).toLocaleString()}
                </p>
                <p>
                    <strong>Publish Date:</strong> {new Date(examData.publishAt).toLocaleString()}
                </p>
                <div>
                    <strong>Semester:</strong>
                    <p>{examData.semester.semesterName} ({examData.semester.semesterCode})</p>
                </div>
                <div>
                    <strong>Subject:</strong>
                    <p>{examData.subject.subjectName} ({examData.subject.subjectCode})</p>
                </div>
                <p>
                    <strong>Type:</strong> {examData.type}
                </p>
                <p>
                    <strong>Status:</strong> {examData.status ? "Active" : "Inactive"}
                </p>
            </CardContent>
        </Card>
    );
}
