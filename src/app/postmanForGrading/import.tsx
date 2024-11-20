import React from "react";

export const handleImport = async (selectedFile: File | null, examPaperId: number) => {
    if (!selectedFile) {
        alert("Please select a file before importing.");
        return;
    }

    const formData = new FormData();
    formData.append("files", selectedFile);
    formData.append("examPaperId", examPaperId.toString());

    const controller = new AbortController();
    const timeout = setTimeout(() => {
        controller.abort(); // Hủy yêu cầu nếu vượt quá thời gian chờ
    }, 60000); // 1 phút = 60,000ms

    try {
        const token = localStorage.getItem("jwtToken");
        if (!token) throw new Error("JWT Token không tồn tại. Vui lòng đăng nhập.");

        const response = await fetch("http://localhost:8080/api/exam-paper/import-postman-collections", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
            signal: controller.signal,
        });

        // Xóa bộ đếm thời gian khi yêu cầu hoàn tất
        clearTimeout(timeout);

        // Kiểm tra loại Content-Type
        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
            const result = await response.json();
            if (result.message && result.message.includes("Files imported and validated successfully")) {
                alert("Thành công");
            } else {
                alert(result.message || "Files imported but with issues.");
            }
        } else {
            const resultText = await response.text();
            if (resultText.includes("Files imported and validated successfully")) {
                alert("Thành công");
            } else {
                alert(resultText || "Unexpected response from the server.");
            }
        }
    } catch (err: any) {
        if (err.name === "AbortError") {
            alert("Request timed out. Please try again.");
        } else {
            console.error(err.message || "An unknown error occurred.");
            alert("Failed to import files.");
        }
    }
};
