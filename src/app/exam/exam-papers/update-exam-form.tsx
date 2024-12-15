import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { PencilLine } from "lucide-react";
import { checkPermission } from "@/hooks/use-auth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Semester {
  semesterId: number;
  semesterName: string;
  semesterCode: string;
}

interface Subject {
  subjectId: number;
  subjectName: string;
  subjectCode: string;
}

interface Exam {
  examId: number;
  examCode: string;
  examAt: string;
  gradingAt: string;
  publishAt: string;
  semester: Semester | null;
  subject: Subject | null;
  type: string;
  status: boolean;
}

interface UpdateExamDialogProps {
  examId: number;
  onUpdateSuccess?: () => void; // Callback khi cập nhật thành công
}

const UpdateExamDialog: React.FC<UpdateExamDialogProps> = ({
  examId,
  onUpdateSuccess,
}) => {
  const [exam, setExam] = useState<Exam | null>(null);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const token = localStorage.getItem("jwtToken");
  const showToast = useToastNotification();
  const hasPermission = checkPermission({ permission: "CREATE_EXAM"});
  if (!hasPermission) {
    return <></>
  }

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}${API_ENDPOINTS.createExam}${examId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch exam data.");
        const data: Exam = await response.json();
        setExam(data);
      } catch (err) {
        const errorMessage =
          (err as Error).message || "Error fetching exam data.";
        setError(errorMessage);
        showToast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    };

    const fetchSemesters = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}${API_ENDPOINTS.getSemester}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch semesters.");
        const data: Semester[] = await response.json();
        setSemesters(data);
      } catch (err) {
        const errorMessage =
          (err as Error).message || "Error fetching semesters.";
        setError(errorMessage);
        showToast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    };

    const fetchSubjects = async () => {
      try {
        const response = await fetch(`${BASE_URL}${API_ENDPOINTS.getSubject}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch subjects.");
        const data: Subject[] = await response.json();
        setSubjects(data);
      } catch (err) {
        const errorMessage =
          (err as Error).message || "Error fetching subjects.";
        setError(errorMessage);
        showToast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    };

    if (dialogOpen) {
      fetchExam();
      fetchSemesters();
      fetchSubjects();
    }
  }, [examId, dialogOpen]);

  const handleUpdate = async () => {
    if (!exam) return;

    const requestBody = {
      examCode: exam.examCode,
      examAt: exam.examAt,
      gradingAt: exam.gradingAt,
      publishAt: exam.publishAt,
      subjectId: exam.subject?.subjectId || 0,
      semesterId: exam.semester?.semesterId || 0,
    };

    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.createExam}${examId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update exam.");
      }

      if (onUpdateSuccess) {
        onUpdateSuccess(); // Gọi callback khi cập nhật thành công
      }

      showToast({
        title: "Update success",
        description: "Exam updated successfully.",
        variant: "default",
      });

      // Tự động reload lại trang
      window.location.reload(); // Trang sẽ reload lại sau khi cập nhật thành công
    } catch (err) {
      const errorMessage = (err as Error).message || "Error updating exam.";
      showToast({
        title: "Update failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setDialogOpen(true)}
              variant="outline"
              className="p-2.5 h-10 w-10 rounded-full border-primary text-primary hover:text-white hover:bg-primary"
            >
              <PencilLine />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Update Exam</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>{/* Trigger handled above */}</DialogTrigger>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Update Exam</DialogTitle>
          </DialogHeader>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {exam ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate();
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="examCode">Exam Code</Label>
                <Input
                  id="examCode"
                  value={exam.examCode}
                  onChange={(e) =>
                    setExam({ ...exam, examCode: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="examAt">Exam Date</Label>
                <Input
                  id="examAt"
                  type="datetime-local"
                  value={exam.examAt}
                  onChange={(e) => setExam({ ...exam, examAt: e.target.value })}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <Label htmlFor="gradingAt">Grading Date</Label>
                <div className="relative w-full">
                  <Input
                    id="gradingAt"
                    type="datetime-local"
                    value={exam.gradingAt}
                    onChange={(e) =>
                      setExam({ ...exam, gradingAt: e.target.value })
                    }
                    required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="publishAt">Publish Date</Label>
                <Input
                  id="publishAt"
                  type="datetime-local"
                  value={exam.publishAt}
                  onChange={(e) =>
                    setExam({ ...exam, publishAt: e.target.value })
                  }
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <div
                  id="type"
                  className="w-full p-2 border rounded bg-gray-100 text-gray-700"
                >
                  {exam.type === "EXAM" ? "Exam" : "Assignment"}
                </div>
              </div>
              <div>
                <Label htmlFor="semester">Semester</Label>
                <select
                  id="semester"
                  value={exam.semester?.semesterId || ""}
                  onChange={(e) =>
                    setExam({
                      ...exam,
                      semester:
                        semesters.find(
                          (sem) => sem.semesterId === Number(e.target.value)
                        ) || null,
                    })
                  }
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select a semester</option>
                  {semesters.map((semester) => (
                    <option
                      key={semester.semesterId}
                      value={semester.semesterId}
                    >
                      {semester.semesterName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <select
                  id="subject"
                  value={exam.subject?.subjectId || ""}
                  onChange={(e) =>
                    setExam({
                      ...exam,
                      subject:
                        subjects.find(
                          (sub) => sub.subjectId === Number(e.target.value)
                        ) || null,
                    })
                  }
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select a subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.subjectId} value={subject.subjectId}>
                      {subject.subjectName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  onClick={() => setDialogOpen(false)}
                  className="bg-gray-300 text-black hover:bg-gray-400"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-500 text-white hover:bg-blue-600"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update"}
                </Button>
              </div>
            </form>
          ) : (
            <p>Loading...</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpdateExamDialog;
