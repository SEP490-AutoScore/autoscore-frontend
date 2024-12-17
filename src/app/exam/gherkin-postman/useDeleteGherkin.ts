import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { useToastNotification } from "@/hooks/use-toast-notification";

interface UseDeleteGherkinProps {
    selectedGherkins: number[];
    fetchGherkinPostmanPairs: (questionId: number) => Promise<void>;
    storedQuestionId: number | null;
    token: string | null;
    onLoadingChange: (isLoading: boolean) => void;
    examPaperId: number | null;

}

export const useDeleteGherkin = ({
    selectedGherkins,
    fetchGherkinPostmanPairs,
    storedQuestionId,
    token,
    onLoadingChange,
    examPaperId,
}: UseDeleteGherkinProps) => {
    const notify = useToastNotification();

    const deleteGherkin = async () => {
        if (!selectedGherkins.length) {
            notify({
                title: "Validation Error",
                description: "Please select at least one Gherkin Scenario to delete.",
                variant: "destructive",
            });
            return;
        }
        try {
            onLoadingChange(true);
            const gherkinIdsQuery = selectedGherkins.join(",");
            const response = await fetch(
                `${BASE_URL}${API_ENDPOINTS.deleteGherkin}?gherkinScenarioIds=${gherkinIdsQuery}&examPaperId=${examPaperId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Failed to delete Gherkin");
            }
            const responseText = await response.text();
            if (responseText.startsWith("Successfully deleted Gherkin Scenarios")) {
                notify({
                    title: "Success",
                    description: "Deleted Gherkin Scenario successfully.",
                    variant: "default",
                });
            } else {
                notify({
                    title: "Error",
                    description: "Failed to delete Gherkin Scenario.",
                    variant: "destructive",
                });
            }
            if (storedQuestionId !== null) {
                await fetchGherkinPostmanPairs(storedQuestionId);
            } else {
                setTimeout(() => {
                    window.location.reload();
                }, 0);
            }
        } catch (error) {
            notify({
                title: "API Error",
                description: "Failed to delete selected Gherkin Scenarios.",
                variant: "destructive",
            });
        } finally {
            onLoadingChange(false);
        }
    };
    return { deleteGherkin };
};
