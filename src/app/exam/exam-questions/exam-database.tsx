import { FC, useEffect, useState } from "react";
import { CardContent, CardHeader } from "@/components/ui/card";
import AddDatabaseForm from "./import-database-form";
import UpdateDatabase from "@/app/exam/exam-questions/update_database_form";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FilePenLine, Telescope, Upload } from "lucide-react";

interface DatabaseResponse {
  examDatabaseId: number;
  databaseScript: string;
  databaseDescription: string;
  databaseName: string;
  databaseImage: string; // Base64 string
  databaseNote: string;
  status: string;
  createdAt: string;
  createdBy: number;
  updatedAt: number;
  updatedBy: number;
  deletedAt: string | null;
  deletedBy: number | null;
  examPaperId: number;
}

interface DatabaseInfoProps {
  examPaperId: number;
}

const DatabaseInfoComponent: FC<DatabaseInfoProps> = ({ examPaperId }) => {
  const [database, setDatabase] = useState<DatabaseResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const token = localStorage.getItem("jwtToken");

  const handleCancel = () => {
    setIsOpen(false); // Close the dialog
  };

  const fetchDatabase = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.getDatabase}?examPaperId=${examPaperId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 204) {
        setDatabase(null);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch database information");
      }

      const data: DatabaseResponse = await response.json();
      setDatabase(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatabase();
  }, [examPaperId, token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!database) {
    return (
      <div className="space-y-4 mx-2">
        <div className="mx-4">
          <Separator className="h-1 bg-primary rounded" />
        </div>
        <CardHeader className="font-semibold text-2xl p-4">
          <div className="flex justify-between items-center">
            Database Information
            <div className="space-x-2">
              <AddDatabaseForm
                examPaperId={examPaperId}
                onAddSuccess={fetchDatabase}
              />

              <UpdateDatabase examPaperId={examPaperId} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 text-sm space-y-4">
          {/* Flex container cho nội dung bên trái và nút bên phải */}
          <div className="flex justify-between items-center">
            {/* Phần bên trái hiển thị thông tin về DB nếu đã được thêm */}
              <p className="mt-2 text-sm">
                No related database information found for this exam paper.
              </p>
          </div>
        </CardContent>
      </div>
    );
  }

  const imageSrc = `data:image/png;base64,${database.databaseImage}`;

  return (
    <div className="space-y-4 mx-2">
      <div className="mx-4">
        <Separator className="h-1 bg-primary rounded" />
      </div>
      <CardHeader className="font-semibold text-2xl p-4">
        <div className="flex justify-between items-center">
          Database Information
          <div className="space-x-2">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setIsOpen(true)}
                    variant="outline"
                    className="p-2.5 h-10 w-10 rounded-full border-primary text-primary hover:text-white hover:bg-primary"
                  >
                    <Telescope />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View Script</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <UpdateDatabase examPaperId={examPaperId} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 text-base space-y-4">
        <div>
          <p className="text-sm">{database.databaseDescription || "N/A"}</p>
        </div>
        <div>
          {database.databaseImage && (
            <div className="flex justify-center items-center">
              <div className="max-w-lg max-h-96 overflow-hidden">
                <img
                  src={imageSrc}
                  alt={database.databaseName}
                  className="w-full h-auto object-contain border rounded shadow-md"
                />
              </div>
            </div>
          )}
        </div>
        <div>
          <span className="font-semibold text-lg mb-2">Note: </span>
          <span className="text-sm">{database.databaseNote || "N/A"}</span>
        </div>
      </CardContent>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-4">Database Script</DialogTitle>
            <DialogDescription>
              <pre className="whitespace-pre-wrap h-full max-h-96 overflow-y-auto p-2 border rounded">
                {database.databaseScript || "N/A"}
              </pre>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex justify-end space-x-4 mt-4">
              <Button
                className="bg-white text-primary hover:bg-primary hover:text-white border border-primary"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DatabaseInfoComponent;
