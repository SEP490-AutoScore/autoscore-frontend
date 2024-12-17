import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_ENDPOINTS, BASE_URL } from "@/config/apiConfig";
import { checkPermission } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";

const CreateSemesterDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [semesterName, setSemesterName] = useState<string>('');
  const [semesterCode, setSemesterCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCreateSemester = async () => {
    setLoading(true);
    setMessage(null);

    const payload = {
      semesterName,
      semesterCode,
    };

    try {
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.getSemester}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setMessage('Semester created successfully!');
        setSemesterName('');
        setSemesterCode('');
        navigate(0);
        setIsOpen(false); // Đóng dialog sau khi tạo thành công
        window.location.reload(); // Reload lại trang
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.message || 'Failed to create semester.'}`);
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const hasPermission = checkPermission({ permission: "CREATE_SEMESTER" });
  if (!hasPermission) {
    return <></>
  }

  return (
    <div>
      {/* Nút mở dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className='ml-auto text-primary border-primary rounded-full px-6'>Create New Semester</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Semester</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="semesterName" className="block text-sm font-medium text-gray-700">
                Semester Name
              </label>
              <Input
                id="semesterName"
                type="text"
                value={semesterName}
                onChange={(e) => setSemesterName(e.target.value)}
                placeholder="Enter semester name"
              />
            </div>
            <div>
              <label htmlFor="semesterCode" className="block text-sm font-medium text-gray-700">
                Semester Code
              </label>
              <Input
                id="semesterCode"
                type="text"
                value={semesterCode}
                onChange={(e) => setSemesterCode(e.target.value)}
                placeholder="Enter semester code"
              />
            </div>
          </div>
          {/* Footer */}
          <DialogFooter>
            <Button onClick={() => setIsOpen(false)} variant="secondary">
              Cancel
            </Button>
            <Button
              onClick={handleCreateSemester}
              disabled={loading}
              variant="default"
            >
              {loading ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
          {message && (
            <p
              className={`mt-4 text-sm ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'
                }`}
            >
              {message}
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateSemesterDialog;

