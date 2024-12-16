import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";

type ToastVariant = "default" | "destructive";

export const fixAuthFilePostman = async (
    examPaperId: number,
    token: string,
    notify: (props: { title: string; description: string; variant: ToastVariant }) => void
): Promise<void> => {
    try {
        const response = await fetch(
            `${BASE_URL}${API_ENDPOINTS.fixAuthFilePostman}?examPaperId=${examPaperId}`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (response.ok) {
            const result = await response.text();

            if (result === "All Postman collections updated successfully.") {
                notify({
                    title: "Successfully",
                    description: "Fix auth success.",
                    variant: "default",
                });
            } else {
                notify({
                    title: "Error",
                    description: "Unexpected response: " + result,
                    variant: "destructive",
                });
            }
        } else {
            notify({
                title: "Error",
                description: "Failed to fix Postman collection authentication.",
                variant: "destructive",
            });
        }
    } catch (error) {
        notify({
            title: "Error",
            description: "An error occurred while processing the Postman collection.",
            variant: "destructive",
        });
    }
};
