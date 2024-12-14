import { API_ENDPOINTS, BASE_URL } from "@/config/apiConfig";
import React, { useEffect, useState } from "react";

interface DropdownProps {
  onSelect: (selected: string) => void;
}

interface ExamItem {
  examPaperId: string;
  examCode: string;
  examPaperCode: string;
}

export const DropdownList: React.FC<DropdownProps> = ({ onSelect }) => {
  const [items, setItems] = useState<ExamItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExams = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setError("JWT token not found.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}${API_ENDPOINTS.dropdownList}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching exams: ${response.statusText}`);
        }

        const data = await response.json();
        setItems(data);
        setLoading(false);
      } catch (err) {
        setError("An error occurred while fetching data." + err);
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <select onChange={(e) => onSelect(e.target.value)} className="border p-2 rounded">
      <option value="" disabled selected>
        Select an exam
      </option>
      {items.map((item) => (
        <option key={item.examPaperId} value={item.examPaperId}>
          {item.examCode} - {item.examPaperCode}
        </option>
      ))}
    </select>
  );
};
