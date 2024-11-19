import React, { useEffect, useState } from "react";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { NoResultPage, ErrorPage } from '@/app/error/page';

interface Semester {
    semesterId: number,
    semesterName: string,
    semesterCode: string,
}

interface Subject {
    subjectName: string,
    subjectCode: string,
    subjectId: number
}

export type ExamTypeEnum = "ASSIGNMENT" | "EXAM";

interface ExamInfoData {
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

interface ExamInfoProps {
    examId: number; // ID kỳ thi cần lấy thông tin
}

const ExamInfo: React.FC<ExamInfoProps> = ({ examId }) => {
    const [examInfo, setExamInfo] = useState<ExamInfoData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const showToast = useToastNotification();

    useEffect(() => {
        const fetchExamInfo = async () => {
            try {
                setLoading(true);
                setError(null);

                // Lấy token từ local storage
                const token = localStorage.getItem("jwtToken");
                if (!token) {
                    throw new Error("JWT Token không tồn tại. Vui lòng đăng nhập.");
                }

                // Thay thế đường dẫn bên dưới bằng endpoint thực tế của bạn
                const response = await fetch(`${BASE_URL}${API_ENDPOINTS.getExamInfo}/${examId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(ExamInfo),
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch exam info");
                }

                const data: ExamInfoData = await response.json();
                setExamInfo(data);
            } catch (err: any) {
                // Hiển thị toast dựa trên mã lỗi
                if (err.message.includes("401") || err.message.includes("404")) {
                    showToast({
                        title: "Authentication Failed.",
                        description: "You are not authorized to sign in.",
                        actionText: "Try Again",
                        variant: "destructive",
                    });
                } else if (err.message.includes("400")) {
                    showToast({
                        title: "Bad Request.",
                        description: "There was a problem with your request.",
                        variant: "destructive",
                    });
                } else if (err.message.includes("500")) {
                    showToast({
                        title: "Internal Server Error.",
                        description: "Something went wrong on the server.",
                        variant: "destructive",
                    });
                } else {
                    showToast({
                        title: "Something went wrong.",
                        description: "There was a problem with your request.",
                        variant: "destructive",
                    });
                }
            } finally {
                setLoading(false);
            }
        };

        fetchExamInfo();
    }, [examId]);

    if (loading) {
        return <div>Loading exam information...</div>;
    }

    if (error) {
        return <ErrorPage/>;
    }

    if (!examInfo) {
        return <NoResultPage/>;
    }

    return (
        <div className="w-full h-[150px] min-h-[100px] mx-[3%] my-[20px] p-4 border border-gray-300 rounded-lg">
            <div style={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
                {/* Cột bên trái */}
                <div style={{ flex: 1 }}>
                    <p><strong>Code:</strong> {examInfo.examCode}</p>
                    <p><strong>Semester:</strong> {examInfo.semester.semesterName}</p>
                    <p><strong>Type:</strong> {examInfo.type}</p>
                    <p><strong>Subject:</strong> {examInfo.subject.subjectName}</p>
                </div>

                {/* Cột bên phải */}
                <div style={{ flex: 1 }}>
                    <p><strong>Exam At:</strong> {new Date(examInfo.examAt).toLocaleString()}</p>
                    <p><strong>Grading At:</strong> {new Date(examInfo.gradingAt).toLocaleString()}</p>
                    <p><strong>Publish At:</strong> {new Date(examInfo.publishAt).toLocaleString()}</p>
                    <p><strong>Status:</strong> {examInfo.status ? "Active" : "Inactive"}</p>
                </div>
            </div>
        </div>

    );
};

export default ExamInfo;
