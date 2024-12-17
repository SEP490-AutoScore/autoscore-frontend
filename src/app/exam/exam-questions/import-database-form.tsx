import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { checkPermission } from "@/hooks/use-auth";
import { FolderUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";

interface AddDatabaseFormProps {
  examPaperId: number;
  onAddSuccess: () => void;
}

const AddDatabaseForm: React.FC<AddDatabaseFormProps> = ({
  examPaperId,
  onAddSuccess,
}) => {
  const [note, setNote] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [sqlFile, setSqlFile] = React.useState<File | null>(null);
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string>("");
  const token = localStorage.getItem("jwtToken");
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const navigate = useNavigate();

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFile(file);
  };

  const handleAddDatabase = async () => {
    if (!note || !description || !sqlFile || !imageFile) {
      setError("Please fill in all fields and upload both files.");
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
        `${BASE_URL}${API_ENDPOINTS.importDatabase}?examPaperId=${examPaperId}&databaseNote=${note}&databaseDescription=${description}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add database");
      }
      navigate(0);
      onAddSuccess(); // Notify parent component to reload data
    } catch (err: any) {
      setError(err.message);
    }
  };
  const hasPermission = checkPermission({ permission: "CREATE_EXAM_DATABASE" });
  if (!hasPermission) {
    return <></>;
  }

  return (
    <>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsOpen(true)}
              variant="outline"
              className="p-2.5 h-10 w-10 rounded-full border-primary text-primary hover:text-white hover:bg-primary"
            >
              <FolderUp />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Import Database</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full h-[80vh] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Database</DialogTitle>
            <DialogDescription>
              Please fill in the details for the new database.
            </DialogDescription>
          </DialogHeader>
          {error && <p className="text-red-500">{error}</p>}

          {/* Note Textarea */}
          <div className="mt-4">
            <label
              className="block text-sm font-semibold text-gray-700"
              htmlFor="note"
            >
              Database Note
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter a brief note about the database"
              className="w-full mt-2 p-2 border border-gray-300 rounded text-sm text-gray-500"
            />
          </div>

          {/* Description Textarea */}
          <div className="mt-4">
            <label
              className="block text-sm font-semibold text-gray-700"
              htmlFor="description"
            >
              Database Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a detailed description of the database"
              className="w-full mt-2 p-2 border border-gray-300 rounded text-sm text-gray-500"
            />
          </div>

          {/* SQL File Upload */}
          <div className="mt-4">
            <label
              className="block text-sm font-semibold text-gray-700"
              htmlFor="sqlFile"
            >
              SQL File
            </label>
            <input
              type="file"
              id="sqlFile"
              accept=".sql"
              onChange={(e) => handleFileChange(e, setSqlFile)}
              className="w-full mt-2 text-sm text-gray-500 file:border file:border-gray-300 file:rounded file:p-2 file:text-sm file:bg-white file:text-black file:hover:bg-gray-100"
            />
          </div>

          {/* Image File Upload */}
          <div className="mt-4">
            <label
              className="block text-sm font-semibold text-gray-700"
              htmlFor="imageFile"
            >
              Image File
            </label>
            <input
              type="file"
              id="imageFile"
              accept=".png, .jpg, .jpeg, .gif"
              onChange={(e) => handleFileChange(e, setImageFile)}
              className="w-full mt-2 text-sm text-gray-500 file:border file:border-gray-300 file:rounded file:p-2 file:text-sm file:bg-white file:text-black file:hover:bg-gray-100"
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex justify-end space-x-4">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="w-auto border border-gray-300 text-black bg-white hover:bg-blue-500 hover:text-white transition-colors duration-200"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleAddDatabase}
              className="w-auto border border-gray-300 text-black bg-white hover:bg-orange-500 hover:text-white transition-colors duration-200"
            >
              Add Database
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddDatabaseForm;
