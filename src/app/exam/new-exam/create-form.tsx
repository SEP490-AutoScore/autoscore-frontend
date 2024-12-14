import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Props {
  subjectList: { subjectId: number; subjectCode: string; subjectName: string }[];
  semesterList: { semesterId: number; semesterCode: string; semesterName: string }[];
  onSubmit: (formData: {
    examCode: string;
    examAt: string;
    gradingAt: string;
    publishAt: string;
    subjectId: number;
    semesterId: number;
  }) => void;
}

export default function CreateExamDialog({ subjectList, semesterList, onSubmit }: Props) {
  const [formData, setFormData] = useState({
    examCode: "",
    examAt: "",
    gradingAt: "",
    publishAt: "",
    subjectId: 0,
    semesterId: 0,
  });

  const [errors, setErrors] = useState<{
    examAt?: string;
    gradingAt?: string;
    publishAt?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: { examAt?: string; gradingAt?: string; publishAt?: string } = {};
    const currentDate = new Date();

    if (new Date(formData.examAt).getTime() < currentDate.getTime()) {
      newErrors.examAt = "Exam date must be in the future.";
    }

    if (formData.examAt && new Date(formData.gradingAt).getTime() < new Date(formData.examAt).getTime()) {
      newErrors.gradingAt = "Grading date must be after the exam date.";
    }

    if (formData.gradingAt && new Date(formData.publishAt).getTime() < new Date(formData.gradingAt).getTime()) {
      newErrors.publishAt = "Publish date must be after the grading date.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit({
        ...formData,
        subjectId: parseInt(formData.subjectId.toString()),
        semesterId: parseInt(formData.semesterId.toString()),
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
          Open Create Exam Form
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Exam</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Exam Code</label>
            <input
              type="text"
              name="examCode"
              value={formData.examCode}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Exam Date & Time</label>
            <input
              type="datetime-local"
              name="examAt"
              value={formData.examAt}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
            />
            {errors.examAt && <span className="text-red-500 text-sm">{errors.examAt}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium">Grading Date & Time</label>
            <input
              type="datetime-local"
              name="gradingAt"
              value={formData.gradingAt}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
            />
            {errors.gradingAt && <span className="text-red-500 text-sm">{errors.gradingAt}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium">Publish Date & Time</label>
            <input
              type="datetime-local"
              name="publishAt"
              value={formData.publishAt}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
            />
            {errors.publishAt && <span className="text-red-500 text-sm">{errors.publishAt}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium">Subject</label>
            <select
              name="subjectId"
              value={formData.subjectId}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value={0}>Select a subject</option>
              {subjectList.map((subject) => (
                <option key={subject.subjectId} value={subject.subjectId}>
                  {subject.subjectName} ({subject.subjectCode})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Semester</label>
            <select
              name="semesterId"
              value={formData.semesterId}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value={0}>Select a semester</option>
              {semesterList.map((semester) => (
                <option key={semester.semesterId} value={semester.semesterId}>
                  {semester.semesterName} ({semester.semesterCode})
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Create Exam
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
