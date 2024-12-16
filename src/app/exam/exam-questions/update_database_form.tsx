import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { FolderUp } from "lucide-react";
import { checkPermission } from "@/hooks/use-auth";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";


interface UpdateDatabaseProps {
    examPaperId: number; // Pass the JWT token as a prop
}

const UpdateDatabase: React.FC<UpdateDatabaseProps> = ({ examPaperId }) => {
    const [note, setNote] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [sqlFile, setSqlFile] = useState<File | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [error, setError] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const token = localStorage.getItem("jwtToken");

    const hasPermission = checkPermission({ permission: "CREATE_EXAM_DATABASE" });
    if (!hasPermission) {
        return <></>
    }

    // Fetch current database information
    useEffect(() => {
        if (examPaperId) {
            fetch(`${BASE_URL}${API_ENDPOINTS.getDatabase}?examPaperId=${examPaperId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    if (!response.ok) throw new Error("Failed to fetch database information.");
                    return response.json();
                })
                .then((data) => {
                    setNote(data.databaseNote || "");
                    setDescription(data.databaseDescription || "");
                })
                .catch((err) => setError(err.message));
        }
    }, [examPaperId, token]);

    // Handle file input changes
    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setFile: React.Dispatch<React.SetStateAction<File | null>>
    ) => {
        const file = e.target.files?.[0] || null;
        setFile(file);
    };

    // Submit the update request
    const handleUpdateDatabase = async () => {
        if (!examPaperId || !note || !description || !sqlFile || !imageFile) {
            setError("All fields are required, including both files.");
            return;
        }

        const formData = new FormData();
        formData.append("file.sql", sqlFile);
        formData.append("fileimage", imageFile);
        formData.append("examPaperId", examPaperId.toString());
        formData.append("databaseNote", note);
        formData.append("databaseDescription", description);

        try {
            const response = await fetch(
                `${BASE_URL}${API_ENDPOINTS.changeDatabase}?examPaperId=${examPaperId}&databaseNote=${note}&databaseDescription=${description}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update database.");
            }

            setSuccessMessage("Database updated successfully!");
            setError("");
        } catch (err: any) {
            setError(err.message);
            setSuccessMessage("");
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="p-2.5 h-10 w-10 rounded-full border-primary text-primary hover:text-white hover:bg-primary">
                    <FolderUp className="h-6 w-6" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg mx-auto">
                <DialogHeader>
                    <DialogTitle>Update Exam Database</DialogTitle>
                </DialogHeader>

                {/* Note Input */}
                <div className="mb-4">
                    <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                        Database Note
                    </label>
                    <textarea
                        id="note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Enter database note"
                        className="w-full mt-2 p-2 border border-gray-300 rounded text-sm text-gray-500"
                    />
                </div>

                {/* Description Input */}
                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Database Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter database description"
                        className="w-full mt-2 p-2 border border-gray-300 rounded text-sm text-gray-500"
                    />
                </div>

                {/* SQL File Upload */}
                <div className="mb-4">
                    <label htmlFor="sqlFile" className="block text-sm font-medium text-gray-700">
                        SQL File
                    </label>
                    <input
                        type="file"
                        id="sqlFile"
                        accept=".sql"
                        onChange={(e) => handleFileChange(e, setSqlFile)}
                        className="w-full mt-2 text-sm text-gray-500"
                    />
                </div>

                {/* Image File Upload */}
                <div className="mb-4">
                    <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700">
                        Image File
                    </label>
                    <input
                        type="file"
                        id="imageFile"
                        accept=".png, .jpg, .jpeg, .gif"
                        onChange={(e) => handleFileChange(e, setImageFile)}
                        className="w-full mt-2 text-sm text-gray-500"
                    />
                </div>

                {/* Error Message */}
                {error && <p className="text-red-500 mb-4">{error}</p>}

                {/* Success Message */}
                {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

                {/* Action Buttons */}
                <DialogFooter>
                    <Button
                        variant="outline"
                        className="bg-gray-200 text-gray-800"
                        onClick={() => {
                            setNote("");
                            setDescription("");
                            setSqlFile(null);
                            setImageFile(null);
                            setError("");
                            setSuccessMessage("");
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        className="bg-primary text-white hover:bg-primary-dark"
                        onClick={handleUpdateDatabase}
                    >
                        Update Database
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateDatabase;