import React from "react";

export const handleExport = async (examPaperId: number) => {

    

    try {
        const token = localStorage.getItem("jwtToken");
        if (!token) throw new Error("JWT Token không tồn tại. Vui lòng đăng nhập.");

        const response = await fetch(`http://localhost:8080/api/exam-paper/export-postman/${examPaperId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
          
        });

        if (!response.ok) throw new Error("Failed to export Postman collection");

        const blob = await response.blob(); // Đọc phản hồi dưới dạng file blob
        const url = window.URL.createObjectURL(blob); // Tạo URL tạm thời cho file
        const a = document.createElement("a"); // Tạo element <a>
        a.href = url;
        a.download = `exam-paper-${examPaperId}-postman-collection.json`; // Đặt tên file tải về
        document.body.appendChild(a); // Thêm vào DOM để kích hoạt sự kiện click
        a.click();
        document.body.removeChild(a); // Xóa element sau khi tải
        window.URL.revokeObjectURL(url); // Hủy URL tạm thời
    } catch (err: any) {
        console.error(err.message || "An unknown error occurred.");
        alert("Failed to export Postman collection.");
    }
};
