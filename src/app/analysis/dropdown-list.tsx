import { API_ENDPOINTS, BASE_URL } from "@/config/apiConfig";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
  const [position, setPosition] = useState<string | "">("");
  const [selectedItem, setSelectedItem] = useState<string | "">("");

  useEffect(() => {
    const fetchExams = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setError("JWT token not found.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${BASE_URL}${API_ENDPOINTS.dropdownList}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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

  const handleSelectPosition = (examPaperId: string) => {
    setPosition(examPaperId);
    onSelect(examPaperId);
  };
  
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
          <Button variant="outline" className="mt-3 ml-auto  px-6">
            {selectedItem || "Select An Exam Paper"}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit">
          <DropdownMenuLabel>Available Exam Paper</DropdownMenuLabel>
          <Separator />
          <DropdownMenuRadioGroup value={position} onValueChange={handleSelectPosition}>
            {items.map((item) => (
              <DropdownMenuRadioItem
                key={item.examPaperId}
                value={item.examPaperId}
                className="cursor-pointer"
                onClick={() => {
                  setSelectedItem(item.examCode + " - " + item.examPaperCode);
                  onSelect(item.examPaperId);
                }}
              >
                {item.examCode} - {item.examPaperCode}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
