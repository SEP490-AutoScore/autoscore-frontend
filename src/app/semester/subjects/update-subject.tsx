import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";

interface UpdateSubjectDialogProps {
    subjectId: number;
    open: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

const UpdateSubjectDialog: React.FC<UpdateSubjectDialogProps> = ({ subjectId, open, onClose, onUpdate }) => {
    const [subjectName, setSubjectName] = useState<string>("");
    const [subjectCode, setSubjectCode] = useState<string>("");
    const showToast = useToastNotification();

    useEffect(() => {
        if (subjectId) {
            const token = localStorage.getItem("jwtToken"); // Retrieve the token from localStorage

            // Fetch the subject details using the subjectId when the dialog is opened
            fetch(`${BASE_URL}${API_ENDPOINTS.getSubject}/${subjectId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch subject details");
                    }
                    return response.json();
                })
                .then((data) => {
                    setSubjectName(data.subjectName);
                    setSubjectCode(data.subjectCode);
                })
                .catch((error) => {
                    console.error("Error fetching subject data:", error);
                });
        }

    }, [subjectId, open]);

    const handleUpdate = () => {
        const token = localStorage.getItem("jwtToken");

        const updatedSubject = {
            subjectName,
            subjectCode,
        };

        fetch(`${BASE_URL}${API_ENDPOINTS.getSubject}/${subjectId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedSubject),
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to update subject.");
                return response.json();
            })
            .then(() => {
                showToast({
                    title: "Update success",
                    description: "Subject updated successfully",
                    variant: "default",
                });
                onUpdate();
                onClose(); // Close the dialog after successful update
            })
            .catch((error) => {
                console.error("Error:", error);
                showToast({
                    title: "Error",
                    description: "Failed to update subject.",
                    variant: "destructive",
                });
            });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <h3>Update Subject</h3>
                </DialogHeader>
                <div>
                    <Label htmlFor="subjectName">Subject Name</Label>
                    <Input
                        id="subjectName"
                        type="text"
                        value={subjectName}
                        onChange={(e) => setSubjectName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="subjectCode">Subject Code</Label>
                    <Input
                        id="subjectCode"
                        type="text"
                        value={subjectCode}
                        onChange={(e) => setSubjectCode(e.target.value)}
                        readOnly // Makes the input field read-only
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

export default UpdateSubjectDialog;
