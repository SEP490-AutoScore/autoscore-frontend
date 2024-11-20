import React, { useEffect, useState } from "react";
import Ske from "./skeleton-page"
import { ErrorPage } from '@/app/error/page';
import PostmanForGrading from '@/app/postmanForGrading/postman-for-grading';

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

    //gherkin
    const [gherkinData, setGherkinData] = useState<string | null>(null);
    const [currentGherkinId, setCurrentGherkinId] = useState<number | null>(null);

    //database
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedImage(e.target.files[0]);
        }
    };

    //import database
    const handleImportDatabase = async () => {
        if (!selectedFile || !selectedImage) {
            alert("Please select both a SQL file and an image.");
            return;
        }
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            throw new Error("JWT Token không tồn tại. Vui lòng đăng nhập.");
        }


        const formData = new FormData();
        formData.append("file.sql", selectedFile);
        formData.append("fileimage", selectedImage);
        formData.append("examPaperId", String(examPaperId));

        try {
            const response = await fetch("http://localhost:8080/api/database/import", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to import database");
            }

            const result = await response.text();
            alert(result);
        } catch (error: any) {
            console.error(error);
            alert("Error importing database: " + error.message);
        }
    };

    // update database
    const handleUpdateDatabase = async () => {
        if (!selectedFile || !selectedImage) {
            alert("Please select both a SQL file and an image.");
            return;
        }

        const formData = new FormData();
        formData.append("file.sql", selectedFile);
        formData.append("fileimage", selectedImage);
        formData.append("examPaperId", String(examPaperId));
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            throw new Error("JWT Token không tồn tại. Vui lòng đăng nhập.");
        }

        try {
            const response = await fetch("http://localhost:8080/api/database/update", {
                method: "PUT",
                headers: {

                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to update database");
            }

            const result = await response.text();
            alert(result);
        } catch (error: any) {
            console.error(error);
            alert("Error updating database: " + error.message);
        }
    };


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

        // Hàm gọi API để lấy Gherkin
        const fetchGherkinData = async (examQuestionId: number) => {
            try {
                const token = localStorage.getItem("jwtToken");
                if (!token) throw new Error("JWT Token không tồn tại. Vui lòng đăng nhập.");

                const response = await fetch(
                    `http://localhost:8080/api/gherkin_scenario/questionId?examQuestionId=${examQuestionId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) throw new Error("Failed to fetch Gherkin data");

                const data = await response.json();
                setGherkinData(data.map((item: any) => item.gherkinData).join("\n\n"));
                setCurrentGherkinId(examQuestionId);
            } catch (err: any) {
                console.error(err.message || "An unknown error occurred.");
                setGherkinData("Failed to fetch Gherkin data.");
            }
        };

        const generateGherkin = async (examQuestionId: number) => {
            try {
                const token = localStorage.getItem("jwtToken");
                if (!token) throw new Error("JWT Token không tồn tại. Vui lòng đăng nhập.");

                const response = await fetch(
                    `http://localhost:8080/api/gherkin_scenario/generate_gherkin_format`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ examQuestionIds: [examQuestionId] }),
                    }
                );

                if (!response.ok) throw new Error("Failed to generate Gherkin data");

                const result = await response.json();
                alert("Gherkin data generated successfully!");
            } catch (err: any) {
                console.error(err.message || "An unknown error occurred.");
                alert("Gherkin data generated successfully!");
            }
        };



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
                        <div className="flex h-full items-center justify-center p-6">
                            <ResizablePanelGroup direction="horizontal">
                                <ResizablePanel>
                                    <div>
                                        {questions.length > 0 ? (
                                            <div>
                                                {questions.map((question) => (
                                                    <div
                                                        key={question.examQuestionId}
                                                        style={{
                                                            marginBottom: "20px",
                                                            border: "1px solid #ddd",
                                                            padding: "16px",
                                                            borderRadius: "8px",
                                                            backgroundColor: "#f9f9f9",
                                                            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                                                        }}
                                                    >
                                                        {/* Tiêu đề câu hỏi (người dùng có thể nhấp vào để xem chi tiết) */}
                                                        <h4
                                                            style={{
                                                                color: "#333",
                                                                marginBottom: "10px",
                                                                fontSize: "18px",
                                                                cursor: "pointer",
                                                            }}
                                                            onClick={() => toggleQuestionDetails(question.examQuestionId)}
                                                        >
                                                            Question {question.examQuestionId}: {question.questionContent}
                                                        </h4>

                                                        <button
                                                            style={{
                                                                padding: "8px 12px",
                                                                backgroundColor: "#007bff",
                                                                color: "#fff",
                                                                border: "none",
                                                                borderRadius: "4px",
                                                                cursor: "pointer",
                                                                marginBottom: "10px",
                                                            }}
                                                            onClick={() => fetchGherkinData(question.examQuestionId)}
                                                        >
                                                            View Gherkin
                                                        </button>

                                                        <button
                                                            style={{
                                                                padding: "8px 12px",
                                                                backgroundColor: "#28a745",
                                                                color: "#fff",
                                                                border: "none",
                                                                borderRadius: "4px",
                                                                cursor: "pointer",
                                                                marginTop: "10px", // Khoảng cách giữa các nút
                                                            }}
                                                            onClick={() => generateGherkin(question.examQuestionId)}
                                                        >
                                                            Generate Gherkin
                                                        </button>



                                                        {/* Hiển thị thông tin chi tiết nếu câu hỏi đang được mở */}
                                                        {openedQuestions.includes(question.examQuestionId) && (
                                                            <div>
                                                                <div style={{ display: "flex", flexWrap: "wrap" }}>
                                                                    <p style={{ marginRight: "20px", fontWeight: "bold" }}>
                                                                        <strong>Score:</strong> {question.examQuestionScore}
                                                                    </p>
                                                                    <p style={{ marginRight: "20px", fontWeight: "bold" }}>
                                                                        <strong>Endpoint:</strong> {question.endPoint}
                                                                    </p>
                                                                    <p style={{ marginRight: "20px", fontWeight: "bold" }}>
                                                                        <strong>HTTP Method:</strong> {question.httpMethod}
                                                                    </p>
                                                                </div>
                                                                <p><strong>Description:</strong> {question.description}</p>
                                                                <div style={{ backgroundColor: "#f1f1f1", padding: "10px", borderRadius: "5px", marginBottom: "10px" }}>
                                                                    <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}><strong>Payload:</strong> {question.payload}</pre>
                                                                    <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}><strong>Success Response:</strong> {question.sucessResponse}</pre>
                                                                    <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}><strong>Error Response:</strong> {question.errorResponse}</pre>
                                                                </div>
                                                                <p><strong>Validation:</strong> {question.validation}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p>No questions found for this exam paper.</p>
                                        )}
                                    </div>
                                </ResizablePanel>
                                <ResizableHandle />


                                <ResizablePanel>
                                    <div className="flex h-full items-center justify-center p-6">
                                        {gherkinData && currentGherkinId ? (
                                            <ResizablePanelGroup direction="vertical" style={{ height: "100%" }}>
                                                <ResizablePanel defaultSize={300} minSize={100} maxSize={600}>
                                                    <div
                                                        style={{
                                                            backgroundColor: "#fff",
                                                            padding: "10px",
                                                            border: "1px solid #ccc",
                                                            borderRadius: "5px",
                                                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                                                            overflow: "auto", // Đảm bảo không bị tràn
                                                            maxHeight: "100%", // Điều chỉnh nếu nội dung vượt quá kích thước
                                                        }}
                                                    >
                                                        <pre
                                                            style={{
                                                                whiteSpace: "pre-wrap",
                                                                wordWrap: "break-word",
                                                                margin: 0,
                                                            }}
                                                        >
                                                            {gherkinData}
                                                        </pre>
                                                    </div>
                                                </ResizablePanel>
                                            </ResizablePanelGroup>
                                        ) : (
                                            <span className="font-semibold">
                                                Select a question to view its Gherkin
                                            </span>
                                        )}
                                    </div>
                                </ResizablePanel>


                            </ResizablePanelGroup>
                        </div>
                    </ResizablePanel>

                    <ResizableHandle />

                    {/* import and update database*/}
                    <ResizablePanel>
                        <div className="p-4">
                            <input
                                type="file"
                                accept=".sql"
                                onChange={handleFileChange}
                                className="block mb-2"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="block mb-4"
                            />
                            <button
                                onClick={handleImportDatabase}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-2"
                            >
                                Import Database
                            </button>
                            <button
                                onClick={handleUpdateDatabase}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                Update Database
                            </button>
                        </div>
                    </ResizablePanel>


                    <ResizableHandle />


                    <ResizablePanel>
                        <div className="flex h-full items-center justify-center p-6">
                          
                            <PostmanForGrading examPaperId={examPaperId} />
                        </div>
                    </ResizablePanel>


                </ResizablePanelGroup>
            </>
        );
    };

    export default ExamPaperDetail;
