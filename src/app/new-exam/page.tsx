import { useHeader } from "@/hooks/use-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CreateExamForm from "./create-form";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";

export default function Page() {
  const Header = useHeader({
    breadcrumbLink: "/exams",
    breadcrumbPage: "Exams Overview",
    breadcrumbLink_2: "/new-exam",
    breadcrumbPage_2: "New Exam",
  });

  const navigate = useNavigate();
  const showToast = useToastNotification();

  const [subjectList, setSubjectList] = useState([]);
  const [semesterList, setSemesterList] = useState([]);

  const token = localStorage.getItem("jwtToken");
  if (!token) {
    throw new Error("JWT Token không tồn tại. Vui lòng đăng nhập.");
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subjectsRes, semestersRes] = await Promise.all([
          fetch(`${BASE_URL}${API_ENDPOINTS.getSubject}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${BASE_URL}${API_ENDPOINTS.getSemester}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!subjectsRes.ok || !semestersRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const subjects = await subjectsRes.json();
        const semesters = await semestersRes.json();

        setSubjectList(subjects);
        setSemesterList(semesters);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

  const handleFormSubmit = async (data: {
    examCode: string;
    examAt: string;
    gradingAt: string;
    publishAt: string;
    subjectId: number;
    semesterId: number;
  }) => {
    try {
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.createExam}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create exam");
      }

      showToast({
        title: "Create success",
        description: "New exam has been created successfully",
        variant: "default",
      });

      navigate("/exams");
    } catch (error) {
      showToast({
        title: "Bad Request.",
        description: "There was a problem with your request.",
        variant: "destructive",
      });
    }
  };

  return (
    <SidebarInset>
      {Header}
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
          <h1 className="text-2xl font-bold mb-4">Create Exam</h1>
          <CreateExamForm
            subjectList={subjectList}
            semesterList={semesterList}
            onSubmit={handleFormSubmit}
          />
        </div>
      </div>
    </SidebarInset>
  );
}
