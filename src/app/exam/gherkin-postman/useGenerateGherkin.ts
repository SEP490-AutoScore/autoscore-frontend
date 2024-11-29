import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { useToastNotification } from "@/hooks/use-toast-notification";

export const useGenerateGherkin = (
    token: string | null,
    storedQuestionId: number | null,
    fetchGherkinPostmanPairs: (questionId: number) => void,
    setLoading: (loading: boolean) => void
) => {
    const notify = useToastNotification();

    const generateGherkin = async () => {
        if (!token || !storedQuestionId) {
            notify({
                title: "Validation Error",
                description: "Please choose a question before generating Gherkin.",
                variant: "destructive",
            });
            return;
        }

        notify({
            title: "Generating Gherkin...",
            description: "Please wait while we generate the Gherkin format.",
            variant: "default",
        });

        try {
            setLoading(true);

            const response = await fetch(
                `${BASE_URL}${API_ENDPOINTS.generateGherkin}?examQuestionId=${storedQuestionId}`,
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
                    description: "Failed to generate Gherkin format. Maybe caused by missing database.",
                    variant: "destructive",
                });
            }

            const result = await response.text();

            if (result === "Generate gherkin successfully!") {
                notify({
                    title: "Success",
                    description: "Generate Gherkin format successfully!",
                    variant: "default",
                });

                if (storedQuestionId !== null) {
                    await fetchGherkinPostmanPairs(storedQuestionId);
                }  else {
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000); 
                }
            } else {
                notify({
                    title: "Error",
                    description: "Failed to generate Gherkin format. Maybe API key is incorrect or database is missing.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            notify({
                title: "API Error",
                description: "Failed to generate Gherkin format. Maybe caused by missing database.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return { generateGherkin };
};
