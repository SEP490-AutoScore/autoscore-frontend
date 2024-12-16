import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";

type ToastVariant = "default" | "destructive";

export const calculateScores = async (
  examPaperId: number,
  notify: (props: { title: string; description: string; variant: ToastVariant }) => void
): Promise<void> => {
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    console.error("JWT token is missing.");
    notify({
      title: "Authorization Error",
      description: "JWT token is missing. Please log in again.",
      variant: "destructive",
    });
    throw new Error("Authorization token is not available.");
  }

  try {
    const response = await fetch(
      `${BASE_URL}${API_ENDPOINTS.calculateScores}?examPaperId=${examPaperId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      const errorMessage = await response.text();
      notify({
        title: "Error",
        description: errorMessage || "Failed to calculate scores.",
        variant: "destructive",
      });
      throw new Error(errorMessage || "Failed to calculate scores.");
    }
    notify({
      title: "Success",
      description: "Scores calculated successfully!",
      variant: "default",
    });
  } catch (error: any) {
    console.error("Error in calculateScores:", error.message || error);
    notify({
      title: "Error",
      description: error.message || "An unexpected error occurred.",
      variant: "destructive",
    });
    throw error;
  }
};
