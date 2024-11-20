import { useHeader } from "@/hooks/use-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { useState, useEffect } from "react";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { useNavigate } from "react-router-dom";

export default function Page() {
  const Header = useHeader({
    breadcrumbLink: "/exams",
    breadcrumbPage: "Exams Overview",
    breadcrumbLink_2: "/new-exam",
    breadcrumbPage_2: "New Exam",
  });

  const navigate = useNavigate();

  const [subjectList, setSubjectList] = useState<
    { subjectId: number; subjectCode: string; subjectName: string }[]
  >([]);
  const [semesterList, setSemesterList] = useState<
    { semesterId: number; semesterCode: string; semesterName: string }[]
  >([]);
  const [examData, setExamData] = useState({
    examCode: "",
    examAt: "",
    gradingAt: "",
    publishAt: "",
    subjectId: "",
    semesterId: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setExamData((prev) => ({ ...prev, [name]: value }));
  };

  const showToast = useToastNotification();

  const token = localStorage.getItem("jwtToken");
  if (!token) {
    throw new Error("JWT Token không tồn tại. Vui lòng đăng nhập.");
  }

  // Fetch subjects from API
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/subject", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch subjects");
        }

        const data = await response.json();
        setSubjectList(data); // Assuming API returns an array of subjects
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubjects();
  }, [token]);

  // Fetch semesters from API
  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/semester", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch semesters");
        }

        const data = await response.json();
        setSemesterList(data); // Assuming API returns an array of semesters
      } catch (error) {
        console.error("Error fetching semesters:", error);
      }
    };

    fetchSemesters();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/exam/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...examData,
          subjectId: parseInt(examData.subjectId),
          semesterId: parseInt(examData.semesterId),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create exam");
      }

      showToast({
        title: "Create success",
        description: "New exam has been created successfully",
        variant: "default",
      });

      // Navigate to the exams page
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Exam Code</label>
              <input
                type="text"
                name="examCode"
                value={examData.examCode}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Exam Date & Time</label>
              <input
                type="datetime-local"
                name="examAt"
                value={examData.examAt}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Grading Date & Time</label>
              <input
                type="datetime-local"
                name="gradingAt"
                value={examData.gradingAt}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Publish Date & Time</label>
              <input
                type="datetime-local"
                name="publishAt"
                value={examData.publishAt}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Subject</label>
              <select
                name="subjectId"
                value={examData.subjectId}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Select a subject</option>
                {subjectList.map((subject) => (
                  <option key={subject.subjectId} value={subject.subjectId}>
                    {subject.subjectName} ({subject.subjectCode})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Semester</label>
              <select
                name="semesterId"
                value={examData.semesterId}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Select a semester</option>
                {semesterList.map((semester) => (
                  <option key={semester.semesterId} value={semester.semesterId}>
                    {semester.semesterName} ({semester.semesterCode})
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            >
              Create Exam
            </button>
          </form>
        </div>
      </div>
    </SidebarInset>
  );
}
