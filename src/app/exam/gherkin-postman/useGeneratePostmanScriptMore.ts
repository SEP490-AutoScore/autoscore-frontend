import { useState } from "react";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";

export const useGeneratePostmanScriptMore = (
    token: string | null,
    selectedPostmans: number[],
    storedQuestionId: number | null,
    fetchGherkinPostmanPairs: (questionId: number) => void,
    setLoading: (loading: boolean) => void
) => {
    const [loading, setLoadingState] = useState(false);
    const notify = useToastNotification();

    const generatePostmanScriptMore = async () => {
        if (!selectedPostmans.length) {
            notify({
                title: "No Selection",
                description: "Please select at least one Postman script.",
                variant: "default",
            });
            return;
        }

        notify({
            title: "Generating Postman script...",
            description: "Please wait while we generate the Postman script.",
            variant: "default",
        });



        try {
            setLoading(true);
            for (const postmanForGradingId of selectedPostmans) {
                const response = await fetch(
                    `${BASE_URL}${API_ENDPOINTS.generatePostmanMore}?postmanForGradingId=${postmanForGradingId}`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    notify({
                        title: "Error",
                        description: "AI response wrong.",
                        variant: "destructive",
                    });
                    continue; // Skip this iteration and continue with the next Gherkin scenario
                }

                const result = await response.text();
                if (result === "Postman Collection generated more and update successfully!") {
                    notify({
                        title: "Success",
                        description: "Postman Collection generated more and update successfully!",
                        variant: "default",
                    });
                } else {
                    notify({
                        title: "Error",
                        description: "AI response wrong.",
                        variant: "destructive",
                    });
                }
            }

            // Now call fetchGherkinPostmanPairs once, after all iterations are done
            if (storedQuestionId !== null) {
                await fetchGherkinPostmanPairs(storedQuestionId);
            }  else {
                setTimeout(() => {
                    window.location.reload();
                }, 1000); 
            }

        } catch (error) {
            notify({
                title: "API Error",
                description: "An unexpected error occurred while generating Postman scripts.",
                variant: "destructive",
            });
        } finally {
            setLoading(false); // Set loading to false after all iterations are complete
        }
    };

    return { generatePostmanScriptMore, loading };
};
