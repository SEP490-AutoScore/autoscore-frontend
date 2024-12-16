import { API_ENDPOINTS, BASE_URL } from "@/config/apiConfig";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
// import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Analysis page</h2>
        <p className="text-muted-foreground">
          These are charts to analyze scores of each exam paper
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="mt-3 ml-auto text-primary border-primary rounded-full px-6">
            Select An Exam Paper
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-50">
          <DropdownMenuLabel>Available Exam Paper</DropdownMenuLabel>
          {items.map((item) => (
            <DropdownMenuItem key={item.examPaperId} onClick={() => onSelect(item.examPaperId)}>
              {item.examCode} - {item.examPaperCode}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};