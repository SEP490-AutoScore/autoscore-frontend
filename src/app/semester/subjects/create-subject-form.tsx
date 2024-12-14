import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_ENDPOINTS, BASE_URL } from "@/config/apiConfig";

const CreateSubjectDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [subjectName, setSubjectName] = useState<string>('');
  const [subjectCode, setSubjectCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleCreateSubject = async () => {
    setLoading(true);
    setMessage(null);

    const payload = {
      subjectName,
      subjectCode,
    };

    try {
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.getSubject}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setMessage('Subject created successfully!');
        setSubjectName('');
        setSubjectCode('');
        setIsOpen(false); // Đóng dialog sau khi tạo thành công
        window.location.reload(); // Reload lại trang
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.message || 'Failed to create subject.'}`);
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Nút mở dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className='ml-auto text-primary border-primary rounded-full px-6'>Create New Subject</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Subject</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Input Subject Name */}
            <div>
              <label htmlFor="subjectName" className="block text-sm font-medium text-gray-700">
                Subject Name
              </label>
              <Input
                id="subjectName"
                type="text"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                placeholder="Enter subject name"
              />
            </div>
            {/* Input Subject Code */}
            <div>
              <label htmlFor="subjectCode" className="block text-sm font-medium text-gray-700">
                Subject Code
              </label>
              <Input
                id="subjectCode"
                type="text"
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                placeholder="Enter subject code"
              />
            </div>
          </div>
          {/* Footer */}
          <DialogFooter>
            <Button onClick={() => setIsOpen(false)} variant="secondary">
              Cancel
            </Button>
            <Button
              onClick={handleCreateSubject}
              disabled={loading}
              variant="default"
            >
              {loading ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
          {message && (
            <p
              className={`mt-4 text-sm ${
                message.startsWith('Error') ? 'text-red-600' : 'text-green-600'
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

export default CreateSubjectDialog;
