import { useToastNotification } from "@/hooks/use-toast-notification";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";

export const useGenerateGherkinMore = (
  token: string | null,
  storedQuestionId: number | null,
  selectedGherkinIds: number[] | null,
  fetchGherkinPostmanPairs: (questionId: number) => void,
  setLoading: (loading: boolean) => void
) => {
  const notify = useToastNotification();

  const generateGherkinMore = async () => {
    if (!token || !storedQuestionId || !selectedGherkinIds || selectedGherkinIds.length === 0) {
      notify({
        title: "Validation Error",
        description: "Please choose 1 question before generating Gherkin.",
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
        `${BASE_URL}${API_ENDPOINTS.generateGherkinMore}?examQuestionId=${storedQuestionId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedGherkinIds), 
        }
      );

      if (!response.ok) {
        notify({
          title: "Error",
          description: "Failed to generate Gherkin format. Maybe caused by a missing database.",
          variant: "destructive",
        });
        return;
      }

      const result = await response.text();

      if (result === "Generate gherkin more successfully!") {
        notify({
          title: "Success",
          description: "Generated Gherkin format successfully!",
          variant: "default",
        });
        if (storedQuestionId !== null) {
          await fetchGherkinPostmanPairs(storedQuestionId);
        }
        else {
            setTimeout(() => {
                window.location.reload();
            }, 1000); 
        }
      } else {
        notify({
          title: "Error",
          description: "Failed to generate Gherkin format. Maybe caused by a missing database.",
          variant: "destructive",
        });
      }
    } catch (error) {
      notify({
        title: "API Error",
        description: "Failed to generate Gherkin format. Maybe caused by a missing database.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { generateGherkinMore };
};
