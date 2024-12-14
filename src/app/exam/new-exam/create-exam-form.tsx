import { useToastNotification } from "@/hooks/use-toast-notification";
import { useEffect, useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { useNavigate } from "react-router-dom";
import { checkPermission } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Subject {
    subjectId: number;
    subjectCode: string;
    subjectName: string;
}

interface Semester {
    semesterId: number;
    semesterCode: string;
    semesterName: string;
}

export default function CreateExamPage() {
    const showToast = useToastNotification();
    const navigate = useNavigate();
    const hasPermission = checkPermission({ permission: "CREATE_EXAM" });

    const [subjectList, setSubjectList] = useState<Subject[]>([]);
    const [semesterList, setSemesterList] = useState<Semester[]>([]);
    const [formData, setFormData] = useState({
        examCode: "",
        examAt: "",
        gradingAt: "",
        publishAt: "",
        subjectId: 0,
        semesterId: 0,
    });
    const [errors, setErrors] = useState({
        examAt: "",
        gradingAt: "",
        publishAt: "",
    });

    const token = localStorage.getItem("jwtToken");
    if (!token) {
        throw new Error("JWT Token không tồn tại. Vui lòng đăng nhập.");
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [subjectsRes, semestersRes] = await Promise.all([
                    fetch(`${BASE_URL}${API_ENDPOINTS.getSubject}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${BASE_URL}${API_ENDPOINTS.getSemester}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                if (!subjectsRes.ok || !semestersRes.ok) {
                    throw new Error("Failed to fetch data");
                }

                const subjects = await subjectsRes.json();
                const semesters = await semestersRes.json();

                setSubjectList(subjects);
                setSemesterList(semesters);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [token]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    if (!hasPermission) {
        return <></>
    }

    const validateForm = (): boolean => {
        const newErrors: { examAt: string; gradingAt: string; publishAt: string } = {
            examAt: "",
            gradingAt: "",
            publishAt: "",
        };
        const currentDate = new Date();

        if (!formData.examAt || new Date(formData.examAt).getTime() < currentDate.getTime()) {
            newErrors.examAt = "Exam date must be in the future.";
        }

        if (formData.examAt && (!formData.gradingAt || new Date(formData.gradingAt).getTime() < new Date(formData.examAt).getTime())) {
            newErrors.gradingAt = "Grading date must be after the exam date.";
        }

        if (formData.gradingAt && (!formData.publishAt || new Date(formData.publishAt).getTime() < new Date(formData.gradingAt).getTime())) {
            newErrors.publishAt = "Publish date must be after the grading date.";
        }

        setErrors(newErrors);

        // Check if any error messages are non-empty
        const hasErrors = Object.values(newErrors).some((error) => error !== "");
        return !hasErrors;
    };


    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                const response = await fetch(`${BASE_URL}${API_ENDPOINTS.createExam}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) {
                    throw new Error("Failed to create exam");
                }

                showToast({
                    title: "Create success",
                    description: "New exam has been created successfully",
                    variant: "default",
                });

                // Reload the page
                navigate(0);
            } catch (error) {
                showToast({
                    title: "Bad Request.",
                    description: "There was a problem with your request.",
                    variant: "destructive",
                });
            }
        } else {
            showToast({
                title: "Bad Request.",
                description: "There was a problem with your request.",
                variant: "destructive",
            });
        }
    };

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        className="p-2.5 h-10 w-10 rounded-full border-primary text-primary hover:text-white hover:bg-primary"
                    >
                        <Plus className="h-6 w-6" />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Exam</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
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
                        <Button
                            onClick={handleFormSubmit}
                            variant="outline"
                            className="mt-4 w-full py-3 text-lg font-semibold shadow-md focus:ring-2 focus:ring-blue-400"
                        >
                            Create Exam
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
