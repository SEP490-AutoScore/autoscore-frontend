import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";

type TopStudentDTO = {
  studentCode: string;
  studentEmail: string;
  totalScore: number;
  examCode: string;
};

export function TableStudentComponent() {
  const [topStudents, setTopStudents] = useState<TopStudentDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const studentsPerPage = 9;

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setError("JWT token not found.");
      setLoading(false);
      return;
    }
    const fetchTopStudents = async () => {
      try {
        const response = await fetch(`${BASE_URL}${API_ENDPOINTS.topStudents}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data: TopStudentDTO[] = await response.json();
          setTopStudents(data);
        } else {
          const errorData = await response.text();
          setError(errorData);
        }
      } catch (err) {
        setError("An error occurred while fetching the top students.");
      } finally {
        setLoading(false);
      }
    };
    fetchTopStudents();
  }, []);

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = topStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const goToNextPage = () => {
    if (currentPage < Math.ceil(topStudents.length / studentsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
      <div className="text-l font-semibold ml-2">Top Students </div>
      <div className="text-sm text-gray-500 mb-4 ml-2">20 students with the highest scores</div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student Code</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Total Score</TableHead>
            <TableHead>Exam Code</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-red-500">
                {error}
              </TableCell>
            </TableRow>
          ) : currentStudents.length > 0 ? (
            currentStudents.map((student) => (
              <TableRow key={student.studentCode}>
                <TableCell className="font-medium">{student.studentCode}</TableCell>
                <TableCell>{student.studentEmail}</TableCell>
                <TableCell>{student.totalScore}</TableCell>
                <TableCell>{student.examCode}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No students found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex justify-end items-center mt-4 gap-4">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 border rounded ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          Previous
        </button>
        <span className="text-sm">
          Page {currentPage} of {Math.ceil(topStudents.length / studentsPerPage)}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === Math.ceil(topStudents.length / studentsPerPage)}
          className={`px-4 py-2 border rounded ${currentPage === Math.ceil(topStudents.length / studentsPerPage)
            ? "opacity-50 cursor-not-allowed"
            : ""
            }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
