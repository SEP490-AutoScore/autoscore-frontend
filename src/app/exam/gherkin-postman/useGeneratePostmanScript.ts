import { useToastNotification } from "@/hooks/use-toast-notification";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";

export const useGeneratePostmanScript = (
  token: string | null,
  selectedGherkins: number[],
  storedQuestionId: number | null,
  fetchGherkinPostmanPairs: (questionId: number) => void,
  setLoading: (loading: boolean) => void
) => {
  const notify = useToastNotification();

  const generatePostmanScript = async () => {
    if (!selectedGherkins.length) {
      notify({
        title: "No Selection",
        description: "Please select at least one Gherkin Scenario.",
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
      for (const gherkinScenarioId of selectedGherkins) {
        const response = await fetch(
          `${BASE_URL}${API_ENDPOINTS.generatePostman}?gherkinScenarioId=${gherkinScenarioId}`,
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
            description: "AI did not respond, may be AI key wrong.",
            variant: "destructive",
          });
          continue;
        }

        const result = await response.text();
        if (result === "Postman Collection generated successfully!") {
          notify({
            title: "Success",
            description: "Postman Collection generated successfully!",
            variant: "default",
          });
        } else {
          notify({
            title: "Error",
            description: "AI response was wrong.",
            variant: "destructive",
          });
        }
      }

      if (storedQuestionId !== null) {
        await fetchGherkinPostmanPairs(storedQuestionId);
      }
      else {
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
      setLoading(false);
    }
  };

  return { generatePostmanScript };
};
