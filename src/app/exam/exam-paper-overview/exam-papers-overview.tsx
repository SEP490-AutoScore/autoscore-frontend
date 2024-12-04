import { useState, useEffect } from "react";
import { columns } from "@/app/exam/exam-paper-overview/exam-paper-comlums";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { DataTableSkeleton } from "@/app/exam/exam-paper-overview/table-skeleton";
import { NoResultPage, ErrorPage } from '@/app/authentication/error/page';
import { DataTable } from '@/app/exam/exam-paper-overview/data-table';

interface ExamPapers {
    examPaperId: number;
    examPaperCode: string;
    duration: number;
    semester: Semester;
    subject: Subject;
}

interface Semester {
    semesterId: number;
    semesterCode: string;
    semesterName: string;
}

interface Subject {
    subjectId: number;
    subjectCode: string;
    subjectName: string;
}

async function getData(): Promise<ExamPapers[]> {
    // Lấy token từ local storage
    const token = localStorage.getItem("jwtToken");
    if (!token) {
        throw new Error("JWT Token không tồn tại. Vui lòng đăng nhập.");
    }

    // Gửi request POST đến API
    const res = await fetch(`${BASE_URL}${API_ENDPOINTS.getListExamPaper}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    // Xử lý lỗi nếu API không trả về phản hồi hợp lệ
    if (!res.ok) {
        const error = await res.text();
        throw new Error(`Failed to fetch data: ${error}`);
    }

    if (res.status === 204) {
        const dataNull: ExamPapers[] = [];
        return dataNull;
    }
    // Parse và trả về dữ liệu JSON
    const data: ExamPapers[] = await res.json();
    return data;
}

export default function Page() {
    const [data, setData] = useState<ExamPapers[] | null>(null); // State để lưu dữ liệu
    const [error, setError] = useState<string | null>(null); // State để lưu lỗi nếu có

    useEffect(() => {
        // Gọi API khi component được render
        getData()
            .then((fetchedData) => setData(fetchedData))
            .catch((err) => setError(err.message));
    }, []);

    if (error) {
        return <ErrorPage />
    }

    if (!data) {
        return <DataTableSkeleton />;
    }

    if (data.length === 0) {
        return <NoResultPage />;
    }

    return (
        <div className="container mx-auto">
            <DataTable columns={columns} data={data} />
        </div>
    );
}
