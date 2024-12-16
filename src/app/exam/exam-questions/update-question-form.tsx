import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { FileCog } from "lucide-react";
import { checkPermission } from "@/hooks/use-auth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UpdateQuestionProps {
  examPaperId: number;
  questionId: number;
}

const defaultFormData = (examPaperId: number) => ({
  questionContent: "",
  examQuestionScore: 0,
  endPoint: "",
  roleAllow: "",
  httpMethod: "",
  description: "",
  payloadType: "",
  payload: "",
  validation: "",
  sucessResponse: "",
  errorResponse: "",
  orderBy: 0,
  examPaperId: examPaperId,
});

export default function UpdateQuestion({
  examPaperId,
  questionId,
}: UpdateQuestionProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData(examPaperId));
  const [, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const showToast = useToastNotification();

  const token = localStorage.getItem("jwtToken");

  const handleCancel = () => {
    setOpen(false); // Close the dialog
  };


  // Fetch question details when dialog opens
  useEffect(() => {
    if (!open) return;

    setLoading(true);
    fetch(`${BASE_URL}${API_ENDPOINTS.getQuestion}/${questionId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch question details");
        return response.json();
      })
      .then((data) => setFormData((prev) => ({ ...prev, ...data })))
      .catch((err) => setErrorMessage(err.message))
      .finally(() => setLoading(false));
  }, [open, questionId, token]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFormSubmit = () => {
    if (!formData.questionContent || formData.examQuestionScore <= 0) {
      setErrorMessage("Please fill in all fields correctly.");
      return;
    }

    if (!["JSON", "URL Parameter"].includes(formData.payloadType || "")) {
      setErrorMessage("Invalid Payload Type selected.");
      return;
    }

    if (!["GET", "POST", "PUT", "DELETE"].includes(formData.httpMethod)) {
      setErrorMessage("Invalid HTTP Method selected.");
      return;
    }

    setSubmitting(true);

    const payload = { ...formData, examPaperId };

    fetch(`${BASE_URL}${API_ENDPOINTS.getQuestion}/${questionId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to update question");
        showToast({
          title: "Update Success",
          description: "Question updated successfully.",
          variant: "default",
        });
        setOpen(false);
      })
      .catch((err) => setErrorMessage(err.message))
      .finally(() => setSubmitting(false));
  };

  const hasPermission = checkPermission({ permission: "CREATE_QUESTION" });
  if (!hasPermission) {
    return <></>;
  }

  return (
    <>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setOpen(true)}
              variant="outline"
              className="p-2.5 h-10 w-10 rounded-full border-primary text-primary hover:text-white hover:bg-primary"
            >
              <FileCog />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Update Question</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[80vw] max-w-4xl h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Question</DialogTitle>
            <DialogClose />
          </DialogHeader>
          {loading ? (
            <div className="text-center">
              <p>Loading...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="payloadType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Question Content
                </label>
                <Input
                  type="text"
                  value={formData.questionContent}
                  onChange={(e) =>
                    handleInputChange("questionContent", e.target.value)
                  }
                  required
                />
              </div>

              {/* Score and Role Allow in the Same Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="examQuestionScore"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Exam Question Score
                  </label>
                  <Input
                    id="examQuestionScore"
                    placeholder="Exam Question Score"
                    type="number"
                    value={formData.examQuestionScore}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (value >= 0) {
                        handleInputChange("examQuestionScore", value);
                      }
                    }}
                    min={0}
                    max={10}
                    step="0.1"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="roleAllow"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Role Allow
                  </label>
                  <Input
                    id="roleAllow"
                    placeholder="Role Allow"
                    value={formData.roleAllow}
                    onChange={(e) =>
                      handleInputChange("roleAllow", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* HTTP Method and End Point in the Same Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="httpMethod"
                    className="block text-sm font-medium text-gray-700"
                  >
                    HTTP Method
                  </label>
                  <select
                    id="httpMethod"
                    value={formData.httpMethod}
                    onChange={(e) =>
                      handleInputChange("httpMethod", e.target.value)
                    }
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="endPoint"
                    className="block text-sm font-medium text-gray-700"
                  >
                    End Point
                  </label>
                  <Input
                    id="endPoint"
                    placeholder="End Point"
                    value={formData.endPoint}
                    onChange={(e) =>
                      handleInputChange("endPoint", e.target.value)
                    }
                  />
                </div>
              </div>

              <label
                htmlFor="payloadType"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <Textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={3}
              />

              {/* Payload Type */}
              <div>
                <label
                  htmlFor="payloadType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Payload Type
                </label>
                <select
                  id="payloadType"
                  value={formData.payloadType || ""}
                  onChange={(e) =>
                    handleInputChange("payloadType", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Type</option>
                  <option value="JSON">JSON</option>
                  <option value="URL Parameter">URL Parameter</option>
                </select>
              </div>

              <label
                htmlFor="payloadType"
                className="block text-sm font-medium text-gray-700"
              >
                Payload
              </label>
              <Textarea
                placeholder="Payload"
                value={formData.payload}
                onChange={(e) => handleInputChange("payload", e.target.value)}
                rows={3}
              />
              <label
                htmlFor="payloadType"
                className="block text-sm font-medium text-gray-700"
              >
                Validation
              </label>
              <Textarea
                placeholder="Validation"
                value={formData.validation}
                onChange={(e) =>
                  handleInputChange("validation", e.target.value)
                }
                rows={3}
              />
              <label
                htmlFor="payloadType"
                className="block text-sm font-medium text-gray-700"
              >
                Success Response
              </label>
              <Textarea
                placeholder="Success Response"
                value={formData.sucessResponse}
                onChange={(e) =>
                  handleInputChange("sucessResponse", e.target.value)
                }
                rows={3}
              />
              <label
                htmlFor="payloadType"
                className="block text-sm font-medium text-gray-700"
              >
                Error Response
              </label>
              <Textarea
                placeholder="Error Response"
                value={formData.errorResponse}
                onChange={(e) =>
                  handleInputChange("errorResponse", e.target.value)
                }
                rows={3}
              />
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
                  disabled={submitting}
                >
                  {submitting ? "Updating..." : "Update"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
