import { useState } from "react";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";

export const useDeletePostman = (
    selectedPostmans: number[],
    token: string | null,
    storedQuestionId: number | null,
    fetchGherkinPostmanPairs: (questionId: number) => void,
    setLoading: (loading: boolean) => void
) => {
    const [loading, setLoadingState] = useState(false);
    const notify = useToastNotification();

    const deletePostman = async () => {
        if (!selectedPostmans.length) {
            notify({
                title: "Validation Error",
                description: "Please select at least one Postman script to delete.",
                variant: "destructive",
            });
            return;
        }

        try {
            setLoading(true);

            // Make DELETE request to delete selected Postman scripts
            const response = await fetch(
                `${BASE_URL}${API_ENDPOINTS.deletePostman}?postmanForGradingIds=${selectedPostmans.join(',')}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete Postman scripts.");
            }

            const responseText = await response.text();

            if (responseText.includes("successfully")) {
                notify({
                    title: "Success",
                    description: "Deleted Postman successfully.",
                    variant: "default",
                });
            } else {
                notify({
                    title: "Error",
                    description: "Failed to delete Postman script.",
                    variant: "destructive",
                });
            }

            if (storedQuestionId !== null) {
                await fetchGherkinPostmanPairs(storedQuestionId);
            } else {
                setTimeout(() => {
                    window.location.reload();
                }, 500); 
            }
        } catch (error) {
            notify({
                title: "API Error",
                description: "Failed to delete selected Postman scripts.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return { deletePostman, loading };
};
