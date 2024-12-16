import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Alert } from "@/components/ui/alert";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { Skeleton } from "@/components/ui/skeleton";

interface GherkinDialogProps {
    onClose: () => void;
    gherkinScenarioId: number | null;
    storedQuestionId: number | null;
    fetchGherkinPostmanPairs: (questionId: number) => void;
}

export const GherkinDialog: React.FC<GherkinDialogProps> = ({ gherkinScenarioId, storedQuestionId, fetchGherkinPostmanPairs }) => {
    const [gherkinData, setGherkinData] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const notify = useToastNotification();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        if (!gherkinScenarioId) return;

        const fetchGherkinData = async () => {
            setLoading(true);
            setErrorMessage(null);
            try {
                const token = localStorage.getItem("jwtToken");

                // Fetch Postman Data
                const gherkinResponse = await fetch(
                    `${BASE_URL}${API_ENDPOINTS.getGherkinById}/${gherkinScenarioId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                if (!gherkinResponse.ok) {
                    throw new Error("Failed to fetch Gherkin data");
                }
                const gherkinData = await gherkinResponse.json();
                setGherkinData(gherkinData);
            } catch (error) {
                setErrorMessage("Could not fetch data. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchGherkinData();
    }, [gherkinScenarioId]);

    const submitUpdate = async () => {
        setLoading(true);
        setErrorMessage(null);
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                throw new Error("Authorization token is missing. Please log in again.");
            }
            const formData = new FormData();
            formData.append("gherkinData", gherkinData.gherkinData);

            const response = await fetch(`${BASE_URL}${API_ENDPOINTS.updateGherkin}/${gherkinScenarioId}`, {
                method: "PUT",
                headers: {

                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                throw new Error(errorDetails.message || "Failed to update Gherkin.");
            }

            notify({
                title: "Success",
                description: "Gherkin updated successfully!",
                variant: "default",
            });


            if (storedQuestionId !== null) {
                await fetchGherkinPostmanPairs(storedQuestionId);
            } else {
                window.location.reload();
            }
        } catch (error: any) {
            notify({
                title: "Update Failed",
                description: error.message || "An unexpected error occurred.",
                variant: "destructive",
            });
            setErrorMessage(error.message || "Could not update the Gherkin scenario.");
        } finally {
            setLoading(false);
            setIsSubmitting(false);
        }
    };

    return (
        <DialogContent className="p-8 bg-white shadow-lg rounded-lg max-w-7xl mx-auto">

            <DialogHeader>
                <DialogTitle className="text-xl font-semibold">Gherkin Details</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                    Information about the selected Gherkin scenario.
                </DialogDescription>
            </DialogHeader>

            {loading ? (
                <div className="space-y-2">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-48 w-full" />
                </div>
            ) : errorMessage ? (
                <Alert variant="destructive" className="mt-4">
                    {errorMessage}
                </Alert>
            ) : (
                <div className="space-y-4 mt-4">
                    {gherkinData && (
                        <>
                            <label className="block text-sm font-medium text-gray-700">
                                <strong>Gherkin Data:</strong>
                            </label>
                            <textarea
                                className="w-full border rounded-md p-2 text-sm shadow-sm min-h-[100px] h-[250px] resize-none"
                                value={gherkinData.gherkinData || ""}
                                onChange={(e) =>
                                    setGherkinData((prev: any) => ({
                                        ...prev,
                                        gherkinData: e.target.value,
                                    }))
                                }
                                rows={5} // Adjust rows based on expected content size
                                placeholder="Enter Gherkin Data here..."
                                style={{ fontSize: '1rem' }}
                            />
                            <p className="text-sm">
                                <strong>Status:</strong> {gherkinData.status ? "Active" : "Inactive"}
                            </p>
                        </>
                    )}
                </div>
            )}

            <Button
                onClick={submitUpdate}
                disabled={isSubmitting || !gherkinData}
                variant="outline"
                className="w-full py-3 text-lg font-semibold shadow-md focus:ring-2 focus:ring-400"
            >
                {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
        </DialogContent>
    );
};

export default GherkinDialog;
