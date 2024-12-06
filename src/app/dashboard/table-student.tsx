import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
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

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      setError("JWT token not found.");
      setLoading(false);
      return;
    }

    // Fetch top students
    const fetchTopStudents = async () => {
      try {
        const response = await fetch(`${BASE_URL}${API_ENDPOINTS.topStudents}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`, // Send token in header
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data: TopStudentDTO[] = await response.json();
          setTopStudents(data); // Set fetched data
        } else {
          const errorData = await response.text();
          setError(errorData); // Display error message
        }
      } catch (err) {
        setError("An error occurred while fetching the top students.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopStudents();
  }, []); // Empty dependency array to fetch data once on component mount

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption>A list of top students based on their scores.</TableCaption>
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
          ) : (
            topStudents.map((student) => (
              <TableRow key={student.studentCode}>
                <TableCell className="font-medium">{student.studentCode}</TableCell>
                <TableCell>{student.studentEmail}</TableCell>
                <TableCell>{student.totalScore}</TableCell>
                <TableCell>{student.examCode}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total Students</TableCell>
            <TableCell className="text-right">{topStudents.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}