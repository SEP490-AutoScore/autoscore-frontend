import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { useNavigate } from "react-router-dom";

interface UpdateSemesterDialogProps {
  semesterId: number;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const UpdateSemesterDialog: React.FC<UpdateSemesterDialogProps> = ({ semesterId, open, onClose, onUpdate }) => {
  const [semesterName, setSemesterName] = useState<string>("");
  const [semesterCode, setSemesterCode] = useState<string>("");
  const showToast = useToastNotification();
  const navigate = useNavigate();

  useEffect(() => {
    if (semesterId) {
        const token = localStorage.getItem("jwtToken"); // Retrieve the token from localStorage
      
        // Fetch the semester details using the semesterId when the dialog is opened
        fetch(`${BASE_URL}${API_ENDPOINTS.getSemester}/${semesterId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to fetch semester details");
            }
            return response.json();
          })
          .then((data) => {
            setSemesterName(data.semesterName);
            setSemesterCode(data.semesterCode);
          })
          .catch((error) => {
            console.error("Error fetching semester data:", error);
          });
      }
  }, [semesterId, open]);

  const handleUpdate = () => {
    const token = localStorage.getItem("jwtToken");

    const updatedSemester = {
      semesterName,
      semesterCode,
    };

    fetch(`${BASE_URL}${API_ENDPOINTS.getSemester}/${semesterId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedSemester),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to update semester.");
        return response.json();
      })
      .then(() => {
        showToast({
          title: "Update success",
          description: "Semester updated successfully",
          variant: "default",
        });
        navigate(0);
        onUpdate();
        onClose(); // Close the dialog after successful update
      })
      .catch((error) => {
        console.error("Error:", error);
        showToast({
          title: "Error",
          description: "Failed to update semester.",
          variant: "destructive",
        });
      });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <h3>Update Semester</h3>
        </DialogHeader>
        <div>
          <Label htmlFor="semesterName">Semester Name</Label>
          <Input
            id="semesterName"
            type="text"
            value={semesterName}
            onChange={(e) => setSemesterName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="semesterCode">Semester Code</Label>
          <Input
            id="semesterCode"
            type="text"
            value={semesterCode}
            onChange={(e) => setSemesterCode(e.target.value)}
            required
          />
        </div>
        <DialogFooter>
          <Button onClick={handleUpdate} className="bg-green-500 text-white">
            Update
          </Button>
          <Button type="button" onClick={onClose} className="bg-gray-500 text-white">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateSemesterDialog;
