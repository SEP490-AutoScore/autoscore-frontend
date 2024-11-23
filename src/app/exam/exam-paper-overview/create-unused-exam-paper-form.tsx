"use client";

import * as React from "react";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface Subject {
  subjectId: number;
  subjectName: string;
}

interface Important {
  importantId: number;
  importantName: string;
}

interface CreateExamPaperDialogProps {
  onExamPaperCreated?: () => void; // Callback to refresh data after successful creation
}

export const CreateExamPaperDialog: React.FC<CreateExamPaperDialogProps> = ({
  onExamPaperCreated,
}) => {
  const [examPaperCode, setExamPaperCode] = React.useState<string>("");
  const [duration, setDuration] = React.useState<number>(0);
  const [instruction, setInstruction] = React.useState<string>("");
  const [, setExamId] = React.useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = React.useState<number | null>(
    null
  );
  const [subjects, setSubjects] = React.useState<Subject[]>([]);
  const [importants, setImportants] = React.useState<Important[]>([]);
  const [selectedImportants, setSelectedImportants] = React.useState<Set<number>>(
    new Set()
  );
  const [error, setError] = React.useState<string>("");

  React.useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.getSubject}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch subjects");

      const data: Subject[] = await response.json();
      setSubjects(data);
    } catch (err: any) {
      setError(err.message || "Error fetching subjects");
    }
  };

  const handleSubjectChange = async (subjectId: number) => {
    setSelectedSubject(subjectId);

    try {
      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.getImportant}?subjectId=${subjectId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch importants");
      }
      if (response.status === 204) {
        setImportants([]);
      } else {
        const data: Important[] = await response.json();
        setImportants(data);
        setSelectedImportants(new Set()); // Reset selected importants
      }
    } catch (err: any) {
      setError(err.message || "Error fetching importants");
    }
  };

  const handleImportantChange = (importantId: number) => {
    setSelectedImportants((prev) => {
      const updated = new Set(prev);
      if (updated.has(importantId)) {
        updated.delete(importantId);
      } else {
        updated.add(importantId);
      }
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (!examPaperCode || duration <= 0 || !selectedSubject) {
      setError("Please fill out all fields correctly.");
      return;
    }
    try {
      const examId = 0;
      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.getExamInfo}/new`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
          body: JSON.stringify({
            examPaperCode,
            examId,
            duration,
            instruction,
            importantIdList: Array.from(selectedImportants),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create exam paper");
      }

      alert("Exam paper created successfully!");
      setExamPaperCode("");
      setDuration(0);
      setInstruction("");
      setExamId(null);
      setSelectedSubject(null);
      setImportants([]);
      setSelectedImportants(new Set());

      if (onExamPaperCreated) onExamPaperCreated();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-primary border-primary rounded-full px-6 ml-5"
        >
          Add New
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle>Create New Exam Paper</DialogTitle>
        </DialogHeader>

        {error && <p className="text-red-500">{error}</p>}

        <div className="space-y-4 mt-4">
          {/* Exam Paper Code */}
          <div>
            <label htmlFor="examPaperCode" className="block text-sm font-medium text-gray-700">
              Exam Paper Code
            </label>
            <input
              id="examPaperCode"
              type="text"
              value={examPaperCode}
              onChange={(e) => setExamPaperCode(e.target.value)}
              placeholder="Enter exam paper code"
              className="w-full mt-2 p-2 border rounded-md"
            />
          </div>

          {/* Instruction */}
          <div>
            <label htmlFor="instruction" className="block text-sm font-medium text-gray-700">
              Instruction
            </label>
            <textarea
              id="instruction"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="Enter instructions"
              className="w-full mt-2 p-2 border rounded-md"
            />
          </div>

          {/* Duration */}
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
              Duration (minutes)
            </label>
            <input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              onKeyPress={(e) => {
                if (!/^\d$/.test(e.key)) e.preventDefault(); // Allow only numbers
              }}
              min="1"
              placeholder="Enter duration"
              className="w-full mt-2 p-2 border rounded-md"
            />
          </div>

          {/* Subject Selection */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
              Subject
            </label>
            <select
              id="subject"
              value={selectedSubject || ""}
              onChange={(e) => handleSubjectChange(Number(e.target.value))}
              className="w-full mt-2 p-2 border rounded-md"
            >
              <option value="">Select a subject</option>
              {subjects.map((subject) => (
                <option key={subject.subjectId} value={subject.subjectId}>
                  {subject.subjectName}
                </option>
              ))}
            </select>
          </div>

          {/* Importants List */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Importants
            </label>
            <ul className="mt-2 space-y-2">
              {importants.map((important) => (
                <li key={important.importantId} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedImportants.has(important.importantId)}
                    onChange={() => handleImportantChange(important.importantId)}
                    className="mr-2"
                  />
                  {important.importantName}
                </li>
              ))}
              {importants.length === 0 && (
                <li className="text-gray-500">No importants found.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end space-x-4">
          <DialogClose asChild>
            <Button variant="outline" className="text-gray-700 border-gray-300 hover:bg-gray-100">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit} className="bg-primary text-white hover:bg-primary/90">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
