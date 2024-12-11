import React, { useEffect, useState } from "react";

interface DropdownProps {
  onSelect: (selected: string) => void;
}

export const DropdownList: React.FC<DropdownProps> = ({ onSelect }) => {
  const [items, setItems] = useState([]);
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
        const response = await fetch("http://localhost:8080/api/exam/list-exam-exampaper", {
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
        setError(err.message);
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
      {items.map((item: any) => (
        <option key={item.examPaperId} value={item.examPaperId}>
          {item.examCode} - {item.examPaperCode}
        </option>
      ))}
    </select>
  );
};
