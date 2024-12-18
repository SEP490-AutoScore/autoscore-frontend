import { useState } from 'react';
import { Button } from "@/components/ui/button"; // Ensure the Button component is correct
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { CircleCheckBig } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface CompleteExamPaperButtonProps {
    examPaperId: number;
    examPaperStatus?: string;
}

const CompleteExamPaperButton: React.FC<CompleteExamPaperButtonProps> = ({ examPaperId, examPaperStatus }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const showToast = useToastNotification();

    // If the exam paper status is COMPLETE, return null to prevent rendering the button
    if (examPaperStatus === "COMPLETE") {
        return <></>;
    }

    const handleComplete = async () => {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem('jwtToken'); // Assuming the JWT token is stored in localStorage

        if (!token) {
            setError('No token found. Please log in.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}${API_ENDPOINTS.completeExamPaper}/${examPaperId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Adding the JWT token to the request
                },
            });

            if (!response.ok) {
                throw new Error('Failed to complete exam paper');
            }

            showToast({
                title: "Complete Exam Paper",
                description: "Exam paper completed successfully!",
                variant: "default",
            });
        } catch (err) {
            setError('Failed to complete exam paper');
            showToast({
                title: "Complete Exam Paper",
                description: "Failed to complete exam paper!",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <TooltipProvider delayDuration={0}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            onClick={handleComplete}
                            variant="outline"
                            className="p-2.5 h-10 w-10 rounded-full border-primary text-primary hover:text-white hover:bg-primary"
                            disabled={isLoading} // Disable the button while loading
                        >
                            <CircleCheckBig />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Compelete Exam Paper</TooltipContent>
                </Tooltip>
            </TooltipProvider>
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
};

export default CompleteExamPaperButton;
