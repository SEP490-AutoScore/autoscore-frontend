import { useState } from "react";

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

export default function CreateExamForm({ subjectList, semesterList, onSubmit }: Props) {
  const [formData, setFormData] = useState({
    examCode: "",
    examAt: "",
    gradingAt: "",
    publishAt: "",
    subjectId: 0, // Initialize as number, not string
    semesterId: 0, // Initialize as number, not string
  });

  const [errors, setErrors] = useState<{
    examAt?: string;
    gradingAt?: string;
    publishAt?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Reset the error when the user changes the input value
    setErrors((prev) => ({ ...prev, [name]: undefined })); // Set to undefined instead of an empty string
  };

  const validateForm = (): boolean => {
    const newErrors: { examAt?: string; gradingAt?: string; publishAt?: string } = {};
    const currentDate = new Date();

    // Validate examAt
    if (new Date(formData.examAt).getTime() < currentDate.getTime()) {
      newErrors.examAt = "Exam date must be in the future.";
    }

    // Validate gradingAt (should be after examAt)
    if (formData.examAt && new Date(formData.gradingAt).getTime() < new Date(formData.examAt).getTime()) {
      newErrors.gradingAt = "Grading date must be after the exam date.";
    }

    // Validate publishAt (should be after gradingAt)
    if (formData.gradingAt && new Date(formData.publishAt).getTime() < new Date(formData.gradingAt).getTime()) {
      newErrors.publishAt = "Publish date must be after the grading date.";
    }

    setErrors(newErrors);

    // If there are any errors, prevent form submission
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit({
        ...formData,
        subjectId: parseInt(formData.subjectId.toString()), // Ensure the subjectId and semesterId are numbers
        semesterId: parseInt(formData.semesterId.toString()), // Same for semesterId
      });
    }
  };

  return (
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
  );
}
