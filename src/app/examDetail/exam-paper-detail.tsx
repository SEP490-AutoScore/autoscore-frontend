import React, { useEffect, useState } from "react";
import Ske from "./skeleton-page"
import { ErrorPage } from '@/app/error/page';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"


// Định nghĩa kiểu dữ liệu cho câu hỏi
interface Question {
    examQuestionId: number;
    questionContent: string;
    examQuestionScore: number;
    endPoint: string;
    roleAllow: string;
    httpMethod: string;
    description: string;
    payloadType: string;
    payload: string;
    validation: string;
    sucessResponse: string;
    errorResponse: string;
    orderBy: number;
}

interface ExamPaperDetailProps {
    examPaperId: number;
}

const ExamPaperDetail: React.FC<ExamPaperDetailProps> = ({ examPaperId }) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // State lưu trữ các câu hỏi đang mở, mảng này chứa các examQuestionId
    const [openedQuestions, setOpenedQuestions] = useState<number[]>([]);

    // Hàm xử lý khi người dùng click vào một câu hỏi
    const toggleQuestionDetails = (questionId: number) => {
        setOpenedQuestions((prev) => {
            // Kiểm tra câu hỏi đã được mở chưa
            if (prev.includes(questionId)) {
                // Nếu đã mở thì đóng lại (bằng cách loại bỏ khỏi mảng)
                return prev.filter((id) => id !== questionId);
            } else {
                // Nếu chưa mở thì mở (thêm vào mảng)
                return [...prev, questionId];
            }
        });
    };

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                setError(null);

                const token = localStorage.getItem("jwtToken");
                if (!token) {
                    throw new Error("JWT Token không tồn tại. Vui lòng đăng nhập.");
                }

                // Gọi API để lấy danh sách câu hỏi
                const response = await fetch(`http://localhost:8080/api/exam-question/list`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ examPaperId }), // Truyền examPaperId vào trong body
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch questions");
                }

                const data: Question[] = await response.json();
                setQuestions(data); // Lưu danh sách câu hỏi vào state
            } catch (err: any) {
                setError(err.message || "An unknown error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [examPaperId]); // Mỗi khi examPaperId thay đổi, gọi lại API

    if (loading) {
        return <Ske />;
    }

    if (error) {
        return <ErrorPage />;
    }

    return (
        <>
            <ResizablePanelGroup
                direction="vertical"
                className="min-h-[200px] rounded-lg border md:min-w-[450px]"
            >
                <ResizablePanel>
                    <div className="flex h-[400px] items-center justify-center p-6 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-xl shadow-xl">
                        <ResizablePanelGroup direction="horizontal" className="w-full max-w-4xl">
                            <ResizablePanel className="p-4 bg-white border rounded-lg shadow-md flex items-center justify-center text-lg text-gray-700 hover:bg-gray-50 transition-all">
                                One
                            </ResizablePanel>
                            <ResizableHandle className="w-1 bg-gray-300 rounded-md cursor-col-resize" />
                            <ResizablePanel className="p-4 bg-white border rounded-lg shadow-md flex items-center justify-center text-lg text-gray-700 hover:bg-gray-50 transition-all">
                                Two
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </div>
                </ResizablePanel>

                <ResizableHandle />
                <ResizablePanel>
                    <div className="flex h-full items-center justify-center p-6">
                        <span className="font-semibold">Content</span>
                    </div>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel>
                    <div className="flex h-full items-center justify-center p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg">
                        <span className="text-white font-semibold text-xl">Content</span>
                    </div>

                </ResizablePanel>
            </ResizablePanelGroup>
        </>
    );
};

export default ExamPaperDetail;
