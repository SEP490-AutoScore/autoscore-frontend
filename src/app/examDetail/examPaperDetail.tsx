import React, { useEffect, useState } from "react";

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
        return <div>Loading questions...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <div>
                <h2
                    style={{
                        fontSize: "24px",  // Kích thước chữ lớn hơn
                        fontWeight: "bold", // Đậm chữ
                        color: "#007bff",   // Màu sắc tiêu đề (thêm màu xanh dương)
                        marginBottom: "20px", // Khoảng cách phía dưới
                        textTransform: "uppercase", // In hoa chữ cái
                        letterSpacing: "2px",  // Giãn cách chữ cái
                        borderBottom: "3px solid #007bff", // Thêm đường viền dưới để làm nổi bật
                        paddingBottom: "5px", // Khoảng cách giữa chữ và đường viền
                        textAlign: "center",  // Căn giữa tiêu đề
                    }}
                >
                    List question
                </h2>
                {questions.length > 0 ? (
                    <div>
                        {questions.length > 0 ? (
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
                        ) : (
                            <p>No questions found for this exam paper.</p>
                        )}
                    </div>
                ) : (
                    <p>No questions found for this exam paper.</p>
                )}
            </div>
            <div>
                <h2
                    style={{
                        fontSize: "24px",  // Kích thước chữ lớn hơn
                        fontWeight: "bold", // Đậm chữ
                        color: "#007bff",   // Màu sắc tiêu đề (thêm màu xanh dương)
                        marginBottom: "20px", // Khoảng cách phía dưới
                        textTransform: "uppercase", // In hoa chữ cái
                        letterSpacing: "2px",  // Giãn cách chữ cái
                        borderBottom: "3px solid #007bff", // Thêm đường viền dưới để làm nổi bật
                        paddingBottom: "5px", // Khoảng cách giữa chữ và đường viền
                        textAlign: "center",  // Căn giữa tiêu đề
                    }}
                >
                    Database
                </h2>
            </div>
        </>
    );
};

export default ExamPaperDetail;
