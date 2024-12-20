import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { FilePenLine } from "lucide-react";
import { checkPermission } from "@/hooks/use-auth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";

interface Important {
  importantId: number;
  importantName: string;
}

interface UpdateExamPaperProps {
  examPaperId: number;
  subjectId: number;
  examId: number;
  examPaperStatus?: string;
}

export default function UpdateExamPaper({
  examPaperId,
  subjectId,
  examId,
  examPaperStatus,
}: UpdateExamPaperProps) {
  const [open, setOpen] = useState(false); // Dialog open state
  const [formData, setFormData] = useState({
    examPaperCode: "",
    instruction: "",
    duration: "",
    importantIdList: [] as number[],
  });
  const [importants, setImportants] = useState<Important[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const showToast = useToastNotification();
  const navigate = useNavigate();

  const handleCancel = () => {
    setOpen(false); // Close the dialog
  };

  if (examPaperStatus === "COMPLETE") {
    return <></>;
  }


  // Fetch exam paper details and importants
  useEffect(() => {
    if (!open) return; // Only fetch data when dialog is opened
    const token = localStorage.getItem("jwtToken");

    Promise.all([
      // Fetch exam paper details
      fetch(`${BASE_URL}${API_ENDPOINTS.getExamPaperInfo}/${examPaperId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        if (!response.ok) throw new Error("Failed to fetch exam paper details");
        return response.json();
      }),
      // Fetch list of importants
      fetch(`${BASE_URL}${API_ENDPOINTS.getImportant}?subjectId=${subjectId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        if (!response.ok) throw new Error("Failed to fetch importants");
        return response.json();
      }),
    ])
      .then(([examPaperDetails, importantList]) => {
        setFormData({
          examPaperCode: examPaperDetails.examPaperCode,
          instruction: examPaperDetails.instruction,
          duration: examPaperDetails.duration.toString(),
          importantIdList: examPaperDetails.importantIdList || [],
        });
        setImportants(importantList);
      })
      .catch((err) => setErrorMessage(err.message))
  }, [open, examPaperId, subjectId]);

  // Handle form submission
  const handleFormSubmit = () => {
    const token = localStorage.getItem("jwtToken");
    const duration = Number(formData.duration);

    if (
      !formData.examPaperCode ||
      !formData.instruction ||
      duration <= 0 ||
      isNaN(duration) ||
      formData.importantIdList.length === 0
    ) {
      setErrorMessage("Please fill all fields correctly.");
      return;
    }

    fetch(`${BASE_URL}${API_ENDPOINTS.getExamPaperInfo}/${examPaperId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        examId, // Include examId
        examPaperCode: formData.examPaperCode,
        instruction: formData.instruction,
        duration,
        importantIdList: formData.importantIdList,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update exam paper");
        }
        showToast({
          title: "Update success",
          description: "Exam paper updated successfully.",
          variant: "default",
        });
        return response.json();
      })
      .then(() => {
        setOpen(false); // Close dialog
        navigate(0);
      })
      .catch(() => {
        showToast({
          title: "Update fail",
          description: "Exam paper updated fail.",
          variant: "destructive",
        });
      });
  };

  return (
    <>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setOpen(true)}
              variant="outline"
              className="p-2.5 h-10 w-10 rounded-full border-primary text-primary hover:text-white hover:bg-primary"
              disabled={!checkPermission({ permission: "CREATE_EXAM_PAPER" })}
            >
              <FilePenLine />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Update Exam Paper</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Exam Paper</DialogTitle>
            <DialogClose />
          </DialogHeader>

          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <p>{errorMessage}</p>
            </Alert>
          )}

          <div className="space-y-4">
            <Input
              placeholder="Exam Paper Code"
              value={formData.examPaperCode}
              onChange={(e) =>
                setFormData({ ...formData, examPaperCode: e.target.value })
              }
            />
            <Textarea
              placeholder="Instructions"
              value={formData.instruction}
              onChange={(e) =>
                setFormData({ ...formData, instruction: e.target.value })
              }
              rows={4}
            />
            <Input
              placeholder="Duration (minutes)"
              value={formData.duration}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  duration: e.target.value.replace(/[^0-9]/g, ""),
                })
              }
            />

            <div>
              <strong>Select Important Notes:</strong>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {importants.map((important) => (
                  <div
                    key={important.importantId}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      value={important.importantId}
                      checked={formData.importantIdList.includes(
                        important.importantId
                      )}
                      onChange={(e) => {
                        const id = Number(e.target.value);
                        setFormData((prevData) => {
                          const updatedList = e.target.checked
                            ? [...prevData.importantIdList, id]
                            : prevData.importantIdList.filter(
                                (item) => item !== id
                              );
                          return { ...prevData, importantIdList: updatedList };
                        });
                      }}
                    />
                    <label>{important.importantName}</label>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button
                className="bg-white text-primary hover:bg-primary hover:text-white border border-primary"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                onClick={handleFormSubmit}
                className="bg-primary text-white hover:bg-orange-500"
              >
                Update
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
