import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Important {
    importantId: number;
    importantName: string;
    importantCode: string;
    importantScrip: string | null;
    subject: {
        subjectId: number;
        subjectName: string;
        subjectCode: string;
    };
}

interface ExamPaper {
    examPaperId: number;
    examPaperCode: string;
    importants: Important[];
    isUsed: boolean;
    status: string;
    instruction: string;
    duration: number;
}

export function ExamPaperInfo({ examPaper }: { examPaper: ExamPaper }) {
    return (
        <Card className="border shadow-md">
            <CardHeader>
                <CardTitle>{examPaper.examPaperCode}</CardTitle>
            </CardHeader>
            <CardContent>
                <p>
                    <strong>Instruction:</strong> {examPaper.instruction || "No instructions available"}
                </p>
                <p>
                    <strong>Duration:</strong> {examPaper.duration} minutes
                </p>
                <p>
                    <strong>Status:</strong> {examPaper.status}
                </p>
                <p>
                    <strong>Is Used:</strong> {examPaper.isUsed ? "Yes" : "No"}
                </p>
                <div className="mt-4">
                    <strong>Important Notes:</strong>
                    {examPaper.importants.length > 0 ? (
                        <ul className="list-disc pl-6">
                            {examPaper.importants.map((important) => (
                                <li key={important.importantId}>
                                    <strong>{important.importantName}</strong>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 italic">No important found</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
